import React, { useState } from 'react';
import { Lock, Phone, Mail, ArrowRight, ShieldCheck, HardHat, Building } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Logo from '../components/Logo';

export const LoginView = () => {
  const { login, navigateTo } = useStore();
  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' | 'email'
  const [identifier, setIdentifier] = useState('+91 98260 11223');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier || !password) return;
    login(identifier, password);
    navigateTo('home');
  };

  const handleDemoContractor = () => {
    setIdentifier('+91 98260 11223');
    setPassword('password123');
    login('rajesh.malviya@malviyabuilders.com', 'password123');
    navigateTo('home');
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
            <Logo size="medium" onClick={() => navigateTo('home')} />
          </div>
          <h1 style={{ fontSize: '1.45rem', color: 'var(--primary-navy)', fontWeight: '800', marginBottom: '4px' }}>
            Sign In to Contractor Portal
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Access wholesale material rates, e-Way bills & order tracking
          </p>
        </div>

        {/* Quick Demo Login Preset Button */}
        <div style={{ marginBottom: '1.5rem', backgroundColor: 'var(--navy-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary-navy)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-navy)', marginBottom: '6px' }}>
            ⚡ Instant 1-Click Demo Login:
          </div>
          <button
            type="button"
            onClick={handleDemoContractor}
            className="btn btn-navy btn-sm btn-block"
            style={{ fontSize: '0.8rem', fontWeight: '700' }}
          >
            Login as Er. Rajesh Malviya (Gold Builder)
          </button>
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

        {/* Google / OTP UI Mockup */}
        <div style={{ textAlign: 'center', margin: '1.25rem 0', position: 'relative' }}>
          <div style={{ borderTop: '1px solid var(--border-subtle)', position: 'absolute', top: '50%', left: 0, right: 0 }} />
          <span style={{ position: 'relative', background: '#FFFFFF', padding: '0 10px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Or continue with
          </span>
        </div>

        <button
          type="button"
          onClick={handleDemoContractor}
          className="btn btn-secondary btn-block"
          style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}
        >
          <Building size={16} />
          <span>Sign In with GSTIN / Builder Account</span>
        </button>

        {/* Signup Redirect */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have a MISTRI contractor account?{' '}
          <button
            type="button"
            onClick={() => navigateTo('signup')}
            style={{ background: 'none', border: 'none', color: 'var(--primary-orange)', fontWeight: '800', cursor: 'pointer' }}
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
