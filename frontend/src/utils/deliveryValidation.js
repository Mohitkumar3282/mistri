/**
 * Delivery Serviceability Validation Helper
 * Validates customer city, pincode, and distance against Admin's configured delivery ranges & service zones.
 */

export function checkDeliveryServiceability({
  city = '',
  pincode = '',
  distanceKm = null,
  siteSettings = {},
}) {
  // If restriction is explicitly turned off, all areas are accepted
  if (siteSettings.restrictToServiceableAreas === false) {
    return { isServiceable: true, message: 'Delivery available in your area.' };
  }

  const cleanPin = String(pincode || '').replace(/\D/g, '').trim();
  const cleanCity = String(city || '').trim().toLowerCase();

  const allowedPincodes = Array.isArray(siteSettings.serviceablePincodes)
    ? siteSettings.serviceablePincodes.map((p) => String(p).trim()).filter(Boolean)
    : [];

  const allowedCities = Array.isArray(siteSettings.serviceableCities)
    ? siteSettings.serviceableCities.map((c) => String(c).trim().toLowerCase()).filter(Boolean)
    : [];

  const maxKm = Number(siteSettings.maxDeliveryRadiusKm) || 0;

  // 1. Distance check if distance is known and max radius is set
  if (distanceKm !== null && distanceKm !== undefined && maxKm > 0) {
    if (Number(distanceKm) > maxKm) {
      return {
        isServiceable: false,
        reason: `Your site is approx. ${distanceKm} km from our depot, exceeding our maximum delivery radius of ${maxKm} km.`,
        allowedCities,
        allowedPincodes,
      };
    }
  }

  // 2. Direct pincode match
  if (cleanPin && allowedPincodes.length > 0) {
    if (allowedPincodes.includes(cleanPin)) {
      return {
        isServiceable: true,
        matchedBy: 'pincode',
        message: `Delivery available for pincode ${cleanPin}.`,
      };
    }
  }

  // 3. Direct city match
  if (cleanCity && allowedCities.length > 0) {
    if (allowedCities.some((c) => cleanCity.includes(c) || c.includes(cleanCity))) {
      return {
        isServiceable: true,
        matchedBy: 'city',
        message: `Delivery available in ${city}.`,
      };
    }
  }

  // 4. If rules are active but location doesn't match
  if (allowedPincodes.length > 0 || allowedCities.length > 0) {
    const formattedCities = allowedCities
      .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
      .slice(0, 6)
      .join(', ');

    return {
      isServiceable: false,
      reason: `We currently do not accept orders for ${cleanPin ? `pincode ${cleanPin}` : city || 'this location'}. We accept orders in: ${formattedCities || 'specified service zones'} (up to ${maxKm || 50} km range).`,
      allowedCities,
      allowedPincodes,
      maxKm: maxKm || 50,
    };
  }

  return { isServiceable: true, message: 'Delivery available in your area.' };
}
