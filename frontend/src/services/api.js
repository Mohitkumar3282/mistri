const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Common request helper
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('mistri_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Network response error');
    }

    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Authentication
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getMe: () => request('/auth/me'),

  // Products (Materials)
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? `?${query}` : ''}`);
  },

  getProductById: (id) => request(`/products/${id}`),

  createProduct: (productData) =>
    request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  updateProduct: (id, productData) =>
    request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),

  deleteProduct: (id) =>
    request(`/products/${id}`, {
      method: 'DELETE',
    }),

  // Categories
  getCategories: () => request('/categories'),
  getCategoryById: (id) => request(`/categories/${id}`),
  createCategory: (data) =>
    request('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCategory: (id, data) =>
    request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCategory: (id) =>
    request(`/categories/${id}`, {
      method: 'DELETE',
    }),

  // Orders
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/orders${query ? `?${query}` : ''}`);
  },
  getOrderById: (id) => request(`/orders/${id}`),
  createOrder: (orderData) =>
    request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
  updateOrder: (id, orderData) =>
    request(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    }),
  deleteOrder: (id) =>
    request(`/orders/${id}`, {
      method: 'DELETE',
    }),

  // Services
  getServices: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/services${query ? `?${query}` : ''}`);
  },

  getServiceById: (id) => request(`/services/${id}`),

  // Mistris / Technicians
  getMistris: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/mistris${query ? `?${query}` : ''}`);
  },

  getMistriById: (id) => request(`/mistris/${id}`),

  // Bookings
  createBooking: (bookingData) =>
    request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),

  getMyBookings: () => request('/bookings/my'),

  updateBookingStatus: (id, status) =>
    request(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Admin APIs
  getAdminStats: () => request('/admin/stats'),
  getCoupons: () => request('/admin/coupons'),
  createCoupon: (data) =>
    request('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCoupon: (code, data) =>
    request(`/admin/coupons/${code}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCoupon: (code) =>
    request(`/admin/coupons/${code}`, {
      method: 'DELETE',
    }),
  getQuotations: () => request('/admin/quotations'),
  updateQuotation: (id, data) =>
    request(`/admin/quotations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  getSettings: () => request('/admin/settings'),
  updateSettings: (data) =>
    request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Payments
  getPaymentKey: () => request('/payments/key'),
  createPaymentOrder: (data) =>
    request('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  verifyPayment: (data) =>
    request('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Media & Cloudinary Uploads
  uploadImage: async (file, folder = 'mistri/general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const token = localStorage.getItem('mistri_token');
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
    request('/upload/base64', {
      method: 'POST',
      body: JSON.stringify({ image: base64String, folder }),
    }),
  getUploadStatus: () => request('/upload/status'),
};

export default api;
