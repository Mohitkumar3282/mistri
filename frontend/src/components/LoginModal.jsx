import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, LogIn } from 'lucide-react';
import { useAuth } from '../controllers/useAuth';

export const LoginModal = ({ isOpen, onClose }) => {
  const { login, register, loading, error } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer',
  });
  const [localError, setLocalError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (isRegisterMode) {
      if (!form.name || !form.email || !form.password) {
        setLocalError('Please fill in all required fields.');
        return;
      }
      const res = await register(form);
      if (res.success) {
        onClose();
      } else {
        setLocalError(res.message || 'Registration failed');
      }
    } else {
      if (!form.email || !form.password) {
        setLocalError('Please enter email and password.');
        return;
      }
      const res = await login(form.email, form.password);
      if (res.success) {
        onClose();
      } else {
        setLocalError(res.message || 'Login failed');
      }
    }
  };

  const handleDemoFill = (type) => {
    if (type === 'customer') {
      setForm({
        ...form,
        email: 'customer@mistri.com',
        password: 'password123',
      });
    } else {
      setForm({
        ...form,
        email: 'mistri@mistri.com',
        password: 'password123',
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
              {isRegisterMode ? 'Create Mistri Account' : 'Welcome Back'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {isRegisterMode ? 'Sign up to manage and track your bookings' : 'Sign in to access your dashboard'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <div style={{ padding: '1.5rem' }}>
          {(localError || error) && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}>
              {localError || error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegisterMode && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Rahul Sharma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? 'Please wait...' : isRegisterMode ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Logins */}
          {!isRegisterMode && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textAlign: 'center' }}>
                Quick Instant Demo Credentials:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleDemoFill('customer')}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, fontSize: '0.78rem' }}
                >
                  Demo Customer
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('mistri')}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, fontSize: '0.78rem' }}
                >
                  Demo Mistri
                </button>
              </div>
            </div>
          )}

          {/* Toggle Register / Login */}
          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {isRegisterMode ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setLocalError('');
              }}
              style={{ background: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer' }}
            >
              {isRegisterMode ? 'Sign In' : 'Register'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
