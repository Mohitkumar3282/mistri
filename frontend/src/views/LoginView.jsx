import React, { useState } from 'react';
import { Lock, Phone, Mail, ArrowRight, ShieldCheck, HardHat, Building } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Logo from '../components/Logo';

export const LoginView = () => {
  const { login, loginWithGoogle, navigateTo } = useStore();
  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' | 'email'
  const [identifier, setIdentifier] = useState('+91 98260 11223');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) return;
    setLoading(true);
    try {
      await login(identifier, password);
      navigateTo('home');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigateTo('home');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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

        {/* Google / Social Auth */}
        <div style={{ textAlign: 'center', margin: '1.25rem 0 1rem 0', position: 'relative' }}>
          <div style={{ borderTop: '1px solid var(--border-subtle)', position: 'absolute', top: '50%', left: 0, right: 0 }} />
          <span style={{ position: 'relative', background: '#FFFFFF', padding: '0 10px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Or continue with
          </span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="btn btn-secondary btn-block"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            fontSize: '0.875rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #CBD5E1',
            color: '#1E293B',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>

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
