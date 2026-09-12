import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  MapPin,
  Heart,
  ShoppingCart,
  User,
  Phone,
  ShieldCheck,
  Truck,
  ChevronDown,
  Layers,
  Sparkles,
  ArrowRight,
  Clock,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES, PRODUCTS } from '../data/mockData';
import Logo from './Logo';

export const Header = () => {
  const {
    navigateTo,
    currentView,
    cartItemCount,
    cartSubtotal,
    wishlist,
    currentCity,
    currentPincode,
    setIsLocationModalOpen,
    user,
    setIsCartDrawerOpen,
  } = useStore();

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  // Live filtered suggestions
  const matchingProducts = searchTerm.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  const matchingCategories = searchTerm.trim()
    ? CATEGORIES.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 3)
    : [];

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchTerm.trim()) {
      navigateTo('search', { query: searchTerm });
      setSearchFocused(false);
    }
  };

  const handleSelectProduct = (product) => {
    navigateTo('product-details', { product });
    setSearchFocused(false);
    setSearchTerm('');
  };

  const handleSelectCategory = (catSlug) => {
    navigateTo('category-products', { slug: catSlug });
    setSearchFocused(false);
    setSearchTerm('');
  };

  return (
    <header className="hide-on-mobile" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0, zIndex: 1000, boxShadow: 'var(--shadow-xs)' }}>
      {/* 1. Top Construction Utility Bar */}
      <div style={{ backgroundColor: 'var(--dark-navy)', color: '#FFFFFF', fontSize: '0.78rem', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2" style={{ color: 'var(--light-orange)' }}>
              <Truck size={14} color="#F47721" />
              <span>Direct Site Delivery across MP, Maharashtra & NCR</span>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <ShieldCheck size={14} color="#10b981" />
              <span>100% Tested Certified Structural Materials (MTC Provided)</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigateTo('help')}
              style={{ background: 'none', color: '#CBD5E1', cursor: 'pointer', fontSize: '0.78rem' }}
            >
              Contractor Support & FAQ
            </button>
            <div className="flex items-center gap-2">
              <Phone size={13} color="#F47721" />
              <span style={{ fontWeight: '700' }}>Bulk Hotline: +91 1800 200 8899</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Header Bar */}
      <div style={{ padding: '12px 0' }}>
        <div className="container flex items-center justify-between gap-6">
          {/* MISTRI Brand Logo */}
          <div style={{ flexShrink: 0 }}>
            <Logo onClick={() => navigateTo('home')} size="medium" />
          </div>

          {/* Location Delivery Selector */}
          <div
            onClick={() => setIsLocationModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-subtle)',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'var(--transition)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--brand-orange)';
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--light-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-orange)',
              }}
            >
              <Truck size={18} strokeWidth={2.2} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--primary-navy)' }}>
                  Deliver to:
                </span>
                <ChevronDown size={14} color="var(--primary-navy)" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                {currentCity} ({currentPincode || '452005'})
              </span>
            </div>
          </div>

          {/* Large Search Bar with Live Autocomplete */}
          <div ref={searchRef} style={{ flex: 1, maxWidth: '580px', position: 'relative' }}>
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search for cement, steel, tiles, pipes, paint, tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '0 48px 0 16px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1.5px solid',
                  borderColor: searchFocused ? 'var(--primary-orange)' : 'var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.925rem',
                  color: 'var(--text-primary)',
                  boxShadow: searchFocused ? '0 0 0 3px var(--orange-subtle)' : 'none',
                  transition: 'var(--transition)',
                }}
              />
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '4px',
                  top: '4px',
                  width: '38px',
                  height: '38px',
                  backgroundColor: 'var(--primary-orange)',
                  borderRadius: 'var(--radius-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                <Search size={18} />
              </button>
            </form>

            {/* Live Autocomplete Dropdown */}
            {searchFocused && (
              <div
                style={{
                  position: 'absolute',
                  top: '52px',
                  left: 0,
                  right: 0,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-subtle)',
                  padding: '1rem',
                  zIndex: 2000,
                  maxHeight: '420px',
                  overflowY: 'auto',
                }}
              >
                {searchTerm.trim() ? (
                  <div>
                    {/* Matching Categories */}
                    {matchingCategories.length > 0 && (
                      <div style={{ marginBottom: '0.85rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                          Matching Categories
                        </div>
                        {matchingCategories.map((cat) => (
                          <div
                            key={cat.id}
                            onClick={() => handleSelectCategory(cat.slug)}
                            style={{
                              padding: '6px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '0.875rem',
                              color: 'var(--primary-navy)',
                              fontWeight: '600',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--navy-subtle)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <span>{cat.name}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.itemCount}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Matching Products */}
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                        Products
                      </div>
                      {matchingProducts.length > 0 ? (
                        matchingProducts.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => handleSelectProduct(p)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '8px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              borderBottom: '1px solid var(--border-subtle)',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>{p.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p.brand} • {p.unit}</div>
                            </div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary-orange)' }}>
                              ₹{p.price}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '8px 0' }}>
                          No exact products found for "{searchTerm}". Press Enter to view all results.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Popular Construction Searches
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                      {['UltraTech OPC 53', 'Tata Tiscon 550D', 'AAC Blocks', 'Kajaria 600x1200', 'Asian Paints Apex', 'Havells FR Wire', 'Supreme SWR Pipe', 'M-Sand'].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setSearchTerm(item);
                            navigateTo('search', { query: item });
                            setSearchFocused(false);
                          }}
                          style={{
                            padding: '4px 10px',
                            background: 'var(--bg-surface)',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8rem',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Action Icons: Wishlist, My Orders, Cart, Account */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            <button
              onClick={() => navigateTo('wishlist')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                background: 'none',
                cursor: 'pointer',
                color: currentView === 'wishlist' ? 'var(--primary-orange)' : 'var(--text-primary)',
                position: 'relative',
                padding: '4px 8px',
              }}
            >
              <div style={{ position: 'relative' }}>
                <Heart size={22} fill={wishlist.length > 0 ? '#F47721' : 'none'} color={wishlist.length > 0 ? '#F47721' : 'currentColor'} />
                {wishlist.length > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-8px',
                      backgroundColor: 'var(--primary-orange)',
                      color: '#FFFFFF',
                      fontSize: '0.65rem',
                      fontWeight: '800',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {wishlist.length}
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: '600' }}>Wishlist</span>
            </button>

            {/* My Orders */}
            <button
              onClick={() => navigateTo('orders')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                background: 'none',
                cursor: 'pointer',
                color: currentView === 'orders' ? 'var(--primary-orange)' : 'var(--text-primary)',
                padding: '4px 8px',
              }}
            >
              <Truck size={22} />
              <span style={{ fontSize: '0.72rem', fontWeight: '600' }}>Orders</span>
            </button>

            {/* Shopping Cart Button with Live Counter & Total */}
            <button
              onClick={() => navigateTo('cart')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: 'var(--primary-navy)',
                color: '#FFFFFF',
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-xs)',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--dark-navy)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-navy)')}
            >
              <div style={{ position: 'relative' }}>
                <ShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-10px',
                      backgroundColor: 'var(--primary-orange)',
                      color: '#FFFFFF',
                      fontSize: '0.68rem',
                      fontWeight: '800',
                      padding: '2px 5px',
                      borderRadius: '9999px',
                      lineHeight: 1,
                    }}
                  >
                    {cartItemCount}
                  </span>
                )}
              </div>
              <div style={{ textAlign: 'left', lineHeight: '1.1' }}>
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--light-orange)' }}>Site Cart</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>₹{cartSubtotal.toLocaleString()}</div>
              </div>
            </button>

            {/* Account / User Profile */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => (user ? navigateTo('profile') : navigateTo('login'))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--primary-navy)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.75rem' }}>
                  {user ? user.name.charAt(0) : <User size={14} />}
                </div>
                <div style={{ textAlign: 'left', lineHeight: '1.1' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                    {user ? 'Contractor' : 'Sign In'}
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user ? user.name.split(' ')[0] : 'Account'}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mega Category Bar */}
      <nav style={{ backgroundColor: 'var(--primary-navy)', color: '#FFFFFF' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {/* All Categories Button */}
          <button
            onClick={() => navigateTo('categories')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--primary-orange)',
              color: '#FFFFFF',
              padding: '10px 16px',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              border: 'none',
              flexShrink: 0,
            }}
          >
            <Layers size={16} />
            <span>ALL CATEGORIES</span>
          </button>

          {/* Category Links */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: '2px', paddingLeft: '8px' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.slug)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#E8EFF6',
                  padding: '10px 12px',
                  fontSize: '0.835rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#F47721';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#E8EFF6';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
