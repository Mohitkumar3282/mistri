import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  Award,
  CheckCircle2,
  FileText,
  Clock,
  MapPin,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  ChevronLeft,
  Search,
  Zap,
  Gift,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/mockData';
import ProductCard from '../components/ProductCard';

export const ProductDetailsView = () => {
  const {
    viewParams,
    navigateTo,
    addToCart,
    updateCartQty,
    cart,
    cartItemCount,
    toggleWishlist,
    isInWishlist,
    currentPincode,
    currentCity,
    addToast,
    getProductById,
    products,
  } = useStore();

  const productList = products && products.length > 0 ? products : PRODUCTS;
  const productId = viewParams?.id || viewParams?.productId || viewParams?.product?.id;
  const product = viewParams?.product || (productId ? getProductById(productId) : null) || productList[0];

  // Active Gallery Image Index
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // Variant Groups Management
  const [selectedVariants, setSelectedVariants] = useState({});

  useEffect(() => {
    if (product?.variantGroups && product.variantGroups.length > 0) {
      const initial = {};
      product.variantGroups.forEach((group) => {
        // Pick default option (popular if marked, else first)
        const defOpt = group.options.find((o) => o.isPopular) || group.options[0];
        initial[group.id] = defOpt;
      });
      setSelectedVariants(initial);
    } else if (product?.optionsList && product.optionsList.length > 0) {
      setSelectedVariants({ default: product.optionsList[0] });
    }
  }, [product]);

  // Handle Pill Click
  const handleSelectOption = (groupId, option) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [groupId]: option,
    }));
  };

  // Derived Pricing from Variant Selections
  const currentPrice = useMemo(() => {
    let price = product?.price || 0;
    Object.values(selectedVariants).forEach((opt) => {
      if (opt && opt.price) price = opt.price;
    });
    return price;
  }, [product, selectedVariants]);

  const currentMrp = useMemo(() => {
    let mrp = product?.mrp || null;
    Object.values(selectedVariants).forEach((opt) => {
      if (opt && opt.mrp) mrp = opt.mrp;
    });
    return mrp;
  }, [product, selectedVariants]);

  const currentDiscount = useMemo(() => {
    if (currentMrp && currentPrice < currentMrp) {
      const pct = Math.round(((currentMrp - currentPrice) / currentMrp) * 100);
      return `${pct}% OFF`;
    }
    return product?.discount || null;
  }, [product, currentPrice, currentMrp]);

  const selectedVariantSummary = useMemo(() => {
    const parts = Object.values(selectedVariants)
      .filter(Boolean)
      .map((opt) => opt.name || opt.label || opt.value || opt);
    return parts.join(' • ');
  }, [selectedVariants]);

  const cartItem = cart.find(
    (item) => item.product?.id === product?.id || item.id === product?.id
  );
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  const [checkPin, setCheckPin] = useState(currentPincode || '452005');
  const [pinChecked, setPinChecked] = useState(true);

  useEffect(() => {
    if (currentPincode) {
      setCheckPin(currentPincode);
    }
  }, [currentPincode]);

  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'features' | 'description' | 'reviews'

  const isFavorite = isInWishlist(product.id);
  const galleryImages = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  const handleAdd = () => {
    const itemToAdd = {
      ...product,
      name: selectedVariantSummary ? `${product.name} (${selectedVariantSummary})` : product.name,
      price: currentPrice,
      mrp: currentMrp,
      discount: currentDiscount,
      selectedVariant: selectedVariantSummary,
      // Which option was chosen in each group, so the server can price the same variant.
      variantSelection: Object.fromEntries(
        Object.entries(selectedVariants)
          .filter(([, opt]) => opt)
          .map(([groupId, opt]) => [groupId, opt.name ?? opt.label ?? opt.value ?? opt])
      ),
    };
    addToCart(itemToAdd, 1);
  };

  const handleIncrement = () => {
    if (cartItem) {
      updateCartQty(product.id, qtyInCart + 1);
    } else {
      handleAdd();
    }
  };

  const handleDecrement = () => {
    if (cartItem) {
      updateCartQty(product.id, qtyInCart - 1);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Product link copied to clipboard!', 'info');
  };

  // Related materials in same category
  const relatedProducts = productList.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4);

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '90px' }}>
      {/* 1. DEDICATED TOP APP BAR (MOBILE MATCH TO REFERENCE SCREENSHOT) */}
      <div className="qc-product-topbar hide-on-desktop">
        <button
          type="button"
          onClick={() => navigateTo('categories')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
          aria-label="Back"
        >
          <ChevronLeft size={24} color="var(--primary-navy)" />
        </button>

        <div className="qc-product-topbar-title" title={product.name}>
          {product.name}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => navigateTo('search')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', color: 'var(--primary-navy)' }}
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          <button
            type="button"
            onClick={() => navigateTo('cart')}
            style={{
              position: 'relative',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#1E293B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.12)',
            }}
            aria-label="Cart"
          >
            <ShoppingCart size={16} />
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

      <div className="container" style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 12px' }}>
        {/* Desktop Breadcrumb */}
        <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: 'var(--text-secondary)', padding: '1rem 0', flexWrap: 'wrap' }}>
          <button onClick={() => navigateTo('home')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Home</button>
          <span>/</span>
          <button onClick={() => navigateTo('categories')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Categories</button>
          <span>/</span>
          <button onClick={() => navigateTo('category-products', { slug: product.categorySlug })} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>{product.category}</button>
          <span>/</span>
          <span style={{ color: 'var(--primary-navy)', fontWeight: '700' }}>{product.name}</span>
        </div>

        {/* Main Grid: Left Gallery + Right Info */}
        <div className="responsive-split-product" style={{ marginTop: '0.75rem', gap: '1.5rem' }}>
          {/* LEFT: PRODUCT IMAGE & PAGINATION DOTS */}
          <div>
            <div
              style={{
                position: 'relative',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 'clamp(280px, 68vw, 420px)',
                padding: '1rem',
                boxShadow: '0 2px 10px rgba(8, 39, 76, 0.04)',
              }}
            >
              {/* Product Image */}
              <img
                src={galleryImages[activeImgIdx]}
                alt={product.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  transition: 'transform 0.3s ease',
                }}
              />

              {/* Warranty / Quality Badge Overlay */}
              {product.warrantyBadge && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    fontSize: '0.7rem',
                    fontWeight: '900',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.35)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {product.warrantyBadge}
                </div>
              )}

              {/* Wishlist Button Overlay */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: isFavorite ? 'var(--primary-orange)' : 'var(--text-secondary)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                }}
                title="Save to Wishlist"
              >
                <Heart size={18} fill={isFavorite ? 'var(--primary-orange)' : 'none'} />
              </button>
            </div>

            {/* Carousel Paging Dots (Exact Match) */}
            {galleryImages.length > 1 && (
              <div className="qc-image-dots">
                {galleryImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImgIdx(idx)}
                    className={`qc-image-dot ${activeImgIdx === idx ? 'active' : ''}`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: PRODUCT INFO, SELECTORS, CASHBACK & DETAILS */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '1.25rem', boxShadow: '0 2px 10px rgba(8, 39, 76, 0.04)' }}>
            {/* Free Delivery Pill Badge */}
            <div className="qc-delivery-pill-wrapper">
              <div className="qc-delivery-pill">
                <Truck size={12} strokeWidth={2.5} />
                <span>Free Delivery</span>
              </div>
              <span className="qc-delivery-subtext">on orders above ₹500</span>
            </div>

            {/* Product Title */}
            <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.55rem)', fontWeight: '800', color: 'var(--primary-navy)', lineHeight: '1.3', marginBottom: '0.65rem' }}>
              {product.name}
            </h1>

            {/* Price & MRP Row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: 'clamp(1.5rem, 5vw, 1.85rem)', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                ₹ {currentPrice.toLocaleString()}
              </span>
              {currentMrp && (
                <span style={{ fontSize: '0.95rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                  ₹ {currentMrp.toLocaleString()}
                </span>
              )}
              {currentDiscount && (
                <span style={{ backgroundColor: '#FEF08A', color: '#854D0E', fontSize: '0.75rem', fontWeight: '800', padding: '2px 8px', borderRadius: '4px' }}>
                  {currentDiscount}
                </span>
              )}
            </div>

            {/* Assured 2% Cashback Card (Exact Screenshot Match) */}
            <div className="qc-cashback-box">
              <div className="qc-cashback-icon-circle">
                🪙
              </div>
              <div>
                <div className="qc-cashback-title">Assured 2% Cashback</div>
                <div className="qc-cashback-subtitle">On purchases above ₹50,000</div>
              </div>
            </div>

            {/* INTERACTIVE VARIANT SELECTOR GROUPS (Thickness, Size, Pack Size, Finish, etc.) */}
            {product.variantGroups && product.variantGroups.length > 0 ? (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                {product.variantGroups.map((group) => {
                  const selectedOpt = selectedVariants[group.id];
                  return (
                    <div key={group.id} className="qc-variant-group">
                      <div className="qc-variant-label">
                        <span>{group.name}</span>
                        {selectedOpt && (
                          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary-orange)' }}>
                            {selectedOpt.label}
                          </span>
                        )}
                      </div>
                      <div className="qc-variant-pills-row">
                        {group.options.map((opt) => {
                          const isSelected = selectedOpt?.label === opt.label;
                          return (
                            <button
                              key={opt.label}
                              type="button"
                              onClick={() => handleSelectOption(group.id, opt)}
                              className={`qc-variant-pill-btn ${isSelected ? 'selected' : ''}`}
                            >
                              <span>{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : product.optionsList && product.optionsList.length > 0 ? (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <div className="qc-variant-group">
                  <div className="qc-variant-label">
                    <span>Select Option / Pack</span>
                  </div>
                  <div className="qc-variant-pills-row">
                    {product.optionsList.map((opt) => {
                      const isSelected = selectedVariants.default?.name === opt.name;
                      return (
                        <button
                          key={opt.name}
                          type="button"
                          onClick={() => handleSelectOption('default', opt)}
                          className={`qc-variant-pill-btn ${isSelected ? 'selected' : ''}`}
                        >
                          <span>{opt.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Delivery Pincode Checker */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                Delivery Location:
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                  <MapPin size={16} color="var(--primary-orange)" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                  <input
                    type="text"
                    maxLength={6}
                    value={checkPin}
                    onChange={(e) => setCheckPin(e.target.value.replace(/\D/g, ''))}
                    className="form-control"
                    style={{ paddingLeft: '32px', height: '38px', fontSize: '0.88rem', fontWeight: '600' }}
                    placeholder="Enter Pincode"
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setPinChecked(true)}
                  style={{ height: '38px', padding: '0 14px', fontSize: '0.825rem', fontWeight: '700', whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  Verify
                </button>
              </div>

              {pinChecked && (
                <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#038A53', fontWeight: '600' }}>
                  <Check size={15} />
                  <span>Express Site Delivery available to {currentCity} ({checkPin}) by Tomorrow 12 PM</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DEEP PRODUCT INFORMATION TABS */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginTop: '1.5rem', boxShadow: '0 2px 10px rgba(8, 39, 76, 0.04)' }}>
          <div className="tab-scroll-container" style={{ borderBottom: '2px solid var(--border-subtle)', marginBottom: '1.25rem', paddingBottom: '2px' }}>
            {[
              { id: 'specs', label: 'Specifications' },
              { id: 'features', label: 'Key Features' },
              { id: 'description', label: 'Description' },
              { id: 'reviews', label: `Reviews (${product.reviewsCount || 390})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.65rem 0.65rem',
                  fontSize: '0.9rem',
                  fontWeight: activeTab === tab.id ? '800' : '600',
                  color: activeTab === tab.id ? 'var(--primary-orange)' : 'var(--text-secondary)',
                  borderBottom: activeTab === tab.id ? '3px solid var(--primary-orange)' : '3px solid transparent',
                  marginBottom: '-2px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Specifications */}
          {activeTab === 'specs' && (
            <div>
              {product.specifications ? (
                <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <table className="product-specs-table">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, val], idx) => (
                        <tr
                          key={key}
                          style={{
                            backgroundColor: idx % 2 === 0 ? 'var(--bg-surface)' : '#FFFFFF',
                            borderBottom: '1px solid var(--border-subtle)',
                          }}
                        >
                          <td style={{ fontWeight: '700', color: 'var(--text-primary)', width: '42%' }}>{key}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)' }}>Standard manufacturer specifications apply.</p>
              )}
            </div>
          )}

          {/* Features */}
          {activeTab === 'features' && (
            <div className="responsive-split-equal" style={{ gap: '0.85rem' }}>
              {(product.features || [
                'Complies with latest Bureau of Indian Standards (BIS) norms',
                'Supplied with original batch test certificate',
                'Packed in tamper-evident sealed packaging',
                'Suitable for high-load residential & commercial structures',
              ]).map((feat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="#038A53" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>{feat}</span>
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          {activeTab === 'description' && (
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.7', maxWidth: '820px' }}>
                {product.description}
              </p>
            </div>
          )}

          {/* Reviews */}
          {activeTab === 'reviews' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' }}>
                <Star size={16} fill="#CA8A04" color="#CA8A04" />
                <strong style={{ fontSize: '1rem' }}>{product.rating} / 5.0</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>based on {product.reviewsCount} customer reviews</span>
              </div>
              <div style={{ padding: '0.9rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--primary-navy)' }}>Rajesh Verma (Contractor)</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2 days ago</span>
                </div>
                <div style={{ display: 'flex', gap: '2px', color: '#CA8A04', marginBottom: '6px' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#CA8A04" />)}
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  Authentic batch material delivered promptly at project site in Indore. Excellent quality and smooth invoicing!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RELATED MATERIALS */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)' }}>Related Materials in {product.category}</h2>
              <button
                type="button"
                onClick={() => navigateTo('category-products', { slug: product.categorySlug })}
                className="btn btn-secondary btn-sm"
              >
                View More
              </button>
            </div>

            <div className="product-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. FIXED BOTTOM STICKY PURCHASE BAR (EXACT MATCH TO REFERENCE SCREENSHOT) */}
      <div className="qc-bottom-sticky-bar">
        <div>
          {selectedVariantSummary && (
            <div className="qc-bottom-variant-text" title={selectedVariantSummary}>
              {selectedVariantSummary}
            </div>
          )}
          <div className="qc-bottom-price-row">
            <span className="qc-bottom-price-val">₹ {currentPrice.toLocaleString()}</span>
            {currentMrp && <span className="qc-bottom-mrp-val">₹ {currentMrp.toLocaleString()}</span>}
            {currentDiscount && <span className="qc-bottom-discount-badge">{currentDiscount}</span>}
          </div>
          <div className="qc-bottom-gst-sub">Including GST</div>
        </div>

        <div>
          {qtyInCart > 0 ? (
            <div className="qc-bottom-qty-counter">
              <button
                type="button"
                onClick={handleDecrement}
                className="qc-bottom-qty-btn"
                aria-label="Decrease quantity"
              >
                <Minus size={14} strokeWidth={2.5} />
              </button>
              <span className="qc-bottom-qty-num">{qtyInCart}</span>
              <button
                type="button"
                onClick={handleIncrement}
                className="qc-bottom-qty-btn"
                aria-label="Increase quantity"
              >
                <Plus size={14} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              className="qc-bottom-add-btn"
            >
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsView;

