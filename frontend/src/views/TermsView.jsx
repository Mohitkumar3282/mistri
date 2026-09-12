import React from 'react';
import { FileText, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const TermsView = () => {
  const { navigateTo } = useStore();

  return (
    <div className="page-container" style={{ maxWidth: '820px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-navy)', fontWeight: '800', marginBottom: '0.5rem' }}>
          Terms & Conditions of Supply
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Last Updated: September 2026 • MISTRI Technologies Pvt. Ltd.
        </p>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '2.5rem', boxShadow: 'var(--shadow-xs)', display: 'flex', flexDirection: 'column', gap: '1.75rem', fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
        <section>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)', fontWeight: '800', marginBottom: '0.5rem' }}>
            1. Scope of Material Supply & Direct Site Delivery
          </h2>
          <p>
            MISTRI acts as an authorized direct-procurement platform facilitating the supply of primary structural construction materials (including Cement, TMT Rebars, AAC Blocks, Sand, Plumbing, Electrical, Tiles, and Tools) directly from certified manufacturer mother plants and logistics hubs to the buyer's specified site.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)', fontWeight: '800', marginBottom: '0.5rem' }}>
            2. Site Access, Vehicle Entry & Unloading Protocols
          </h2>
          <p>
            It is the responsibility of the purchaser / site contractor to ensure adequate road approach width for heavy commercial carriers (e.g. 10-wheeler dumpers, 12T Eicher carriers, or crane trucks). In cases where heavy entry is restricted by municipal authorities or narrow streets, transshipment onto smaller mini-carriers will be coordinated.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)', fontWeight: '800', marginBottom: '0.5rem' }}>
            3. Quality Standards & Manufacturer Test Certificates (MTC)
          </h2>
          <p>
            All cement and TMT steel consignments comply strictly with the relevant Bureau of Indian Standards (IS 12269 for OPC 53 Grade Cement, IS 1786:2008 for Fe 550D/500D TMT Rebars). The official batch Manufacturer Test Certificate (MTC) is attached digitally to every dispatched order.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)', fontWeight: '800', marginBottom: '0.5rem' }}>
            4. GST Compliance & Input Tax Credit (ITC)
          </h2>
          <p>
            All commercial builder purchases are accompanied by 100% compliant B2B tax invoices reflecting the buyer's GSTIN and e-Way bill generated on the national GST portal.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsView;
