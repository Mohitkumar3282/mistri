import React, { useState } from 'react';
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

export const ProductGallery = ({ images = [], alt = '' }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const displayImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=800'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Main Image Frame */}
      <div
        style={{
          position: 'relative',
          height: '380px',
          width: '100%',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={displayImages[activeIdx]}
          alt={alt}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            transition: 'transform 0.3s ease',
            transform: isZoomed ? 'scale(1.4)' : 'scale(1)',
            cursor: 'zoom-in',
          }}
          onClick={() => setIsZoomed(!isZoomed)}
        />

        {/* Zoom Hint */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            backgroundColor: 'rgba(11, 41, 71, 0.75)',
            color: '#FFFFFF',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.72rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <ZoomIn size={13} />
          <span>Click to Zoom</span>
        </div>
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setActiveIdx(idx);
                setIsZoomed(false);
              }}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-xs)',
                border: `2px solid ${activeIdx === idx ? 'var(--primary-orange)' : 'var(--border-subtle)'}`,
                padding: '2px',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <img src={img} alt={`${alt} thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
