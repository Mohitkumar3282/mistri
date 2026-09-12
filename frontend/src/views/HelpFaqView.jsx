import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, Phone, FileText, Truck, ShieldCheck } from 'lucide-react';
import { MOCK_FAQS } from '../data/mockData';
import { useStore } from '../context/StoreContext';

export const HelpFaqView = () => {
  const { navigateTo } = useStore();
  const [openIndex, setOpenIndex] = useState('0-0');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleAccordion = (idxStr) => {
    setOpenIndex(openIndex === idxStr ? null : idxStr);
  };

  return (
    <div className="page-container" style={{ maxWidth: '880px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--light-orange)', color: 'var(--primary-orange)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: '800', marginBottom: '1rem', textTransform: 'uppercase' }}>
          <HelpCircle size={15} />
          <span>Support & Knowledge Base</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--primary-navy)', fontWeight: '800', marginBottom: '0.5rem' }}>
          How Can We Assist Your Project?
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
          Find answers regarding bulk orders, crane unloading, test certificates, GST tax invoices & payment terms.
        </p>
      </div>

      {/* FAQ Categories & Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {MOCK_FAQS.map((category, catIdx) => (
          <div key={catIdx} style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.75rem', boxShadow: 'var(--shadow-xs)' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)', fontWeight: '800', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              {category.category}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {category.questions.map((faq, qIdx) => {
                const uniqueKey = `${catIdx}-${qIdx}`;
                const isOpen = openIndex === uniqueKey;

                return (
                  <div
                    key={qIdx}
                    style={{
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      backgroundColor: isOpen ? 'var(--bg-surface)' : '#FFFFFF',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(uniqueKey)}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '700',
                        fontSize: '0.95rem',
                        color: isOpen ? 'var(--primary-orange)' : 'var(--primary-navy)',
                      }}
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>

                    {isOpen && (
                      <div style={{ padding: '0 16px 14px 16px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Still need help? Box */}
      <div style={{ marginTop: '3rem', textAlign: 'center', backgroundColor: 'var(--navy-subtle)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)', fontWeight: '800', marginBottom: '0.4rem' }}>
          Have a custom material inquiry or site emergency?
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Our structural materials team is available Mon-Sat (7:00 AM - 9:00 PM).
        </p>
        <button
          onClick={() => navigateTo('contact')}
          className="btn btn-primary"
          style={{ fontWeight: '700' }}
        >
          Contact Contractor Support
        </button>
      </div>
    </div>
  );
};

export default HelpFaqView;
