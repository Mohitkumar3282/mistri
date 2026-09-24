import React from 'react';
import mistriLogoImg from '../assets/mistri-logo.png';

/**
 * MISTRI Brand Logo
 * Official Brand Logo Image:
 * - Direct asset: mistri-logo.png
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
  // Preset dimensions based on size
  const sizeMap = {
    xs: { w: 90, h: 26 },
    small: { w: 120, h: 34 },
    medium: { w: 155, h: 44 },
    large: { w: 210, h: 60 },
    xlarge: { w: 270, h: 76 },
  };

  const currentSize = sizeMap[size] || sizeMap.medium;
  const calculatedWidth = width || currentSize.w;
  const calculatedHeight = height || currentSize.h;

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
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: inverted ? '#FFFFFF' : 'transparent',
            padding: inverted ? '4px 8px' : '0',
            borderRadius: inverted ? '8px' : '0',
            boxShadow: inverted ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
          }}
        >
          <img
            src={mistriLogoImg}
            alt="MISTRI – From Foundation to Finish"
            style={{
              width: calculatedWidth,
              height: calculatedHeight,
              objectFit: 'contain',
              display: 'block',
            }}
            loading="eager"
          />
        </div>

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
