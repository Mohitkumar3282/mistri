import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const PrivacyPolicyView = () => {
  const { navigateTo } = useStore();

  return (
    <div className="page-container" style={{ maxWidth: '820px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-navy)', fontWeight: '800', marginBottom: '0.5rem' }}>
          Privacy Policy
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Last Updated: September 2026 • MISTRI Technologies Pvt. Ltd.
        </p>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '2.5rem', boxShadow: 'var(--shadow-xs)', display: 'flex', flexDirection: 'column', gap: '1.75rem', fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
        <section>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)', fontWeight: '800', marginBottom: '0.5rem' }}>
            1. Information Collection
          </h2>
          <p>
            MISTRI collects contractor business details, company name, GSTIN, site delivery locations, contact mobile numbers, and order histories exclusively for fulfilling structural material logistics, generating e-Way bills, and offering volume trade discounts.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)', fontWeight: '800', marginBottom: '0.5rem' }}>
            2. Site Coordinates & GPS Routing
          </h2>
          <p>
            Delivery site addresses and supervisor contact numbers are shared only with the assigned heavy transport driver and logistics hub manager to ensure safe, timely delivery and crane unloading.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)', fontWeight: '800', marginBottom: '0.5rem' }}>
            3. Payment Security
          </h2>
          <p>
            All electronic transactions (UPI, Credit Cards, Net Banking, RTGS) are processed through 256-bit encrypted banking gateways compliant with Reserve Bank of India (RBI) standards. MISTRI does not store confidential card CVV or banking credentials.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyView;
