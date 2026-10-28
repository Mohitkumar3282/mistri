/**
 * Utility functions for calculating delivery schedules and after-closing-time cutoff
 * notices. The cutoff is the admin-set shop closing time (settings.shopClosingTime,
 * default 8:00 PM): orders placed at or after it, or before the shop opens
 * (settings.shopOpeningTime, default 6:00 AM), are scheduled for Next Day delivery.
 */

// "20:00" -> "8:00 PM"
function formatHourLabel(hhmm, fallback) {
  const [h, m] = String(hhmm || '').split(':').map(Number);
  if (Number.isNaN(h)) return fallback;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const minuteStr = String(m || 0).padStart(2, '0');
  return `${hour12}:${minuteStr} ${period}`;
}

export function formatDateDDMMYYYY(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export function formatDateLong(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getDeliverySchedule(input, settings = {}) {
  const expressEnabled = settings.expressDeliveryEnabled !== false;
  const expressEstimate = settings.expressDeliveryEstimate || '60-90 Mins';
  const closingHour = parseInt(String(settings.shopClosingTime || '20:00').split(':')[0], 10) || 20;
  const openingHour = parseInt(String(settings.shopOpeningTime || '06:00').split(':')[0], 10) || 6;
  const closingLabel = formatHourLabel(settings.shopClosingTime, '8:00 PM');
  const openingLabel = formatHourLabel(settings.shopOpeningTime, '6:00 AM');
  let orderTime = new Date();

  if (input instanceof Date) {
    orderTime = input;
  } else if (input && typeof input === 'object') {
    if (input.createdAt) {
      const parsed = new Date(input.createdAt);
      if (!isNaN(parsed.getTime())) orderTime = parsed;
    } else if (input.date) {
      // Handle "YYYY-MM-DD" or "DD-MM-YYYY" + time
      if (input.date.includes('-')) {
        const parts = input.date.split('-');
        let year, month, day;
        if (parts[0].length === 4) {
          [year, month, day] = parts;
        } else {
          [day, month, year] = parts;
        }
        const timeStr = input.time || '12:00';
        const parsed = new Date(`${year}-${month}-${day}T${timeStr.includes(':') && timeStr.length <= 5 ? timeStr + ':00' : '12:00:00'}`);
        if (!isNaN(parsed.getTime())) orderTime = parsed;
      }
    }
  }

  const hours = orderTime.getHours();
  // Cutoff at the admin-set closing hour onwards, or before the admin-set opening hour.
  // Kept as `isAfter8PM` for the many existing call sites, even though the actual hour
  // is now whatever the admin configured, not necessarily 8 PM.
  const isAfter8PM = hours >= closingHour || hours < openingHour;

  const orderDateStr = formatDateDDMMYYYY(orderTime);
  const orderDateLong = formatDateLong(orderTime);

  // Delivery date calculation
  const deliveryDateObj = new Date(orderTime);
  if (isAfter8PM) {
    // Next day delivery
    deliveryDateObj.setDate(deliveryDateObj.getDate() + 1);
  }

  const deliveryDateStr = formatDateDDMMYYYY(deliveryDateObj);
  const deliveryDateLong = formatDateLong(deliveryDateObj);

  const deliveryMessage = isAfter8PM
    ? `Your order will be delivered on ${deliveryDateStr}`
    : `Your order will be delivered today (${deliveryDateStr})`;

  const checkoutBannerMessage = isAfter8PM
    ? `🌙 Night Order Notice: Orders placed after ${closingLabel} are scheduled for Next Day Delivery on ${deliveryDateStr}.`
    : expressEnabled
    ? `⚡ Express Daytime Delivery: Fast dispatch active for orders placed before ${closingLabel}.`
    : `Your order will be delivered today (${deliveryDateStr}).`;

  const topHeaderNotice = `Your order will be delivered on ${deliveryDateStr}`;

  return {
    isAfter8PM,
    expressEnabled,
    closingTimeLabel: closingLabel,
    openingTimeLabel: openingLabel,
    orderDate: orderDateStr,
    orderDateLong,
    deliveryDate: deliveryDateStr,
    deliveryDateLong,
    deliveryMessage,
    checkoutBannerMessage,
    topHeaderNotice,
    expectedDelivery: isAfter8PM
      ? `Tomorrow (${deliveryDateStr}), by 12:00 PM`
      : expressEnabled
      ? `Today (${deliveryDateStr}), Express in ${expressEstimate}`
      : `Today (${deliveryDateStr})`,
  };
}
