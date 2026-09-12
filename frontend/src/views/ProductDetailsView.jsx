import React, { useState } from 'react';
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
  HardHat,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/mockData';
import ProductGallery from '../components/ProductGallery';
import ProductCard from '../components/ProductCard';

export const ProductDetailsView = () => {
  const { viewParams, navigateTo, addToCart, toggleWishlist, isInWishlist, currentPincode, currentCity, addToast, getProductById } = useStore();
  
  const productId = viewParams?.id || viewParams?.productId || viewParams?.product?.id;
  const product = viewParams?.product || (productId ? getProductById(productId) : null) || PRODUCTS[0];

  const [quantity, setQuantity] = useState(product.minOrderQty || 1);
  const [checkPin, setCheckPin] = useState(currentPincode || '452005');
  const [pinChecked, setPinChecked] = useState(true);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'features' | 'reviews' | 'seller'

  const isFavorite = isInWishlist(product.id);

  // Bulk Tier Calculation
  let calculatedUnitPrice = product.price;
  if (product.id === 'prod_1' && quantity >= 50) calculatedUnitPrice = 405;
  if (product.id === 'prod_4' && quantity >= 5) calculatedUnitPrice = 63200;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigateTo('checkout');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Product link copied to clipboard!', 'info');
  };

  // Related materials in same category
  const relatedProducts = PRODUCTS.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4);

  return (
    <div className="container page-container">
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button onClick={() => navigateTo('home')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Home</button>
        <span>/</span>
        <button onClick={() => navigateTo('categories')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Categories</button>
        <span>/</span>
        <button onClick={() => navigateTo('category-products', { slug: product.categorySlug })} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>{product.category}</button>
        <span>/</span>
        <span style={{ color: 'var(--primary-navy)', fontWeight: '700' }}>{product.name}</span>
      </div>

      {/* Main Dual-Column Product Hero */}
      <div className="responsive-split-product" style={{ marginBottom: '3rem' }}>
        {/* Left Column: Image Gallery */}
        <div>
          <ProductGallery images={product.gallery || [product.image]} alt={product.name} />

          {/* Quick Assurance Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '1.25rem' }}>
            <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <ShieldCheck size={18} color="#10b981" style={{ margin: '0 auto 4px auto' }} />
              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--primary-navy)' }}>100% Genuine</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Authorized Stock</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <Truck size={18} color="#F47721" style={{ margin: '0 auto 4px auto' }} />
              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--primary-navy)' }}>Site Unload</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Direct truck delivery</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <FileText size={18} color="#0ea5e9" style={{ margin: '0 auto 4px auto' }} />
              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--primary-navy)' }}>MTC Included</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Structural Certificate</div>
            </div>
          </div>
        </div>

        {/* Right Column: Product Purchase Box & Information */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          {/* Brand & Category Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary-navy)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {product.brand}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleShare}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                title="Share Product"
              >
                <Share2 size={18} />
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                style={{ background: 'none', border: 'none', color: isFavorite ? '#F47721' : 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                title="Save to Wishlist"
              >
                <Heart size={20} fill={isFavorite ? '#F47721' : 'none'} />
              </button>
            </div>
          </div>

          {/* Product Title */}
          <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--primary-navy)', lineHeight: '1.25', marginBottom: '0.75rem' }}>
            {product.name}
          </h1>

          {/* Ratings & Reviews */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#FEF08A', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '800', color: '#854D0E' }}>
              <Star size={14} fill="#CA8A04" color="#CA8A04" />
              <span>{product.rating}</span>
            </div>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              ({product.reviewsCount} verified site contractor reviews)
            </span>
            <span style={{ color: 'var(--border-medium)' }}>•</span>
            <span style={{ fontSize: '0.825rem', color: '#10b981', fontWeight: '700' }}>
              In Stock ({product.stockCount} {product.unit}s available)
            </span>
          </div>

          {/* Pricing Box */}
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px' }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-orange)' }}>
                ₹{calculatedUnitPrice.toLocaleString()}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                / {product.unit}
              </span>
              {product.mrp && (
                <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  MRP ₹{product.mrp.toLocaleString()}
                </span>
              )}
              {product.discount && (
                <span className="badge badge-orange">
                  {product.discount}
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              (Inclusive of all applicable 18% / 28% GST taxes. Input tax credit invoice available)
            </div>

            {/* Bulk Volume Tier Alert */}
            {product.bulkTier && (
              <div
                style={{
                  marginTop: '10px',
                  padding: '8px 12px',
                  backgroundColor: 'var(--light-orange)',
                  border: '1px solid rgba(244, 119, 33, 0.3)',
                  borderRadius: '4px',
                  fontSize: '0.825rem',
                  fontWeight: '700',
                  color: 'var(--primary-orange)',
                }}
              >
                ⚡ Contractor Tier: {product.bulkTier}
              </div>
            )}
          </div>

          {/* Quantity Stepper & Add To Cart Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)', minWidth: '80px' }}>
                Quantity:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(product.minOrderQty || 1, quantity - 1))}
                  style={{ width: '38px', height: '38px', backgroundColor: 'var(--bg-surface)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  min={product.minOrderQty || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  style={{ width: '60px', height: '38px', textAlign: 'center', fontWeight: '700', border: 'none', fontSize: '1rem' }}
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: '38px', height: '38px', backgroundColor: 'var(--bg-surface)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Plus size={16} />
                </button>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {product.unit} (Min: {product.minOrderQty || 1})
              </span>
            </div>

            {/* Total Calculation Teaser */}
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Total Estimate: <strong style={{ color: 'var(--primary-navy)', fontSize: '1.1rem' }}>₹{(calculatedUnitPrice * quantity).toLocaleString()}</strong>
            </div>

            {/* Action Buttons */}
            <div className="responsive-split-equal" style={{ gap: '10px' }}>
              <button
                type="button"
                onClick={handleAddToCart}
                className="btn btn-navy btn-lg"
                style={{ display: 'flex', gap: '8px', fontWeight: '700', justifyContent: 'center' }}
              >
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="btn btn-primary btn-lg"
                style={{ fontWeight: '700', justifyContent: 'center' }}
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Delivery Pincode Checker */}
          <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
              Check Delivery & Crane Unloading to Site:
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1 1 180px' }}>
                <MapPin size={16} color="var(--primary-orange)" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                <input
                  type="text"
                  maxLength={6}
                  value={checkPin}
                  onChange={(e) => setCheckPin(e.target.value.replace(/\D/g, ''))}
                  className="form-control"
                  style={{ paddingLeft: '34px', fontSize: '0.9rem', fontWeight: '600' }}
                />
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setPinChecked(true)}
              >
                Verify Pincode
              </button>
            </div>

            {pinChecked && (
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#10b981', fontWeight: '600' }}>
                <Check size={16} />
                <span>Express Site Delivery available to {currentCity} ({checkPin}) by Tomorrow 12:00 PM</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deep Information Tabs: Specs, Features, Reviews, Seller Info */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '3rem', boxShadow: 'var(--shadow-xs)' }}>
        {/* Tabs Strip */}
        <div className="tab-scroll-container" style={{ borderBottom: '2px solid var(--border-subtle)', marginBottom: '1.5rem', paddingBottom: '2px' }}>
          {[
            { id: 'specs', label: 'Specifications' },
            { id: 'features', label: 'Key Features' },
            { id: 'description', label: 'Description' },
            { id: 'reviews', label: `Reviews (${product.reviewsCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.65rem 0.5rem',
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

        {/* Tab 1: Specifications */}
        {activeTab === 'specs' && (
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-navy)', marginBottom: '1rem' }}>
              Standard Structural Specifications
            </h3>
            {product.specifications ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <tbody>
                    {Object.entries(product.specifications).map(([key, val], idx) => (
                      <tr
                        key={key}
                        style={{
                          backgroundColor: idx % 2 === 0 ? 'var(--bg-surface)' : '#FFFFFF',
                          borderBottom: '1px solid var(--border-subtle)',
                        }}
                      >
                        <td style={{ padding: '8px 12px', fontWeight: '700', color: 'var(--text-primary)', width: '40%' }}>
                          {key}
                        </td>
                        <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>
                          {val}
                        </td>
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

        {/* Tab 2: Features */}
        {activeTab === 'features' && (
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-navy)', marginBottom: '1rem' }}>
              Engineering Features & Site Suitability
            </h3>
            <div className="responsive-split-equal" style={{ gap: '0.85rem' }}>
              {(product.features || [
                'Complies with latest Bureau of Indian Standards (BIS) norms',
                'Supplied with original batch test certificate',
                'Packed in tamper-evident sealed packaging',
                'Suitable for high-load residential & commercial structures',
              ]).map((feat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Detailed Description */}
        {activeTab === 'description' && (
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)', marginBottom: '1rem' }}>
              About {product.name}
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7', maxWidth: '820px' }}>
              {product.description}
            </p>
          </div>
        )}

        {/* Tab 4: Contractor Reviews */}
        {activeTab === 'reviews' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)' }}>Verified Site Contractor Ratings</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <Star size={18} fill="#CA8A04" color="#CA8A04" />
                  <strong style={{ fontSize: '1.1rem' }}>{product.rating} / 5.0</strong>
                  <span style={{ color: 'var(--text-muted)' }}>based on {product.reviewsCount} customer reviews</span>
                </div>
              </div>
            </div>

            {/* Sample Reviews */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--primary-navy)' }}>Er. Dinesh Sharma (RCC Contractor)</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>3 days ago</span>
                </div>
                <div style={{ display: 'flex', gap: '2px', color: '#CA8A04', marginBottom: '6px' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#CA8A04" />)}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Ordered 100 bags for our slab casting in Super Corridor. Delivered directly by 10-wheeler truck at 7:00 AM sharp with test certificate. Excellent fresh batch cement!
                </p>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--primary-navy)' }}>Vikram Singh (Civil Builder)</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1 week ago</span>
                </div>
                <div style={{ display: 'flex', gap: '2px', color: '#CA8A04', marginBottom: '6px' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#CA8A04" />)}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Very smooth ordering on MISTRI. Bulk price automatically applied and GST input invoice was ready immediately on dashboard.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Category Materials */}
      {relatedProducts.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-navy)' }}>
              Related Materials in {product.category}
            </h2>
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
  );
};

export default ProductDetailsView;
