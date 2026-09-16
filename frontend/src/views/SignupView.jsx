import React, { useState } from 'react';
import { User, Phone, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Logo from '../components/Logo';

export const SignupView = () => {
  const { signup, navigateTo } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    signup({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      role: 'Customer',
    });
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
            className="btn btn-primary btn-lg btn-block"
            style={{ fontWeight: '800', marginTop: '0.5rem' }}
          >
            Create Account
          </button>
        </form>

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
