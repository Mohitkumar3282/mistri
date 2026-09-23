import React, { useState } from 'react';
import { ChevronUp, ChevronDown, FileText } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const DEFAULT_POLICIES = [
  'Orders cannot be modified once packed.',
  'Delivery location of an Order cannot be changed. INR 249 additional charges in unavoidable cases.',
  'Orders cannot be cancelled once packed. Cancellation charges of INR 199 would apply.',
];

/**
 * CancellationPolicyCard
 * Matches exact reference screenshot:
 * - Collapsible card with FileText icon
 * - Dynamic bullet points synchronized with Admin siteSettings.cancellationPolicy
 */
export const CancellationPolicyCard = ({ customPolicies = null }) => {
  const { siteSettings } = useStore();
  const [isOpen, setIsOpen] = useState(true);

  const rawPolicy = customPolicies || siteSettings?.cancellationPolicy;
  let policies = DEFAULT_POLICIES;

  if (Array.isArray(rawPolicy) && rawPolicy.length > 0) {
    policies = rawPolicy;
  } else if (typeof rawPolicy === 'string' && rawPolicy.trim()) {
    policies = rawPolicy
      .split('\n')
      .map((p) => p.replace(/^[•\-\*\d\.]+\s*/, '').trim())
      .filter(Boolean);
  }

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        padding: '16px 18px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
      }}
    >
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
            }}
          >
            <FileText size={20} />
          </div>
          <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A' }}>
            Cancellation Policy
          </span>
        </div>

        <div style={{ color: '#0F172A' }}>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {isOpen && (
        <div style={{ marginTop: '14px' }}>
          <div style={{ borderTop: '1px solid #F1F5F9', marginBottom: '14px' }} />

          <ul
            style={{
              listStyleType: 'disc',
              paddingLeft: '20px',
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {policies.map((point, idx) => (
              <li
                key={idx}
                style={{
                  fontSize: '0.88rem',
                  color: '#334155',
                  lineHeight: '1.5',
                  fontWeight: '500',
                }}
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CancellationPolicyCard;
