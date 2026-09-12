import React from 'react';

/**
 * MISTRI Brand Logo
 * Official Brand Identity:
 * - Spelling: M I S T R I (with classic geometric 'S' and orange square 'i' dots)
 * - Color: Brand Midnight Navy (#08274C) + Brand Construction Orange (#F15A24)
 * - Tagline: "FROM FOUNDATION TO FINISH"
 */
export const Logo = ({
  size = 'medium',
  showTagline = true,
  onClick,
  inverted = false,
  badgeText = null,
  className = '',
  width,
  height,
}) => {
  // Preset dimensions (width x height) based on size
  const sizeMap = {
    xs: { w: 86, hNoTag: 18, hTag: 24 },
    small: { w: 102, hNoTag: 21, hTag: 28.5 },
    medium: { w: 140, hNoTag: 29, hTag: 39 },
    large: { w: 190, hNoTag: 39, hTag: 53 },
    xlarge: { w: 240, hNoTag: 49, hTag: 67 },
  };

  const currentSize = sizeMap[size] || sizeMap.medium;
  const calculatedWidth = width || currentSize.w;
  const calculatedHeight = height || (showTagline ? currentSize.hTag : currentSize.hNoTag);

  const navyColor = inverted ? '#FFFFFF' : '#08274C';
  const orangeColor = '#F15A24';
  const taglineColor = inverted ? '#FFFFFF' : '#08274C';

  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        lineHeight: 1,
        transition: 'opacity 0.15s ease, transform 0.15s ease',
      }}
      title="MISTRI - From Foundation to Finish"
    >
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <svg
          width={calculatedWidth}
          height={calculatedHeight}
          viewBox={showTagline ? "2 14 316 88" : "2 14 316 65"}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', overflow: 'hidden' }}
        >
          {/* LETTER 1: M */}
          <path
            d="M 2 18 L 20 18 L 40 54 L 60 18 L 78 18 L 78 78 L 61 78 L 61 41 L 46 68 L 34 68 L 19 41 L 19 78 L 2 78 Z"
            fill={navyColor}
          />

          {/* LETTER 2: i (First) */}
          <rect x="88" y="18" width="17" height="15" rx="1.5" fill={orangeColor} />
          <rect x="88" y="38" width="17" height="40" rx="1.5" fill={navyColor} />

          {/* LETTER 3: S */}
          <path
            d="M 166 33 H 151 C 151 28.5 147 26 141 26 C 134.5 26 130.5 28.5 130.5 32.5 C 130.5 36.5 133.5 38.5 142 41 L 149.5 43 C 160.5 46.5 166 51.5 166 61.5 C 166 72 157 78 141.5 78 C 125 78 116 71 115 59 H 130 C 131 65 135 68 141.5 68 C 148 68 151 65 151 61.5 C 151 57.5 148 55.5 139.5 53 L 132 51 C 121 47.5 115.5 42.5 115.5 32.5 C 115.5 22 125 16 141 16 C 157 16 165 22 166 33 Z"
            fill={navyColor}
          />

          {/* LETTER 4: T */}
          <path
            d="M 176 18 H 226 V 32 H 210 V 78 H 192 V 32 H 176 V 18 Z"
            fill={navyColor}
          />

          {/* LETTER 5: R */}
          <path
            d="M 236 18 H 272 C 282.5 18 289 25 289 36 C 289 45 283.5 51 275 53 L 291 78 H 272 L 258 56 H 252 V 78 H 236 V 18 Z M 252 31 V 43 H 269 C 272.5 43 274.5 40.5 274.5 37 C 274.5 33.5 272.5 31 269 31 H 252 Z"
            fill={navyColor}
          />

          {/* LETTER 6: i (Second) */}
          <rect x="300" y="18" width="17" height="15" rx="1.5" fill={orangeColor} />
          <rect x="300" y="38" width="17" height="40" rx="1.5" fill={navyColor} />

          {/* SUBTITLE: FROM FOUNDATION TO FINISH */}
          {showTagline && (
            <text
              x="160"
              y="97"
              textAnchor="middle"
              fill={taglineColor}
              style={{
                fontFamily: "'Outfit', 'Plus Jakarta Sans', -apple-system, sans-serif",
                fontSize: '13.5px',
                fontWeight: '900',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              FROM FOUNDATION TO FINISH
            </text>
          )}
        </svg>

        {/* Optional quick commerce badge */}
        {badgeText && (
          <span
            style={{
              fontSize: size === 'xs' || size === 'small' ? '0.58rem' : '0.68rem',
              fontWeight: '800',
              backgroundColor: '#FFF1EB',
              color: '#F15A24',
              border: '1px solid #FDC3A9',
              padding: '1.5px 5px',
              borderRadius: '5px',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
            }}
          >
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;

