/**
 * Push Notification Service for Mistri Platform
 * Dispatches native browser & mobile web push notifications for Customers and Admins.
 */

let swRegistration = null;

/**
 * Register Service Worker for background push notifications
 */
export const registerServiceWorker = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    swRegistration = registration;
    console.log('🔔 Mistri Push Notification Service Worker registered successfully.');
    return registration;
  } catch (err) {
    console.warn('Service Worker registration note:', err.message || err);
    return null;
  }
};

/**
 * Check if notifications are supported on this browser/device
 */
export const isNotificationSupported = () => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

/**
 * Check current permission status ('default', 'granted', 'denied')
 */
export const getNotificationPermission = () => {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
};

/**
 * Request permission from user
 */
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) return 'unsupported';

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Send a welcome test notification
      sendNativeNotification('🔔 Notifications Enabled!', {
        body: 'You will now receive instant push alerts for material orders and deliveries.',
        tag: 'welcome-notification',
      });
    }
    return permission;
  } catch (err) {
    console.error('Failed to request notification permission:', err);
    return 'denied';
  }
};

/**
 * Low-level notification dispatcher
 */
export const sendNativeNotification = async (title, options = {}) => {
  if (!isNotificationSupported()) return false;

  // Auto-request or check permission
  if (Notification.permission !== 'granted') {
    return false;
  }

  const defaultOptions = {
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    renotify: true,
    data: { url: window.location.origin },
    ...options,
  };

  try {
    // 1. Try via Service Worker (best for mobile browsers & background)
    if (swRegistration && 'showNotification' in swRegistration) {
      await swRegistration.showNotification(title, defaultOptions);
      return true;
    }

    // 2. Try via ready ServiceWorkerRegistration
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && 'showNotification' in reg) {
        await reg.showNotification(title, defaultOptions);
        return true;
      }
    }

    // 3. Fallback to standard Window Notification
    const notif = new Notification(title, defaultOptions);
    if (defaultOptions.data?.url) {
      notif.onclick = () => {
        window.focus();
        notif.close();
      };
    }
    return true;
  } catch (err) {
    console.warn('Native notification dispatch error:', err);
    return false;
  }
};

/**
 * Send Customer Notification: "Order Placed Successfully"
 * @param {object} order - The placed order object
 */
export const sendCustomerOrderNotification = async (order) => {
  if (!order) return;

  const orderId = order.orderNumber || order.id || 'MST-NEW';
  const total = (order.grandTotal || order.total || order.summary?.totalAmount || 0).toLocaleString('en-IN');
  const delivery = order.expectedDelivery || 'Tomorrow';
  const itemsCount = (order.items || []).reduce((acc, i) => acc + (i.quantity || 1), 0);

  const title = `📦 Order Placed Successfully! (${orderId})`;
  const body = `Your order for ${itemsCount} items (₹${total}) is confirmed! Expected delivery: ${delivery}.`;

  return sendNativeNotification(title, {
    body,
    tag: `order-${orderId}`,
    vibrate: [250, 100, 250],
    data: {
      url: `${window.location.origin}/my-orders`,
      orderId,
    },
  });
};

/**
 * Send Admin Notification: "🚨 New Order Received!"
 * @param {object} order - The placed order object
 */
export const sendAdminNewOrderNotification = async (order) => {
  if (!order) return;

  const orderId = order.orderNumber || order.id || 'MST-NEW';
  const total = (order.grandTotal || order.total || order.summary?.totalAmount || 0).toLocaleString('en-IN');
  const customerName = order.customerName || 'Contractor / Builder';
  const payMethod = order.paymentMethod || order.payment?.method || 'Online';
  const city = order.siteAddress?.city || 'Indore';

  const title = `🚨 New Order Received! #${orderId}`;
  const body = `${customerName} placed an order for ₹${total} (${payMethod}). Site: ${city}. Tap to review.`;

  return sendNativeNotification(title, {
    body,
    tag: `admin-order-${orderId}`,
    vibrate: [350, 120, 350, 120, 350], // Distinct attention buzz
    data: {
      url: `${window.location.origin}/admin?tab=orders`,
      orderId,
    },
  });
};

/**
 * Sync FCM Token with Mistri Backend
 * @param {string} fcmToken - The Firebase Cloud Messaging device registration token
 * @param {string} authToken - Optional Bearer JWT token of the user
 */
export const syncFcmTokenWithBackend = async (fcmToken, authToken = null) => {
  if (!fcmToken) return null;

  try {
    const apiUrl = import.meta.env.DEV
      ? (import.meta.env.VITE_DEV_API_URL || '/api')
      : (import.meta.env.VITE_API_URL || 'https://mistri-s2c0.onrender.com/api');
    const headers = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${apiUrl}/auth/fcm-token`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ fcmToken }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('Failed to sync FCM token with backend:', err);
    return null;
  }
};

export default {
  registerServiceWorker,
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  sendNativeNotification,
  sendCustomerOrderNotification,
  sendAdminNewOrderNotification,
  syncFcmTokenWithBackend,
};

