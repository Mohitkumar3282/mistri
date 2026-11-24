import React, { useState, useMemo } from 'react';
import { User, Phone, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import AuthLayout from '../components/AuthLayout';

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '#E2E8F0' };
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score: 1, label: 'Weak', color: '#DC2626' };
  if (score <= 3) return { score: 2, label: 'Fair', color: '#F59E0B' };
  if (score === 4) return { score: 3, label: 'Good', color: '#2563EB' };
  return { score: 4, label: 'Strong', color: '#16A34A' };
}

export const SignupView = () => {
  const { signup, navigateTo, addToast } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Not shown as a field anymore (per the current design), but a referral link
    // like ?ref=CODE still gets picked up and credited automatically.
    referralCode: new URLSearchParams(window.location.search).get('ref') || '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

  const setField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    else if (formData.phone.replace(/\D/g, '').length < 10) errors.phone = 'Enter a valid 10-digit phone number';
    if (formData.email.trim() && !/^\S+@\S+\.\S+$/.test(formData.email.trim())) errors.email = 'Enter a valid email address';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    setLoading(true);
    try {
      await signup({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: 'Customer',
        referralCode: formData.referralCode.trim().toUpperCase(),
      });
      navigateTo('home');
    } catch (err) {
      addToast(err.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-tabs">
        <button type="button" className="auth-tab-btn" onClick={() => navigateTo('login')}>Login</button>
        <button type="button" className="auth-tab-btn active">Register</button>
      </div>

      <div className="auth-form-wrap">
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
          <div>
            <label className="auth-label" htmlFor="signup-name">Full Name *</label>
            <div className="auth-input-wrap">
              <User size={17} className="auth-input-icon" />
              <input id="signup-name" type="text" autoComplete="name" placeholder="Full Name" className={`auth-input${fieldErrors.name ? ' auth-input-error' : ''}`} value={formData.name} onChange={(e) => setField('name', e.target.value)} />
            </div>
            {fieldErrors.name && <div className="auth-error-text">{fieldErrors.name}</div>}
          </div>

          <div>
            <label className="auth-label" htmlFor="signup-phone">Phone Number *</label>
            <div className="auth-input-wrap">
              <Phone size={17} className="auth-input-icon" />
              <input id="signup-phone" type="tel" autoComplete="tel" placeholder="Phone Number" className={`auth-input${fieldErrors.phone ? ' auth-input-error' : ''}`} value={formData.phone} onChange={(e) => setField('phone', e.target.value)} />
            </div>
            {fieldErrors.phone && <div className="auth-error-text">{fieldErrors.phone}</div>}
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="auth-label" htmlFor="signup-email" style={{ marginBottom: 0 }}>Email Address</label>
              <span style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--auth-text-secondary)', backgroundColor: '#EEF2F8', padding: '2px 8px', borderRadius: '9999px' }}>Optional</span>
            </div>
            <div className="auth-input-wrap">
              <Mail size={17} className="auth-input-icon" />
              <input id="signup-email" type="email" autoComplete="email" placeholder="Email Address (Optional)" className={`auth-input${fieldErrors.email ? ' auth-input-error' : ''}`} value={formData.email} onChange={(e) => setField('email', e.target.value)} />
            </div>
            {fieldErrors.email && <div className="auth-error-text">{fieldErrors.email}</div>}
          </div>

          <div>
            <label className="auth-label" htmlFor="signup-password">Password *</label>
            <div className="auth-input-wrap">
              <Lock size={17} className="auth-input-icon" />
              <input id="signup-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Password" className={`auth-input${fieldErrors.password ? ' auth-input-error' : ''}`} style={{ paddingRight: '42px' }} value={formData.password} onChange={(e) => setField('password', e.target.value)} />
              <button type="button" className="auth-input-toggle" onClick={() => setShowPassword((v) => !v)} tabIndex={-1} aria-label="Toggle password visibility">
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {formData.password && (
              <>
                <div className="auth-strength-bar"><div className="auth-strength-fill" style={{ width: `${strength.score * 25}%`, backgroundColor: strength.color }} /></div>
                <div style={{ fontSize: '0.74rem', color: strength.color, fontWeight: 700, marginTop: '4px' }}>{strength.label}</div>
              </>
            )}
            {fieldErrors.password && <div className="auth-error-text">{fieldErrors.password}</div>}
          </div>

          <div>
            <label className="auth-label" htmlFor="signup-confirm-password">Confirm Password *</label>
            <div className="auth-input-wrap">
              <Lock size={17} className="auth-input-icon" />
              <input id="signup-confirm-password" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Confirm Password" className={`auth-input${fieldErrors.confirmPassword ? ' auth-input-error' : ''}`} style={{ paddingRight: '42px' }} value={formData.confirmPassword} onChange={(e) => setField('confirmPassword', e.target.value)} />
              <button type="button" className="auth-input-toggle" onClick={() => setShowConfirmPassword((v) => !v)} tabIndex={-1} aria-label="Toggle confirm password visibility">
                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {fieldErrors.confirmPassword && <div className="auth-error-text">{fieldErrors.confirmPassword}</div>}
          </div>

          <button type="submit" className="auth-btn-primary" disabled={loading}>
            {loading ? (<><span className="auth-spinner" /><span>Creating account...</span></>) : (<><span>Create Account</span><ArrowRight size={17} /></>)}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.1rem', fontSize: '0.84rem', color: 'var(--auth-text-secondary)' }}>
          Already have an account?{' '}
          <button type="button" onClick={() => navigateTo('login')} style={{ background: 'none', border: 'none', color: 'var(--auth-orange)', fontWeight: 800, cursor: 'pointer' }}>
            Login Now
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignupView;
