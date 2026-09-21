const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Resolve the bearer token to send.
 *  - 'admin': the administrator session only
 *  - 'user':  the shopper session only (so their own orders are stamped as theirs)
 *  - default: prefer an admin session, otherwise the shopper session
 */
function getAuthToken(auth) {
  try {
    if (auth === 'admin') return localStorage.getItem('mistri_admin_token');
    if (auth === 'user') return localStorage.getItem('mistri_token');
    return localStorage.getItem('mistri_admin_token') || localStorage.getItem('mistri_token');
  } catch (err) {
    return null;
  }
}

/**
 * Common request helper. Options beyond fetch's own:
 *  - auth:  which session token to send (see getAuthToken)
 *  - quiet: do not log failures (for calls the caller handles itself)
 * Thrown errors carry the HTTP `status` (0 when the server was unreachable).
 */
async function request(endpoint, options = {}) {
  const { auth, quiet, ...fetchOptions } = options;
  const token = getAuthToken(auth);

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...fetchOptions.headers,
  };

  try {
    let response;
    try {
      response = await fetch(`${API_BASE}${endpoint}`, { ...fetchOptions, headers });
    } catch (networkErr) {
      const err = new Error('Server unreachable');
      err.status = 0;
      throw err;
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const err = new Error(data.message || `Request failed (${response.status})`);
      err.status = response.status;
      throw err;
    }

    return data;
  } catch (err) {
    if (!quiet) console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

const withQuery = (path, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return `${path}${query ? `?${query}` : ''}`;
};

const json = (method, body, extra = {}) => ({ method, body: JSON.stringify(body), ...extra });

/**
 * Generic access to a server collection addressed by a string key
 * (`/products/prod_1`, `/coupons/SAVE10`, ...).
 */
const collection = {
  list: (path, opts = {}) => request(path, opts),
  create: (path, body, opts = {}) => request(path, json('POST', body, opts)),
  save: (path, key, body, opts = {}) => request(`${path}/${encodeURIComponent(key)}`, json('PUT', body, opts)),
  remove: (path, key, opts = {}) => request(`${path}/${encodeURIComponent(key)}`, { method: 'DELETE', ...opts }),
};

export const api = {
  collection,

  // Authentication
  // Callers show these errors to the person signing in, so they are not logged here.
  login: (email, password) => request('/auth/login', json('POST', { email, password }, { quiet: true })),
  register: (userData) => request('/auth/register', json('POST', userData, { quiet: true })),
  firebaseLogin: (idToken) => request('/auth/firebase', json('POST', { idToken }, { quiet: true })),
  getMe: () => request('/auth/me'),

  // Saved addresses & wishlist of the signed-in shopper
  getAccountData: () => request('/auth/account', { auth: 'user', quiet: true }),
  saveAccountData: (data) => request('/auth/account', json('PUT', data, { auth: 'user', quiet: true })),

  // Products (Materials)
  getProducts: (params = {}) => request(withQuery('/products', params)),
  getProductById: (id) => request(`/products/${id}`),
  createProduct: (data) => request('/products', json('POST', data)),
  updateProduct: (id, data) => request(`/products/${id}`, json('PATCH', data)),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  // Categories & storefront sections
  getCategories: () => request('/categories'),
  getCategoryById: (id) => request(`/categories/${id}`),
  createCategory: (data) => request('/categories', json('POST', data)),
  updateCategory: (id, data) => request(`/categories/${id}`, json('PATCH', data)),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
  getCategorySections: () => request('/category-sections'),

  // Orders
  getOrders: (params = {}) => request(withQuery('/orders', params)),
  getOrderById: (id) => request(`/orders/${id}`),
  createOrder: (data) => request('/orders', json('POST', data, { auth: 'user', quiet: true })),
  updateOrder: (id, data) => request(`/orders/${id}`, json('PATCH', data)),
  deleteOrder: (id) => request(`/orders/${id}`, { method: 'DELETE' }),

  // Services
  getServices: (params = {}) => request(withQuery('/services', params)),
  getServiceById: (id) => request(`/services/${id}`),

  // Mistris / Technicians
  getMistris: (params = {}) => request(withQuery('/mistris', params)),
  getMistriById: (id) => request(`/mistris/${id}`),

  // Bookings
  createBooking: (data) => request('/bookings', json('POST', data, { auth: 'user' })),
  getMyBookings: () => request('/bookings/my', { auth: 'user' }),
  updateBookingStatus: (id, status) => request(`/bookings/${id}`, json('PATCH', { status })),

  // Coupons
  getCoupons: () => request('/coupons'),
  createCoupon: (data) => request('/coupons', json('POST', data)),
  updateCoupon: (code, data) => request(`/coupons/${encodeURIComponent(code)}`, json('PATCH', data)),
  deleteCoupon: (code) => request(`/coupons/${encodeURIComponent(code)}`, { method: 'DELETE' }),

  // Quotations
  getQuotations: () => request('/quotations'),
  updateQuotation: (id, data) => request(`/quotations/${id}`, json('PATCH', data)),

  // Platform settings
  getSettings: () => request('/settings'),
  updateSettings: (data) => request('/settings', json('PUT', data)),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAdminUsers: () => request('/admin/users', { auth: 'admin' }),

  // Payments
  getPaymentKey: () => request('/payments/key'),
  // Always the shopper's session: the payment must belong to the account placing the order.
  createPaymentOrder: (data) => request('/payments/create-order', json('POST', data, { auth: 'user', quiet: true })),
  verifyPayment: (data) => request('/payments/verify', json('POST', data, { auth: 'user' })),

  // Media & Cloudinary Uploads
  uploadImage: async (file, folder = 'mistri/general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const token = getAuthToken();
    const response = await fetch(`${API_BASE}/upload/image`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }
    return data;
  },
  uploadBase64Image: (base64String, folder = 'mistri/general') =>
    request('/upload/base64', json('POST', { image: base64String, folder })),
  getUploadStatus: () => request('/upload/status'),
};

export default api;
