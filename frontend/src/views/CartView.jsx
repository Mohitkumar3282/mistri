import React from 'react';
import {
  ChevronLeft,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  FileText,
  ShoppingCart,
  Receipt,
  Sparkles,
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
    discountAmount,
    unloadingCharge,
    gstAmount,
    grandTotal,
    navigateTo,
  } = useStore();

  if (cart.length === 0) {
    return (
      <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '40px' }}>
        {/* Clean Top Header */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <button
            type="button"
            onClick={() => navigateTo('home')}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
          >
            <ChevronLeft size={20} color="#0F172A" />
          </button>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
              Your cart
            </h1>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '500' }}>
              0 items
            </span>
          </div>
        </div>

        {/* Empty State */}
        <div style={{ maxWidth: '520px', margin: '3rem auto', padding: '0 16px', textAlign: 'center' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '3rem 1.5rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#FFE4E6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                color: '#E11D48',
              }}
            >
              <ShoppingCart size={32} />
            </div>
            <h2 style={{ fontSize: '1.3rem', color: '#0F172A', marginBottom: '0.5rem', fontWeight: '800' }}>
              Your cart is empty
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
              You haven't added any building materials or products to your cart yet.
            </p>
            <button
              onClick={() => navigateTo('home')}
              style={{
                display: 'inline-flex',
                gap: '8px',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#E11D48',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 24px',
                fontSize: '0.92rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(225, 29, 72, 0.25)',
              }}
            >
              <span>Explore Materials & Products</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '90px' }}>
      {/* 1. Clean Top Header: Back Button + Your cart Title + Subtitle */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigateTo('home')}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
          >
            <ChevronLeft size={20} color="#0F172A" />
          </button>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
              Your cart
            </h1>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '500' }}>
              {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} · ₹{(grandTotal || 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={clearCart}
          style={{
            background: 'none',
            border: 'none',
            color: '#E11D48',
            fontSize: '0.78rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Trash2 size={13} />
          <span>Clear</span>
        </button>
      </div>

      {/* Main Cart Content Container */}
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '14px 14px 20px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {/* 2. Your items Card (Exact Reference Image Match) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            padding: '16px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div
            style={{
              fontSize: '0.95rem',
              fontWeight: '800',
              color: '#0F172A',
              marginBottom: '16px',
            }}
          >
            Your items
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {cart.map((item, index) => {
              const itemTotal = (item.price || 0) * item.quantity;
              const isLast = index === cart.length - 1;

              return (
                <div
                  key={item.product.id}
                  style={{
                    paddingBottom: isLast ? '0' : '16px',
                    borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
                  }}
                >
                  {/* Top Row: Thumbnail + Info */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '10px',
                        border: '1px solid #F1F5F9',
                        backgroundColor: '#F8FAFC',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          borderRadius: '6px',
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3
                        style={{
                          fontSize: '0.88rem',
                          fontWeight: '700',
                          color: '#0F172A',
                          margin: '0 0 4px 0',
                          lineHeight: 1.3,
                        }}
                      >
                        {item.product.name}
                      </h3>

                      {/* Variant Badge */}
                      <div style={{ marginBottom: '4px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#FFE4E6',
                            color: '#E11D48',
                            fontSize: '0.7rem',
                            fontWeight: '800',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px',
                          }}
                        >
                          VARIANT {item.variant || item.product.unit || 'Standard'}
                        </span>
                      </div>

                      {/* Price Per Unit */}
                      <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '4px', fontWeight: '500' }}>
                        ₹{(item.price || 0).toLocaleString('en-IN')} each
                      </div>

                      {/* Remove Action */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '0.75rem',
                          color: '#94A3B8',
                          cursor: 'pointer',
                          fontWeight: '500',
                        }}
                      >
                        <Trash2 size={12} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Bottom Row: Red outlined Stepper on left + Total Price on right */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '12px',
                    }}
                  >
                    {/* Red Outline Stepper (Exact Reference Match) */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        border: '1.5px solid #E11D48',
                        borderRadius: '8px',
                        height: '32px',
                        backgroundColor: '#FFFFFF',
                        overflow: 'hidden',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#E11D48',
                        }}
                      >
                        {item.quantity === 1 ? (
                          <Trash2 size={14} color="#E11D48" />
                        ) : (
                          <Minus size={14} color="#E11D48" strokeWidth={2.5} />
                        )}
                      </button>

                      <span
                        style={{
                          minWidth: '28px',
                          textAlign: 'center',
                          fontWeight: '800',
                          fontSize: '0.88rem',
                          color: '#E11D48',
                        }}
                      >
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#E11D48',
                        }}
                      >
                        <Plus size={14} color="#E11D48" strokeWidth={2.5} />
                      </button>
                    </div>

                    {/* Total Price for item */}
                    <div
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: '800',
                        color: '#0F172A',
                      }}
                    >
                      ₹{itemTotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Bill details Card (Exact Reference Image Match) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            padding: '16px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.95rem',
              fontWeight: '800',
              color: '#0F172A',
              marginBottom: '14px',
            }}
          >
            <Receipt size={18} color="#E11D48" />
            <span>Bill details</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>Item total</span>
              <span style={{ fontWeight: '600', color: '#0F172A' }}>₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>Delivery</span>
              <span style={{ fontWeight: '700', color: '#10B981' }}>FREE</span>
            </div>

            {gstAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Estimated GST (18% ITC Benefit)</span>
                <span style={{ fontWeight: '600', color: '#0F172A' }}>₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E11D48' }}>
                <span>Contractor Coupon / Rebate</span>
                <span style={{ fontWeight: '700' }}>-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            {/* Divider */}
            <div style={{ borderTop: '1px solid #F1F5F9', margin: '4px 0' }} />

            {/* Grand Total */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '2px',
              }}
            >
              <span style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A' }}>
                Grand total
              </span>
              <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A' }}>
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Sticky Bottom Action Bar: Continue to checkout Button (Sleek Mobile-Responsive) */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          padding: '8px 14px max(8px, env(safe-area-inset-bottom, 8px)) 14px',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
          zIndex: 1000,
        }}
      >
        <div style={{ maxWidth: '540px', margin: '0 auto' }}>
          <button
            type="button"
            onClick={() => navigateTo('checkout')}
            style={{
              width: '100%',
              height: '42px',
              backgroundColor: '#E11D48',
              color: '#FFFFFF',
              borderRadius: '10px',
              border: 'none',
              fontWeight: '700',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(225, 29, 72, 0.22)',
              transition: 'transform 0.15s ease, opacity 0.15s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span>Continue to checkout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartView;
