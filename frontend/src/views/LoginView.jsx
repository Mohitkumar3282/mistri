import React, { useState } from 'react';
import { Lock, Phone, Mail, ArrowRight, ShieldCheck, HardHat, Building } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Logo from '../components/Logo';

export const LoginView = () => {
  const { login, navigateTo, addToast } = useStore();
  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' | 'email'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) return;
    setLoading(true);
    try {
      await login(identifier, password);
      navigateTo('home');
    } catch (err) {
      addToast(err.message || 'Login failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '480px' }}>
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
          padding: '2rem',
          overflow: 'hidden',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Logo size="medium" />
          </div>
          <h1 style={{ fontSize: '1.45rem', color: 'var(--primary-navy)', fontWeight: '800', marginBottom: '4px' }}>
            Sign In to Contractor Portal
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Access wholesale material rates, e-Way bills & order tracking
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Mobile Number or Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                placeholder="+91 98260 11223 or name@builders.com"
                className="form-control"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{ fontSize: '0.925rem', fontWeight: '600' }}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password / Security PIN</label>
              <button
                type="button"
                onClick={() => navigateTo('forgot-password')}
                style={{ background: 'none', border: 'none', color: 'var(--primary-orange)', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ fontSize: '0.925rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--primary-orange)' }}
              />
              <span>Remember me on this device</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            style={{ fontWeight: '800', marginBottom: '1rem' }}
          >
            Sign In to MISTRI
          </button>
        </form>

        {/* Signup Redirect */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have a MISTRI contractor account?{' '}
          <button
            type="button"
            onClick={() => navigateTo('signup')}
            style={{ background: 'none', border: 'none', color: 'var(--primary-orange)', fontWeight: '800', cursor: 'pointer' }}
          >
            Register Now
          </button>
        </div>

        {/* Privacy Policy & Terms Link (Accessible without login) */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid #F1F5F9',
            fontSize: '0.78rem',
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={() => navigateTo('privacy')}
            style={{
              background: 'none',
              border: 'none',
              color: '#0284C7',
              fontWeight: '700',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
              fontSize: '0.78rem',
            }}
          >
            Privacy Policy
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => navigateTo('terms')}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              fontWeight: '600',
              cursor: 'pointer',
              padding: 0,
              fontSize: '0.78rem',
            }}
          >
            Terms of Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
