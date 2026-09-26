/**
 * Utility functions for calculating delivery schedules and after-8 PM cutoff notices.
 * Cutoff: Orders placed at or after 8:00 PM (20:00) are scheduled for Next Day delivery.
 */

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

export function getDeliverySchedule(input) {
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
  // Cutoff at 8:00 PM (20:00) onwards or early morning before 6 AM
  const isAfter8PM = hours >= 20 || hours < 6;

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
    ? `🌙 Night Order Notice: Orders placed after 8:00 PM are scheduled for Next Day Delivery on ${deliveryDateStr}.`
    : `⚡ Express Daytime Delivery: Fast dispatch active for orders placed before 8:00 PM.`;

  const topHeaderNotice = `Your order will be delivered on ${deliveryDateStr}`;

  return {
    isAfter8PM,
    orderDate: orderDateStr,
    orderDateLong,
    deliveryDate: deliveryDateStr,
    deliveryDateLong,
    deliveryMessage,
    checkoutBannerMessage,
    topHeaderNotice,
    expectedDelivery: isAfter8PM
      ? `Tomorrow (${deliveryDateStr}), by 12:00 PM`
      : `Today (${deliveryDateStr}), Express in 60-90 Mins`,
  };
}
