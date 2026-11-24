import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import AuthLayout from '../components/AuthLayout';

export const ForgotPasswordView = () => {
  const { navigateTo, addToast } = useStore();
  const [identifier, setIdentifier] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!identifier) return;
    setIsOtpSent(true);
    addToast(`OTP sent to ${identifier}`, 'info');
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    addToast('Password successfully updated! Please sign in.', 'success');
    navigateTo('login');
  };

  return (
    <AuthLayout>
      <div className="auth-form-wrap">
        <button
          type="button"
          onClick={() => navigateTo('login')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--auth-navy)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', marginBottom: '1.1rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Login</span>
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--auth-navy)' }}>
            {isOtpSent ? 'Verify OTP & Reset Password' : 'Recover Your Account'}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--auth-text-secondary)', marginTop: '4px' }}>
            {isOtpSent ? `Enter the 4-digit code sent to ${identifier}` : 'Enter your registered mobile or email to receive a password reset OTP'}
          </p>
        </div>

        {!isOtpSent ? (
          <form onSubmit={handleSendOtp} noValidate>
            <label className="auth-label" htmlFor="forgot-identifier">Registered Mobile or Email</label>
            <div className="auth-input-wrap">
              <Mail size={17} className="auth-input-icon" />
              <input
                id="forgot-identifier"
                type="text"
                required
                placeholder="+91 98260 11223 or you@email.com"
                className="auth-input"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <button type="submit" className="auth-btn-primary" style={{ marginTop: '1.25rem' }}>
              Send Verification OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} noValidate>
            <div style={{ marginBottom: '1.1rem' }}>
              <label className="auth-label" htmlFor="forgot-otp">4-Digit Verification Code</label>
              <input
                id="forgot-otp"
                type="text"
                maxLength={4}
                required
                placeholder="4829"
                className="auth-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ textAlign: 'center', letterSpacing: '6px', fontSize: '1.15rem', fontWeight: 800, paddingLeft: '14px' }}
              />
            </div>

            <div>
              <label className="auth-label" htmlFor="forgot-new-password">New Password</label>
              <div className="auth-input-wrap">
                <Lock size={17} className="auth-input-icon" />
                <input
                  id="forgot-new-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter a new password"
                  className="auth-input"
                  style={{ paddingRight: '42px' }}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
                <button type="button" className="auth-input-toggle" onClick={() => setShowPassword((v) => !v)} tabIndex={-1} aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn-primary" style={{ marginTop: '1.25rem' }}>
              Update Password & Sign In
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordView;
