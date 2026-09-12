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
};

export default api;
