import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mistri_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('mistri_token');
    if (token && !user) {
      api.getMe()
        .then((res) => {
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('mistri_user', JSON.stringify(res.data));
          }
        })
        .catch(() => {
          logout();
        });
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.login(email, password);
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('mistri_token', res.data.token);
        localStorage.setItem('mistri_user', JSON.stringify(res.data));
        return { success: true };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (err) {
      setError(err.message || 'Login failed');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.register(userData);
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('mistri_token', res.data.token);
        localStorage.setItem('mistri_user', JSON.stringify(res.data));
        return { success: true };
      }
      return { success: false, message: 'Registration failed' };
    } catch (err) {
      setError(err.message || 'Registration failed');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mistri_token');
    localStorage.removeItem('mistri_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
