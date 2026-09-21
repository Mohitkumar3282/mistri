import React, { useState, useEffect, useRef } from 'react';
import {
  Truck,
  ShieldCheck,
  Award,
  ArrowRight,
  Sparkles,
  Layers,
  Phone,
  FileCheck,
  CheckCircle2,
  HardHat,
  Clock,
  TrendingDown,
  Building,
  RotateCcw,
  QrCode,
  Check,
  Zap,
  Flame,
  ChevronRight,
  ChevronLeft,
  ShoppingCart,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES, PRODUCTS, TOP_BRANDS } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';

const MISTRI_PROMO_SLIDES = [
  {
    icon: Truck,
    badge: '60-MIN EXPRESS',
    title: 'Site Delivery in 60 Mins',
    desc: 'Cement, TMT steel, sand & bricks direct to your plot',
    cta: 'Order Now',
    target: 'products',
    gradient: 'linear-gradient(135deg, #0B2947 0%, #163E68 60%, #0F172A 100%)',
    accent: '#F59E0B',
  },
  {
    icon: HardHat,
    badge: 'VERIFIED EXPERTS',
    title: 'Book Verified Mistri & Masons',
    desc: 'Expert masons, plumbers, electricians & carpenters near you',
    cta: 'Book Mistri',
    target: 'mistris',
    gradient: 'linear-gradient(135deg, #064E3B 0%, #065F46 60%, #022C22 100%)',
    accent: '#34D399',
  },
  {
    icon: ShieldCheck,
    badge: 'DEPOT DIRECT',
    title: '100% Genuine Materials',
    desc: 'Factory certified (MTC) with automated GST input tax credit',
    cta: 'View Brands',
    target: 'products',
    gradient: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 60%, #0F172A 100%)',
    accent: '#FACC15',
  },
  {
    icon: Zap,
    badge: 'BULK WHOLESALE',
    title: 'Contractor Bulk Discounts',
    desc: 'Special depot rates for 500+ cement bags & bulk steel orders',
    cta: 'Get Quote',
    target: 'contact',
    gradient: 'linear-gradient(135deg, #78350F 0%, #92400E 60%, #451A03 100%)',
    accent: '#FBBF24',
  },
];

export const HomeView = () => {
  const { navigateTo, setIsQuotationOpen, products, categories, siteSettings, banners } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compact Mistri Promo Banner Slider State
  const [promoIndex, setPromoIndex] = useState(0);
  const [isPromoPaused, setIsPromoPaused] = useState(false);
  const [promoTouchStart, setPromoTouchStart] = useState(null);
  const [promoTouchEnd, setPromoTouchEnd] = useState(null);

  const totalPromoSlides = MISTRI_PROMO_SLIDES.length;

  const nextPromo = () => {
    setPromoIndex((prev) => (prev + 1) % totalPromoSlides);
  };

  const prevPromo = () => {
    setPromoIndex((prev) => (prev - 1 + totalPromoSlides) % totalPromoSlides);
  };

  // Auto slide promo banner every 4 seconds
  useEffect(() => {
    if (isPromoPaused) return;
    const timer = setInterval(() => {
      nextPromo();
    }, 4000);
    return () => clearInterval(timer);
  }, [isPromoPaused, totalPromoSlides]);

  // Touch Swipe handlers
  const onPromoTouchStart = (e) => {
    setIsPromoPaused(true);
    setPromoTouchEnd(null);
    setPromoTouchStart(e.targetTouches[0].clientX);
  };

  const onPromoTouchMove = (e) => {
    setPromoTouchEnd(e.targetTouches[0].clientX);
  };

  const onPromoTouchEnd = () => {
    if (!promoTouchStart || !promoTouchEnd) return;
    const distance = promoTouchStart - promoTouchEnd;
    if (distance > 50) nextPromo();
    if (distance < -50) prevPromo();
    setIsPromoPaused(false);
  };

  // 3-Second Auto Hero Carousel Slider
  const totalHeroSlides = 2;
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalHeroSlides);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const bestsellerScrollRef = useRef(null);

  const scrollBestsellers = (direction) => {
    if (bestsellerScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      bestsellerScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const categoriesList = categories && categories.length > 0 ? categories : CATEGORIES;
  const currentProducts = products && products.length > 0 ? products : PRODUCTS;
  const featuredMaterials = currentProducts.filter((p) => p.isFeatured !== false);
  const shelfProducts = featuredMaterials.length > 0 ? featuredMaterials : currentProducts;
  const popularMaterials = currentProducts.filter((p) => p.isPopular).length > 0 ? currentProducts.filter((p) => p.isPopular) : currentProducts.slice(0, 10);

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '2rem' }}>
      {/* 1. HERO PROMO BANNER CAROUSEL (Exact Screenshot 1) */}
      <section style={{ padding: '0.85rem 0 0.5rem 0' }}>
        <div className="container">
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              boxShadow: 'var(--shadow-card)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {/* Slide 1: Plywood & MDF (Exact Match to Screenshot 1) */}
            {activeSlide === 0 && (
              <div
                style={{
                  background: 'linear-gradient(105deg, #FFFFFF 0%, #F8FAFC 55%, #E2F2E9 100%)',
                  padding: '1.5rem 1.25rem',
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr',
                  gap: '1rem',
                  alignItems: 'center',
                  minHeight: '210px',
                  position: 'relative',
                }}
              >
                {/* Left Content */}
                <div style={{ zIndex: 2 }}>
                  {/* Decorative Dots */}
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '8px', opacity: 0.35 }}>
                    {[...Array(12)].map((_, i) => (
                      <span key={i} style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#0B2947' }} />
                    ))}
                  </div>

                  {/* Headline */}
                  <h1
                    style={{
                      fontSize: 'clamp(1.4rem, 4vw, 2.25rem)',
                      fontWeight: '900',
                      lineHeight: '1.15',
                      color: 'var(--primary-navy)',
                      letterSpacing: '-0.03em',
                      marginBottom: '8px',
                    }}
                  >
                    Original <br />
                    <span>Plywood</span> <span style={{ color: 'var(--qc-green)' }}>& MDF.</span>
                  </h1>

                  {/* Wholesale Prices Pill Tag (Exact Screenshot 1) */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#EAB308',
                      color: '#0B2947',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontWeight: '800',
                      fontSize: '0.8rem',
                      marginBottom: '12px',
                    }}
                  >
                    <span>📦</span>
                    <span>Wholesale Prices.</span>
                  </div>

                  {/* Action Buttons Row */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => navigateTo('category-products', { slug: 'plywood-mdf-hdhmr', categoryName: 'Plywood, MDF & HDHMR' })}
                      style={{
                        backgroundColor: '#064E3B',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '9999px',
                        padding: '6px 14px',
                        fontSize: '0.78rem',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(6, 78, 59, 0.3)',
                      }}
                    >
                      <ShoppingCart size={13} />
                      <span>ORDER NOW</span>
                      <ChevronRight size={13} />
                    </button>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        color: '#064E3B',
                      }}
                    >
                      <Truck size={13} color="#064E3B" strokeWidth={2.5} />
                      <span>EXPRESS SITE DELIVERY</span>
                    </div>
                  </div>
                </div>

                {/* Right Visual Graphic with Product Stack & Warranty Badges (Exact Screenshot 1) */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* 30 Year Warranty Seal Badge (Top) */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '0px',
                      left: '10px',
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      backgroundColor: '#991B1B',
                      color: '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.52rem',
                      fontWeight: '900',
                      lineHeight: '1',
                      border: '2px dashed #FEF08A',
                      boxShadow: '0 2px 8px rgba(153, 27, 27, 0.4)',
                      zIndex: 3,
                      textAlign: 'center',
                    }}
                  >
                    <span>30 YEAR</span>
                    <span style={{ fontSize: '0.42rem' }}>WARRANTY</span>
                  </div>

                  {/* 15 Year Warranty Seal Badge (Bottom) */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '5px',
                      left: '0px',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: '#991B1B',
                      color: '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.52rem',
                      fontWeight: '900',
                      lineHeight: '1',
                      border: '2px dashed #FEF08A',
                      boxShadow: '0 2px 8px rgba(153, 27, 27, 0.4)',
                      zIndex: 3,
                      textAlign: 'center',
                    }}
                  >
                    <span>15 YEAR</span>
                    <span style={{ fontSize: '0.42rem' }}>WARRANTY</span>
                  </div>

                  {/* Layered Wood Sheets Visual Mockup */}
                  <div style={{ position: 'relative', width: '100%', maxWidth: '200px' }}>
                    {/* CenturyPly Wood Sheet (Background) */}
                    <div
                      style={{
                        width: '130px',
                        height: '140px',
                        backgroundColor: '#E0B589',
                        borderRadius: '6px',
                        border: '2px solid #8D5B2F',
                        marginLeft: 'auto',
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '6px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }}
                    >
                      <div style={{ fontSize: '0.5rem', fontWeight: '900', color: '#5A3515' }}>IS:710 MARINE BWP</div>
                      <div style={{ textAlign: 'center', fontWeight: '900', fontSize: '0.62rem', color: '#5A3515' }}>
                        CENTURYPLY
                      </div>
                      <div style={{ fontSize: '0.48rem', color: '#5A3515' }}>CALIBRATED • 19MM</div>
                    </div>

                    {/* Action TESA HDHMR Block (Foreground) */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-8px',
                        left: '20px',
                        width: '140px',
                        height: '75px',
                        backgroundColor: '#64748B',
                        borderRadius: '6px',
                        border: '2px solid #334155',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '6px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.25)',
                        color: '#FFFFFF',
                      }}
                    >
                      <div style={{ fontSize: '0.5rem', fontWeight: '800', letterSpacing: '0.08em', color: '#94A3B8' }}>TESA</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: '900', color: '#FFFFFF', letterSpacing: '0.02em' }}>HDHMR</div>
                      <div style={{ fontSize: '0.5rem', color: '#CBD5E1' }}>18MM • HIGH MOISTURE RESISTANT</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 2: UltraTech Cement & Tata Tiscon Steel */}
            {activeSlide === 1 && (
              <div
                style={{
                  background: 'linear-gradient(105deg, #FFFFFF 0%, #FFFBEB 55%, #FEF08A 100%)',
                  padding: '1.5rem 1.25rem',
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr',
                  gap: '1rem',
                  alignItems: 'center',
                  minHeight: '210px',
                  position: 'relative',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#B45309', textTransform: 'uppercase', marginBottom: '4px' }}>
                    ⚡ 60 MINUTE EXPRESS SITE DELIVERY
                  </div>
                  <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', fontWeight: '900', color: '#0B2947', lineHeight: '1.15', marginBottom: '8px' }}>
                    UltraTech Cement & <span style={{ color: '#D97706' }}>TMT Steel</span>
                  </h2>
                  <div style={{ display: 'inline-flex', backgroundColor: '#0B2947', color: '#FEF08A', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '800', marginBottom: '12px' }}>
                    Direct Depot Rates • ₹410/Bag
                  </div>
                  <div>
                    <button
                      onClick={() => navigateTo('category-products', { slug: 'cement', categoryName: 'Cement' })}
                      className="btn btn-navy btn-sm"
                      style={{ borderRadius: '9999px', padding: '6px 16px' }}
                    >
                      <span>ORDER CEMENT</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img
                    src="https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400"
                    alt="Cement"
                    style={{ maxHeight: '130px', objectFit: 'contain', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))' }}
                  />
                </div>
              </div>
            )}

            {/* Slide 3: Havells & Finolex Wires Flash Deal */}
            {activeSlide === 2 && (
              <div
                style={{
                  background: 'linear-gradient(105deg, #1E40AF 0%, #1D4ED8 60%, #3B82F6 100%)',
                  padding: '1.5rem 1.25rem',
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr',
                  gap: '1rem',
                  alignItems: 'center',
                  minHeight: '210px',
                  color: '#FFFFFF',
                }}
              >
                <div>
                  <div style={{ display: 'inline-flex', backgroundColor: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '800', color: '#FEF08A', marginBottom: '6px' }}>
                    🔥 UP TO 43% OFF WIRES
                  </div>
                  <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', fontWeight: '900', color: '#FFFFFF', lineHeight: '1.15', marginBottom: '8px' }}>
                    Havells & Finolex FR Wires
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: '#DBEAFE', marginBottom: '12px' }}>
                    100% Pure Bare Copper • 25+ Gauge & Color Options
                  </p>
                  <div>
                    <button
                      onClick={() => setIsQuotationOpen(true)}
                      style={{
                        backgroundColor: '#FEF08A',
                        color: '#1E3A8A',
                        border: 'none',
                        borderRadius: '9999px',
                        padding: '6px 16px',
                        fontWeight: '800',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      GET BULK QUOTE
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400"
                    alt="Havells Wire"
                    style={{ maxHeight: '130px', objectFit: 'contain', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))' }}
                  />
                </div>
              </div>
            )}

            {/* Carousel Navigation Indicators */}
            <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 5 }}>
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  style={{
                    width: activeSlide === idx ? '18px' : '6px',
                    height: '6px',
                    borderRadius: '9999px',
                    backgroundColor: activeSlide === idx ? 'var(--primary-navy)' : '#CBD5E1',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY CATALOG GRID (Exact 4-Column Screenshot 1 Match) */}
      {categoriesList.length > 0 && (
        <section style={{ padding: '1rem 0 1.5rem 0' }}>
          <div className="container">
            {/* Quick Commerce 4-Column Responsive Grid */}
            <div className="qc-category-grid">
              {categoriesList.map((cat) => (
                <CategoryCard key={cat.id || cat.slug} category={cat} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. PRODUCT SHELF: Bestsellers with 60 Min Express Delivery (Compact Sliding View) */}
      {shelfProducts.length > 0 && (
        <section style={{ padding: '0.5rem 0 1rem 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '4px', height: '18px', backgroundColor: 'var(--brand-orange)', borderRadius: '2px' }} />
                <h2 style={{ fontSize: isMobile ? '1.05rem' : '1.25rem', fontWeight: '800', color: 'var(--primary-navy)', lineHeight: 1.2 }}>
                  Bestseller Materials • Express Delivery
                </h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {/* Desktop / Tablet Slider Navigation Arrows */}
                <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => scrollBestsellers('left')}
                    aria-label="Scroll previous"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-xs)',
                      color: 'var(--primary-navy)',
                      transition: 'var(--transition)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                      e.currentTarget.style.borderColor = 'var(--border-medium)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollBestsellers('right')}
                    aria-label="Scroll next"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-xs)',
                      color: 'var(--primary-navy)',
                      transition: 'var(--transition)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                      e.currentTarget.style.borderColor = 'var(--border-medium)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => navigateTo('category-products', { slug: 'all' })}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--qc-green)',
                    fontWeight: '800',
                    fontSize: isMobile ? '0.8rem' : '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    padding: '4px 2px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span>See All</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Product Sliding View */}
            <div
              ref={bestsellerScrollRef}
              className="qc-horizontal-scroll"
            >
              {shelfProducts.map((product) => (
                <div key={product.id} className="qc-shelf-item">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. BANNER 1: MISTRI GUARANTEE (Compact & Mobile-Optimized) */}
      <section style={{ padding: '0.4rem 0 0.85rem 0' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #38BDF8 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: isMobile ? '0.85rem 1rem' : '1.25rem 1.5rem',
              color: '#FFFFFF',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr auto' : '1.4fr 1fr',
              gap: isMobile ? '0.75rem' : '1.25rem',
              alignItems: 'center',
            }}
          >
            {/* Left Column: 100% Original Seal, Title, Subtitle, Brand Badges */}
            <div style={{ zIndex: 2, minWidth: 0 }}>
              {/* 100% Original Circular Seal Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: '#FFFFFF',
                  color: '#1E3A8A',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontSize: '0.62rem',
                  fontWeight: '900',
                  marginBottom: '6px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                }}
              >
                <span>🛡️ 100% ORIGINAL</span>
              </div>

              <h3 style={{ fontSize: isMobile ? '1.05rem' : '1.35rem', fontWeight: '900', color: '#FFFFFF', lineHeight: '1.2', marginBottom: '3px' }}>
                Mistri Guarantee
              </h3>
              <div style={{ fontSize: isMobile ? '0.82rem' : '0.92rem', fontWeight: '800', color: '#FEF08A', marginBottom: '4px' }}>
                100% Original Materials
              </div>
              <p style={{ fontSize: isMobile ? '0.72rem' : '0.78rem', color: '#E0F2FE', lineHeight: '1.35', marginBottom: isMobile ? '8px' : '12px', maxWidth: '360px' }}>
                Verify product authenticity using official manufacturer apps and direct mill test reports.
              </p>

              {/* Verified Brand Logos Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '6px', flexWrap: 'wrap' }}>
                {['CenturyPly', 'Havells', 'Finolex', 'Greenply', 'UltraTech'].map((bName) => (
                  <div
                    key={bName}
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#0B2947',
                      fontSize: isMobile ? '0.58rem' : '0.64rem',
                      fontWeight: '800',
                      padding: isMobile ? '2px 6px' : '3px 7px',
                      borderRadius: '4px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                    }}
                  >
                    {bName}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Smartphone QR Authenticity Scan Graphic */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', flexShrink: 0 }}>
              {/* Mobile Device Mockup */}
              <div
                style={{
                  width: isMobile ? '88px' : '115px',
                  height: isMobile ? '114px' : '146px',
                  backgroundColor: '#0F172A',
                  borderRadius: isMobile ? '12px' : '16px',
                  padding: isMobile ? '4px' : '5px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                  border: '1.5px solid rgba(255,255,255,0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ width: isMobile ? '24px' : '30px', height: '3px', backgroundColor: '#334155', borderRadius: '2px' }} />

                {/* Screen Content */}
                <div
                  style={{
                    backgroundColor: '#E0B589',
                    width: '100%',
                    height: isMobile ? '88px' : '114px',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: isMobile ? '0.48rem' : '0.56rem', fontWeight: '900', color: '#5A3515' }}>CENTURYPLY</span>
                  <div style={{ margin: isMobile ? '2px 0' : '4px 0', padding: isMobile ? '2px' : '3px', backgroundColor: '#FFFFFF', borderRadius: '4px' }}>
                    <QrCode size={isMobile ? 28 : 38} color="#000000" />
                  </div>
                  <span style={{ fontSize: isMobile ? '0.42rem' : '0.48rem', fontWeight: '800', color: '#038A53' }}>✓ VERIFIED GENUINE</span>
                </div>

                <div style={{ width: isMobile ? '16px' : '20px', height: '2px', backgroundColor: '#334155', borderRadius: '1px' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SIMPLE COMPACT BOTTOM PROMO BANNER (Mobile-Responsive & Slideable) */}
      <section style={{ padding: '0.65rem 0 1.25rem 0' }}>
        <div className="container">
          <div
            onMouseEnter={() => setIsPromoPaused(true)}
            onMouseLeave={() => setIsPromoPaused(false)}
            onTouchStart={onPromoTouchStart}
            onTouchMove={onPromoTouchMove}
            onTouchEnd={onPromoTouchEnd}
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-subtle)',
              userSelect: 'none',
              touchAction: 'pan-y',
            }}
          >
            {/* Sliding Track */}
            <div
              style={{
                display: 'flex',
                transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                transform: `translateX(-${promoIndex * 100}%)`,
              }}
            >
              {MISTRI_PROMO_SLIDES.map((slide, idx) => {
                const IconComp = slide.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => navigateTo(slide.target)}
                    style={{
                      flex: '0 0 100%',
                      minWidth: '100%',
                      background: slide.gradient,
                      color: '#FFFFFF',
                      padding: '16px 18px 22px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '14px',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                      minHeight: '92px',
                    }}
                  >
                    {/* Left: Icon + Text */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.16)',
                          border: `1.5px solid ${slide.accent}60`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: slide.accent,
                          flexShrink: 0,
                          boxShadow: `0 4px 12px ${slide.accent}25`,
                        }}
                      >
                        <IconComp size={24} strokeWidth={2.4} />
                      </div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              fontSize: '1rem',
                              fontWeight: '900',
                              color: '#FFFFFF',
                              letterSpacing: '-0.01em',
                              lineHeight: '1.2',
                            }}
                          >
                            {slide.title}
                          </span>
                          <span
                            style={{
                              fontSize: '0.65rem',
                              fontWeight: '900',
                              backgroundColor: `${slide.accent}25`,
                              color: slide.accent,
                              border: `1px solid ${slide.accent}60`,
                              padding: '2px 7px',
                              borderRadius: '5px',
                              letterSpacing: '0.04em',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {slide.badge}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            color: 'rgba(255, 255, 255, 0.88)',
                            lineHeight: '1.35',
                          }}
                        >
                          {slide.desc}
                        </div>
                      </div>
                    </div>

                    {/* Right: Compact Action Button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <span
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: '800',
                          backgroundColor: slide.accent,
                          color: '#0B2947',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          boxShadow: '0 3px 8px rgba(0,0,0,0.25)',
                          whiteSpace: 'nowrap',
                          transition: 'var(--transition)',
                        }}
                      >
                        <span>{slide.cta}</span>
                        <ChevronRight size={15} strokeWidth={3} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subtle Slide Indicators (Mini Dots Overlay) */}
            <div
              style={{
                position: 'absolute',
                bottom: '6px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '5px',
                pointerEvents: 'none',
              }}
            >
              {MISTRI_PROMO_SLIDES.map((_, dotIdx) => (
                <div
                  key={dotIdx}
                  style={{
                    width: promoIndex === dotIdx ? '18px' : '5px',
                    height: '4px',
                    borderRadius: '2px',
                    backgroundColor: promoIndex === dotIdx ? '#FFFFFF' : 'rgba(255, 255, 255, 0.35)',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. B2B / CONTRACTOR BULK PROCUREMENT PROMO */}
      <section className="hide-on-mobile" style={{ padding: '0.75rem 0 1.5rem 0' }}>
        <div className="container">
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem 1.5rem',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-xs)',
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr',
              gap: '1.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--qc-ice-blue)', color: 'var(--primary-navy)', padding: '3px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '800', marginBottom: '8px' }}>
                <HardHat size={14} color="#F59E0B" />
                <span>COMMERCIAL CONTRACTORS & BUILDERS</span>
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '8px' }}>
                Need 500+ Bags or Multi-Tonne Rebars?
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '14px' }}>
                Upload your Bill of Quantities (BOQ) or blueprint. Get instant depot-direct quote with guaranteed 60-min express crane site delivery.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigateTo('contact')}
                  className="btn btn-primary"
                  style={{ backgroundColor: '#F59E0B', color: '#0B2947', fontWeight: '800' }}
                >
                  Request Bulk BOQ Quote
                </button>
                <button
                  onClick={() => navigateTo('help')}
                  className="btn btn-secondary"
                >
                  Contractor Credit Terms
                </button>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-navy)' }}>
                <CheckCircle2 size={18} color="var(--qc-green)" />
                <span>Automated GST Input Tax Credit (ITC)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-navy)' }}>
                <CheckCircle2 size={18} color="var(--qc-green)" />
                <span>Mill Test Certificate (MTC) Provided</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-navy)' }}>
                <CheckCircle2 size={18} color="var(--qc-green)" />
                <span>Direct Crane & Dumper Unloading</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CERTIFIED NATIONAL BRANDS (CenturyPly, Havells, UltraTech, Action TESA, Kajaria, etc.) */}
      {TOP_BRANDS && TOP_BRANDS.length > 0 && (
        <section className="hide-on-mobile" style={{ padding: '1rem 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-subtle)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Authorized Partner Depots
                </span>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)', fontWeight: '800' }}>
                  Certified National Brands
                </h3>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.85rem',
              }}
            >
              {TOP_BRANDS.map((brand) => (
                <div
                  key={brand.name}
                  onClick={() => navigateTo('search', { query: brand.name })}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.borderColor = 'var(--brand-yellow)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={brand.logo} alt={brand.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: '700', fontSize: '0.82rem', color: 'var(--primary-navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {brand.name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{brand.tag}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomeView;
