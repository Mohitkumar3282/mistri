import React, { useMemo } from 'react';
import Logo from './Logo';
import { useStore } from '../context/StoreContext';

const OrangeWave = ({ flip }) => (
  <svg
    viewBox="0 0 400 48"
    preserveAspectRatio="none"
    style={{ width: '100%', height: '42px', display: 'block', transform: flip ? 'scaleY(-1)' : 'none' }}
  >
    <path d="M0,16 C110,52 290,0 400,26 L400,48 L0,48 Z" fill="var(--auth-orange)" />
  </svg>
);

const ConstructionIcon = ({ className }) => (
  <svg viewBox="0 0 110 100" className={className} role="img" aria-hidden="true">
    {/* crane */}
    <rect x="30" y="68" width="10" height="7" rx="1" fill="#1F2937" />
    <line x1="35" y1="68" x2="35" y2="18" stroke="#F5A623" strokeWidth="3.2" />
    <line x1="10" y1="12" x2="98" y2="12" stroke="#F5A623" strokeWidth="3.2" />
    <line x1="35" y1="18" x2="16" y2="12" stroke="#F5A623" strokeWidth="2" />
    <line x1="35" y1="18" x2="60" y2="12" stroke="#F5A623" strokeWidth="2" />
    <rect x="8" y="8.5" width="11" height="7" rx="1" fill="#374151" />
    <rect x="31" y="13" width="9" height="7" rx="1" fill="#1F2937" />
    <line x1="92" y1="12" x2="92" y2="33" stroke="#9CA3AF" strokeWidth="1.5" />
    <rect x="88.5" y="33" width="7" height="5" rx="1" fill="#374151" />

    {/* building */}
    <polygon points="48,46 78,46 90,38 60,38" fill="#2F5496" />
    <polygon points="78,46 90,38 90,82 78,90" fill="#0B2D5B" />
    <rect x="48" y="46" width="30" height="44" fill="#15407D" />
    {[0, 1, 2].map((row) => (
      <React.Fragment key={row}>
        <rect x={53} y={52 + row * 12} width="6" height="7" rx="0.5" fill="#CFE0F5" opacity="0.85" />
        <rect x={63} y={52 + row * 12} width="6" height="7" rx="0.5" fill="#CFE0F5" opacity="0.85" />
        <rect x={73} y={52 + row * 12} width="6" height="7" rx="0.5" fill="#CFE0F5" opacity="0.6" />
      </React.Fragment>
    ))}

    {/* ground */}
    <polygon points="30,92 92,92 82,98 20,98" fill="#D5DFEB" />
  </svg>
);

const TrustedBrands = () => {
  const { products } = useStore();

  // Real brands actually stocked in our own catalog, ranked by how many
  // listings carry them - not a guessed/generic brand list.
  const topBrands = useMemo(() => {
    const counts = new Map();
    (products || []).forEach((p) => {
      const brand = typeof p.brand === 'string' ? p.brand.trim() : '';
      if (!brand) return;
      counts.set(brand, (counts.get(brand) || 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([brand]) => brand);
  }, [products]);

  if (topBrands.length === 0) return null;

  return (
    <div className="auth-trust-strip">
      <p className="auth-trust-headline">Trusted Brands, One Platform</p>
      <div className="auth-trust-chips">
        {topBrands.map((brand) => (
          <span key={brand} className="auth-trust-chip">{brand}</span>
        ))}
      </div>
    </div>
  );
};

/**
 * Shared shell for Login / Register, matching the MISTRI premium mockup: a
 * light header with the logo and a construction-site illustration, an orange
 * wave divider, and a matching wave at the very bottom of the page.
 */
export const AuthLayout = ({ children }) => {
  return (
    <div className="auth-page auth-page-light">
      <div className="auth-page-inner">
        <div className="auth-header-light">
          <Logo size="medium" />
          <ConstructionIcon className="auth-header-illustration" />
        </div>
        <TrustedBrands />
        <OrangeWave />

        <div className="auth-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
