import React, { useState } from 'react';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  FileText,
  AlertCircle,
  Heart,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartView = () => {
  const {
    cart,
    removeFromCart,
    updateCartQty,
    clearCart,
    cartSubtotal,
    cartItemCount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    unloadingCharge,
    gstAmount,
    grandTotal,
    navigateTo,
    toggleWishlist,
    currentCity,
    user,
    requireAuth,
    openLoginModal,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [gstInvoiceRequired, setGstInvoiceRequired] = useState(true);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container page-container" style={{ textAlign: 'center' }}>
        <div
          style={{
            maxWidth: '520px',
            margin: '2rem auto',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '3rem 1.5rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--light-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', color: 'var(--primary-orange)' }}>
            <ShoppingCart size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-navy)', marginBottom: '0.5rem', fontWeight: '800' }}>
            Your Construction Cart is Empty
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            You haven't added any building materials or tools to your project site cart yet.
          </p>
          <button
            onClick={() => navigateTo('categories')}
            className="btn btn-primary btn-lg mobile-w-full"
            style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}
          >
            <span>Explore Construction Materials</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-container">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">
          Project Site Shopping Cart
        </h1>
        <p className="page-subtitle">
          Review quantities, apply volume contractor discounts, and schedule delivery to {currentCity}.
        </p>
      </div>

      {/* Cart Grid Layout */}
      <div className="responsive-split-cart">
        {/* Left Column: Cart Items List */}
        <div>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
              <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--primary-navy)' }}>
                {cartItemCount} Items in Order
              </span>
              <button
                onClick={clearCart}
                style={{ background: 'none', border: 'none', color: '#D92D20', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Trash2 size={13} />
                <span>Clear Cart</span>
              </button>
            </div>

            {/* Item Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                  }}
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '6px', backgroundColor: 'var(--bg-surface)', flexShrink: 0 }}
                  />

                  {/* Title & Brand */}
                  <div style={{ flex: '1 1 200px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--primary-navy)', textTransform: 'uppercase' }}>
                      {item.product.brand}
                    </span>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {item.product.name}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      ₹{item.price?.toLocaleString()} / {item.product.unit}
                    </div>

                    {/* Stepper + Wishlist */}
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem', marginTop: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-medium)', borderRadius: '6px', overflow: 'hidden' }}>
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                          style={{ width: '28px', height: '28px', background: 'var(--bg-surface)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ width: '38px', textAlign: 'center', fontWeight: '700', fontSize: '0.85rem' }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                          style={{ width: '28px', height: '28px', background: 'var(--bg-surface)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleWishlist(item.product)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Heart size={14} />
                        <span>Save</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        style={{ background: 'none', border: 'none', color: '#D92D20', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div style={{ textAlign: 'right', marginLeft: 'auto', minWidth: '80px' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary-navy)' }}>
                      ₹{(item.price * item.quantity)?.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {item.quantity} {item.product.unit}s
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout */}
        <div>
          {/* Coupon Box */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-navy)', marginBottom: '8px' }}>
              Contractor Promo / Coupon Code
            </label>
            {appliedCoupon ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--light-orange)', border: '1px solid var(--primary-orange)', padding: '8px 12px', borderRadius: '6px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary-orange)' }}>
                    Coupon '{appliedCoupon.code}' Applied!
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Saved extra {appliedCoupon.discountPercentage}% (₹{discountAmount.toLocaleString()})
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  style={{ background: 'none', border: 'none', color: '#D92D20', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="e.g. BUILDMISTRI"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="form-control"
                  style={{ flex: 1, textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: '600' }}
                />
                <button type="submit" className="btn btn-navy btn-sm">
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Price Summary Breakdown */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-navy)', fontWeight: '800', marginBottom: '1rem', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
              Order Price Breakdown
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Material Subtotal:</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>₹{cartSubtotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary-orange)' }}>
                  <span>Contractor Rebate / Coupon:</span>
                  <span style={{ fontWeight: '700' }}>- ₹{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Crane & Site Unloading:</span>
                <span style={{ fontWeight: '600', color: unloadingCharge === 0 ? '#10b981' : 'var(--text-primary)' }}>
                  {unloadingCharge === 0 ? 'FREE (Orders ₹50k+)' : `₹${unloadingCharge}`}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Direct Site Freight:</span>
                <span style={{ fontWeight: '700', color: '#10b981' }}>FREE</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Estimated GST (18% ITC benefit):</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>₹{gstAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* GST Tax Invoice Checkbox */}
            <div style={{ padding: '8px 10px', backgroundColor: 'var(--bg-surface)', borderRadius: '6px', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={gstInvoiceRequired}
                  onChange={(e) => setGstInvoiceRequired(e.target.checked)}
                  style={{ accentColor: 'var(--primary-orange)' }}
                />
                <span>Generate B2B GST Tax Invoice for ITC</span>
              </label>
            </div>

            {/* Total Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '0.85rem', borderTop: '2px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--primary-navy)' }}>
                Grand Total:
              </span>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-orange)' }}>
                ₹{grandTotal.toLocaleString()}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => requireAuth(() => navigateTo('checkout'))}
              className="btn btn-primary btn-lg btn-block"
              style={{ fontWeight: '800', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            {!user && (
              <div style={{ marginTop: '0.85rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                🔒 Fast checkout: You'll be prompted to sign in or register before confirming.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;
