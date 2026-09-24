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
  Truck,
  Clock,
  MapPin,
  XCircle,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getCartItemKey } from '../utils/pricing';
import BillDetailsCard from '../components/BillDetailsCard';
import CancellationPolicyCard from '../components/CancellationPolicyCard';
import UnloadingServiceCard from '../components/UnloadingServiceCard';

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
    deliveryFee,
    deliveryNote,
    unloadingCharge,
    isUnloadingSelected,
    setIsUnloadingSelected,
    gstAmount,
    isGstInclusive,
    grandTotal,
    siteSettings,
    navigateTo,
    addresses,
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
                Your Cart
              </h1>
              <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '500' }}>
                0 items
              </span>
            </div>
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
                backgroundColor: '#DCFCE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                color: '#15803D',
              }}
            >
              <ShoppingCart size={32} />
            </div>
            <h2 style={{ fontSize: '1.3rem', color: '#0F172A', marginBottom: '0.5rem', fontWeight: '800' }}>
              Your cart is empty
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
              You haven't added any building materials or electrical supplies to your cart yet.
            </p>
            <button
              onClick={() => navigateTo('home')}
              style={{
                display: 'inline-flex',
                gap: '8px',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#15803D',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 24px',
                fontSize: '0.92rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)',
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

  // Calculate cashback: ₹22 per item or 2% of subtotal, whichever is higher
  const calculatedCashback = Math.max(cartItemCount * 22, Math.round(cartSubtotal * 0.02));

  // Current date formatting for processing notice
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '90px' }}>
      {/* 1. Header: Back Button + Your Cart Title + Clear Cart */}
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
          <h1 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
            Your Cart
          </h1>
        </div>

        <button
          type="button"
          onClick={clearCart}
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            color: '#0F172A',
            fontSize: '0.82rem',
            fontWeight: '700',
            padding: '6px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}
        >
          <ShoppingCart size={15} color="#0F172A" />
          <span>Clear</span>
        </button>
      </div>

      {/* Processing Notice Strip */}
      <div
        style={{
          backgroundColor: '#FEE2E2',
          borderBottom: '1px solid #FECACA',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div style={{ fontSize: '1.1rem' }}>🚚</div>
        <div style={{ color: '#991B1B', fontSize: '0.82rem', fontWeight: '600', lineHeight: 1.35 }}>
          Your order will get processed at 8 AM on {dateStr}
        </div>
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
        {/* 2. Forest Green Congrats Cashback Banner (Exact Reference Match) */}
        <div
          style={{
            backgroundColor: '#15803D',
            borderRadius: '14px',
            padding: '18px 16px',
            textAlign: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(21, 128, 61, 0.2)',
          }}
        >
          <h2 style={{ fontSize: '1.45rem', fontWeight: '900', margin: '0 0 4px 0', letterSpacing: '-0.3px' }}>
            Congrats
          </h2>
          <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: '600', color: '#F0FDF4' }}>
            You've earned <span style={{ color: '#FACC15', fontWeight: '800' }}>₹{calculatedCashback} cashback</span> on this order
          </p>
        </div>

        {/* 3. Items List Container */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            padding: '16px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {cart.map((item, index) => {
              const itemKey = item.cartItemId || getCartItemKey(item.product);
              const itemPrice = item.price || item.product?.price || 0;
              const itemTotal = itemPrice * item.quantity;
              const isLast = index === cart.length - 1;

              // Format variant subtitle (e.g. "1 sqmm / Red")
              const variantSubtitle =
                item.product?.selectedVariant ||
                (item.product?.variantSelection
                  ? Object.values(item.product.variantSelection)
                      .map((v) => (typeof v === 'object' ? v.name || v.label || v.value : v))
                      .filter(Boolean)
                      .join(' / ')
                  : '') ||
                item.variant ||
                item.product?.unit ||
                'Standard';

              // Individual item cashback badge (₹22 or 2%)
              const itemCashback = Math.max(22, Math.round(itemPrice * 0.02));

              // Product clean base name
              const cleanName = item.product?.name ? item.product.name.replace(/\s*\([^)]*\)$/, '') : 'Product';

              return (
                <div
                  key={itemKey}
                  style={{
                    paddingBottom: isLast ? '0' : '16px',
                    borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
                  }}
                >
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
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
                        src={item.product?.image || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400'}
                        alt={cleanName}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          borderRadius: '6px',
                        }}
                      />
                    </div>

                    {/* Middle Info: Title + Variant Subtitle */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: '700',
                          color: '#0F172A',
                          margin: '0 0 3px 0',
                          lineHeight: 1.3,
                        }}
                      >
                        {cleanName}
                      </h3>

                      {/* Variant details (e.g. "1 sqmm / Red") */}
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: '#64748B',
                          fontWeight: '500',
                          marginBottom: '4px',
                        }}
                      >
                        {variantSubtitle}
                      </div>

                      {/* Remove item button for convenience */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(itemKey)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '0.72rem',
                          color: '#94A3B8',
                          cursor: 'pointer',
                          fontWeight: '500',
                        }}
                      >
                        <Trash2 size={11} />
                        <span>Remove</span>
                      </button>
                    </div>

                    {/* Right Side: Green Stepper Pill + Cashback Tag + Price */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: '6px',
                        flexShrink: 0,
                      }}
                    >
                      {/* Green Rounded Stepper Pill « - QTY + » */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          backgroundColor: '#15803D',
                          borderRadius: '8px',
                          height: '32px',
                          padding: '0 4px',
                          boxShadow: '0 2px 6px rgba(21, 128, 61, 0.25)',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => updateCartQty(itemKey, item.quantity - 1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            fontSize: '0.85rem',
                            fontWeight: '800',
                          }}
                          aria-label="Decrease quantity"
                        >
                          {item.quantity === 1 ? '« -' : '« -'}
                        </button>

                        <span
                          style={{
                            minWidth: '22px',
                            textAlign: 'center',
                            fontWeight: '800',
                            fontSize: '0.9rem',
                            color: '#FFFFFF',
                          }}
                        >
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateCartQty(itemKey, item.quantity + 1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            fontSize: '0.85rem',
                            fontWeight: '800',
                          }}
                          aria-label="Increase quantity"
                        >
                          {'+ »'}
                        </button>
                      </div>

                      {/* Cashback Pill + Item Price */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            backgroundColor: '#FEF9C3',
                            border: '1px solid #FEF08A',
                            color: '#166534',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          ₹{itemCashback} cashback
                        </span>
                        <span
                          style={{
                            fontSize: '0.98rem',
                            fontWeight: '800',
                            color: '#0F172A',
                          }}
                        >
                          ₹ {itemTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Unloading Service Card */}
        <UnloadingServiceCard />

        {/* 5. Bill Details Card */}
        <BillDetailsCard
          subtotal={cartSubtotal}
          discount={discountAmount}
          walletDiscount={0}
          deliveryFee={deliveryFee}
          handlingFee={isUnloadingSelected ? unloadingCharge : 0}
          total={grandTotal}
        />

        {/* 6. Cancellation Policy Card */}
        <CancellationPolicyCard />
      </div>

      {/* 7. Sticky Bottom Action Bar (Exact Reference Match) */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          padding: '10px 16px max(10px, env(safe-area-inset-bottom, 10px)) 16px',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.06)',
          zIndex: 1000,
        }}
      >
        <div style={{ maxWidth: '540px', margin: '0 auto' }}>
          <button
            type="button"
            onClick={() => navigateTo('checkout')}
            style={{
              width: '100%',
              height: '46px',
              backgroundColor: '#15803D',
              color: '#FFFFFF',
              borderRadius: '10px',
              border: 'none',
              fontWeight: '800',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 3px 10px rgba(21, 128, 61, 0.3)',
              transition: 'transform 0.15s ease, opacity 0.15s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span>Proceed to Checkout</span>
            <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>›</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartView;
