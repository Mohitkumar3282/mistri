import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import AuthLayout from '../components/AuthLayout';

const REMEMBER_KEY = 'mistri_remember_identifier';

export const LoginView = () => {
  const { login, navigateTo, addToast } = useStore();

  const [identifier, setIdentifier] = useState(() => {
    try { return localStorage.getItem(REMEMBER_KEY) || ''; } catch (err) { return ''; }
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    try { return !!localStorage.getItem(REMEMBER_KEY); } catch (err) { return true; }
  });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!identifier.trim()) errors.identifier = 'Email or phone number is required';
    if (!password) errors.password = 'Password is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    setLoading(true);
    try {
      await login(identifier.trim(), password);
      try {
        if (rememberMe) localStorage.setItem(REMEMBER_KEY, identifier.trim());
        else localStorage.removeItem(REMEMBER_KEY);
      } catch (err) {}
      navigateTo('home');
    } catch (err) {
      addToast(err.message || 'Login failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-tabs">
        <button type="button" className="auth-tab-btn active">Login</button>
        <button type="button" className="auth-tab-btn" onClick={() => navigateTo('signup')}>Register</button>
      </div>

      <div className="auth-form-wrap">
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '1rem' }}>
            <label className="auth-label" htmlFor="login-identifier">Email Address or Phone Number</label>
            <div className="auth-input-wrap">
              <Mail size={17} className="auth-input-icon" />
              <input
                id="login-identifier"
                type="text"
                autoComplete="username"
                placeholder="Email or Phone Number"
                className={`auth-input${fieldErrors.identifier ? ' auth-input-error' : ''}`}
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (fieldErrors.identifier) setFieldErrors((prev) => ({ ...prev, identifier: undefined }));
                }}
              />
            </div>
            {fieldErrors.identifier && <div className="auth-error-text">{fieldErrors.identifier}</div>}
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <label className="auth-label" htmlFor="login-password">Password</label>
            <div className="auth-input-wrap">
              <Lock size={17} className="auth-input-icon" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Password"
                className={`auth-input${fieldErrors.password ? ' auth-input-error' : ''}`}
                style={{ paddingRight: '42px' }}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
              />
              <button type="button" className="auth-input-toggle" onClick={() => setShowPassword((v) => !v)} tabIndex={-1} aria-label="Toggle password visibility">
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {fieldErrors.password && <div className="auth-error-text">{fieldErrors.password}</div>}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0.9rem 0 1.25rem 0', fontSize: '0.84rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', color: 'var(--auth-text-secondary)' }}>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} style={{ accentColor: 'var(--auth-orange)', width: '15px', height: '15px' }} />
              Remember me
            </label>
            <button type="button" onClick={() => navigateTo('forgot-password')} style={{ background: 'none', border: 'none', color: 'var(--auth-orange)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="auth-btn-primary" disabled={loading}>
            {loading ? (<><span className="auth-spinner" /><span>Signing in...</span></>) : (<><span>Sign In to MISTRI</span><ArrowRight size={17} /></>)}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginView;
