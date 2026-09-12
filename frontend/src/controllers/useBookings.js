import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Controller hook for managing customer & admin bookings
 */
export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getMyBookings();
      if (res.success && res.data) {
        setBookings(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const createBooking = async (bookingData) => {
    try {
      const res = await api.createBooking(bookingData);
      if (res.success && res.data) {
        setBookings((prev) => [res.data, ...prev]);
        return { success: true, data: res.data };
      }
      return { success: false, message: 'Could not create booking' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.updateBookingStatus(id, status);
      if (res.success && res.data) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: status } : b))
        );
        return { success: true };
      }
      return { success: false, message: 'Update failed' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return {
    bookings,
    loading,
    error,
    createBooking,
    updateStatus,
    refresh: fetchBookings,
  };
};
