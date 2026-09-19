import React, { useState } from 'react';
import { User, Phone, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Logo from '../components/Logo';

export const SignupView = () => {
  const { signup, loginWithGoogle, navigateTo } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await signup({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        role: 'Customer',
      });
      navigateTo('home');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigateTo('home');
    } catch (err) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err?.message || 'Google sign-up failed');
      }
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
          padding: '2rem 1.75rem',
          overflow: 'hidden',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Logo size="medium" onClick={() => navigateTo('home')} />
          </div>
          <h1 style={{ fontSize: '1.45rem', color: 'var(--primary-navy)', fontWeight: '800', marginBottom: '4px' }}>
            Create Your Account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Quick sign up to manage site orders, deliveries & e-Invoices
          </p>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: '#FEF3F2', border: '1px solid #FDA29B', color: '#D92D20', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 700 }}>Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Anand Mehta"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 700 }}>Mobile Number *</label>
            <input
              type="tel"
              required
              placeholder="+91 98260 00000"
              className="form-control"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 700 }}>Email Address *</label>
            <input
              type="email"
              required
              placeholder="name@email.com"
              className="form-control"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="responsive-split-equal" style={{ gap: '0.75rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 700 }}>Password *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="form-control"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 700 }}>Confirm Password *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="form-control"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg btn-block"
            style={{ fontWeight: '800', marginTop: '0.5rem' }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Google / Social Auth */}
        <div style={{ textAlign: 'center', margin: '1.25rem 0 1rem 0', position: 'relative' }}>
          <div style={{ borderTop: '1px solid var(--border-subtle)', position: 'absolute', top: '50%', left: 0, right: 0 }} />
          <span style={{ position: 'relative', background: '#FFFFFF', padding: '0 10px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Or register with
          </span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={loading}
          className="btn btn-secondary btn-block"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            fontSize: '0.875rem',
            fontWeight: 700,
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
          <span>Sign Up with Google</span>
        </button>

        {/* Redirect */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already registered on MISTRI?{' '}
          <button
            type="button"
            onClick={() => navigateTo('login')}
            style={{ background: 'none', border: 'none', color: 'var(--primary-orange)', fontWeight: '800', cursor: 'pointer' }}
          >
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupView;
