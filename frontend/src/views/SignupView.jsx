import React, { useState } from 'react';
import { User, Phone, Mail, Lock, Building, ArrowRight, ShieldCheck, HardHat } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Logo from '../components/Logo';

export const SignupView = () => {
  const { signup, navigateTo } = useStore();
  const [role, setRole] = useState('contractor'); // 'contractor' | 'individual'
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    gstin: '',
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
      company: formData.company,
      phone: formData.phone,
      email: formData.email,
      gstin: formData.gstin,
      role: role === 'contractor' ? 'Commercial Builder' : 'Individual Home Builder',
    });
    navigateTo('home');
  };

  return (
    <div className="page-container" style={{ maxWidth: '540px' }}>
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
          padding: '1.75rem',
          overflow: 'hidden',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Logo size="medium" onClick={() => navigateTo('home')} />
          </div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-navy)', fontWeight: '800', marginBottom: '4px' }}>
            Create MISTRI Builder Account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Get wholesale tiered pricing, credit facility & fast site deliveries
          </p>
        </div>

        {/* Account Type Toggle */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1.5rem', backgroundColor: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-sm)' }}>
          <button
            type="button"
            onClick={() => setRole('contractor')}
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-xs)',
              background: role === 'contractor' ? 'var(--primary-navy)' : 'transparent',
              color: role === 'contractor' ? '#FFFFFF' : 'var(--text-primary)',
              fontWeight: '700',
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <HardHat size={16} />
            <span>Contractor</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('individual')}
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-xs)',
              background: role === 'individual' ? 'var(--primary-navy)' : 'transparent',
              color: role === 'individual' ? '#FFFFFF' : 'var(--text-primary)',
              fontWeight: '700',
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <User size={16} />
            <span>Home Builder</span>
          </button>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: '#FEF3F2', border: '1px solid #FDA29B', color: '#D92D20', padding: '8px 12px', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="responsive-split-equal" style={{ gap: '1rem', marginBottom: '0.75rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
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
              <label className="form-label">Mobile Number</label>
              <input
                type="tel"
                required
                placeholder="+91 98260 00000"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Company / Builder Firm Name</label>
            <input
              type="text"
              placeholder="e.g. Mehta Infra & Constructions"
              className="form-control"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>

          <div className="responsive-split-equal" style={{ gap: '1rem', marginBottom: '0.75rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">GSTIN (Optional)</label>
              <input
                type="text"
                placeholder="23AAB..."
                className="form-control"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
              />
            </div>
          </div>

          <div className="responsive-split-equal" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Create Password</label>
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
              <label className="form-label">Confirm Password</label>
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
            style={{ fontWeight: '800' }}
          >
            Create MISTRI Account
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
