import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ShoppingCart, Wallet, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Logo from './Logo';

export const MobileHeader = () => {
  const {
    navigateTo,
    cartItemCount,
    currentCity,
    currentPincode,
    setIsLocationModalOpen,
    walletBalance,
    isWalletVisible,
    toggleWalletVisibility,
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll listener to hide logo and move search bar to top
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollY > 25);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const searchPlaceholders = [
    'Search for Fevicol',
    'Search for Cement',
    'Search for Havells Wires',
    'Search for Action Tesa HDHMR',
    'Search for CenturyPly',
    'Search for Asian Paints',
    'Search for Godrej Locks',
  ];

  // Rotate search placeholder every 2.8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigateTo('search', { query: searchTerm });
    } else {
      navigateTo('search', { query: searchPlaceholders[placeholderIndex].replace('Search for ', '') });
    }
  };

  return (
    <header
      className="hide-on-desktop"
      style={{
        backgroundColor: '#FFFFFF',
        position: 'sticky',
        top: 0,
        zIndex: 900,
        boxShadow: isScrolled ? '0 3px 12px rgba(8,39,76,0.08)' : '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.25s ease',
      }}
    >
      {/* Row 1: Left (Logo + Location Pill), Right (Wallet Pill + Cart Icon) */}
      <div
        style={{
          padding: '8px 12px 6px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        {/* Left: Brand Logo + Location Pincode Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <Logo onClick={() => navigateTo('home')} size="small" showTagline={false} />

          {/* Location Pincode Pill (Shifted Left next to Logo) */}
          <div
            onClick={() => setIsLocationModalOpen(true)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              padding: '3px 8px',
              backgroundColor: '#F1F5F9',
              borderRadius: '9999px',
              border: '1px solid #E2E8F0',
              height: '26px',
              transition: 'var(--transition)',
            }}
            title="Change Delivery Location"
          >
            <span style={{ fontSize: '0.72rem', color: 'var(--primary-navy)', fontWeight: '700', letterSpacing: '-0.01em' }}>
              {currentPincode || '452005'}
            </span>
            <ChevronDown size={11} color="var(--primary-navy)" strokeWidth={2.5} />
          </div>
        </div>

        {/* Right: Wallet Balance Pill & Dark Cart Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {/* Wallet Balance Pill (Exact Screenshot 1) */}
          <div
            onClick={toggleWalletVisibility}
            style={{
              backgroundColor: '#1E293B',
              borderRadius: '9999px',
              padding: '3px 9px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
              border: '1px solid #334155',
              height: '28px',
            }}
            title="Cashback & Wallet Balance"
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: '#F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem',
                color: '#000',
                fontWeight: '800',
              }}
            >
              ₹
            </div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: '800',
                color: '#FFFFFF',
                letterSpacing: '0.03em',
                fontFamily: 'monospace',
              }}
            >
              {isWalletVisible ? `₹${walletBalance.toLocaleString()}` : '₹XXXX'}
            </span>
          </div>


          {/* Dark Cart Circle Button with Bright Green Notification Badge (Exact Screenshot 1) */}
          <button
            onClick={() => navigateTo('cart')}
            style={{
              position: 'relative',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#1E293B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.12)',
              flexShrink: 0,
            }}
          >
            <ShoppingCart size={15} />
            {cartItemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--qc-green)',
                  color: '#FFFFFF',
                  fontSize: '0.58rem',
                  fontWeight: '900',
                  minWidth: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #FFFFFF',
                  lineHeight: 1,
                  padding: '1px',
                }}
              >
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Row 2: Search Bar — Sticks at Top when Scrolled */}
      <div
        style={{
          padding: isScrolled ? '8px 12px 8px 12px' : '0 12px 8px 12px',
          transition: 'padding 0.2s ease',
          backgroundColor: '#FFFFFF',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'absolute', left: '12px', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
            <Search size={18} color="var(--text-primary)" strokeWidth={2.2} />
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholders[placeholderIndex]}
            style={{
              width: '100%',
              height: '42px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--border-medium)',
              borderRadius: '10px',
              padding: '0 36px 0 40px',
              fontSize: '0.92rem',
              color: 'var(--text-primary)',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)',
            }}
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '10px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={16} />
            </button>
          )}
        </form>
      </div>
    </header>
  );
};

export default MobileHeader;
