import React, { useState } from 'react';
import {
  ChevronLeft,
  CheckCircle2,
  MapPin,
  Trash2,
  Plus,
  Minus,
  Receipt,
  Tag,
  CreditCard,
  Banknote,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Navigation,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import SlideToOrder from '../components/SlideToOrder';
import OnlinePaymentModal from '../components/OnlinePaymentModal';

export const CheckoutView = () => {
  const {
    cart,
    removeFromCart,
    updateCartQty,
    cartSubtotal,
    cartItemCount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    deliveryFee,
    deliveryNote,
    unloadingCharge,
    gstAmount,
    isGstInclusive,
    grandTotal,
    siteSettings,
    addresses,
    placeOrder,
    addToast,
    navigateTo,
    user,
    currentCity,
    currentPincode,
    requireAuth,
    setIsLocationModalOpen,
    fetchCurrentGpsLocation,
    isDetectingLocation,
  } = useStore();

  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0]?.id || 'addr_1');
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' | 'cash'
  const [isCouponsOpen, setIsCouponsOpen] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isPaymentSelectorOpen, setIsPaymentSelectorOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isOrderProcessing, setIsOrderProcessing] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const handleGpsLocationClick = async () => {
    try {
      const gpsAddr = await fetchCurrentGpsLocation();
      if (gpsAddr && gpsAddr.id) {
        setSelectedAddressId(gpsAddr.id);
      }
    } catch (err) {
      console.error('GPS fetch failed in checkout:', err);
    }
  };

  const selectedAddress =
    addresses.find((a) => a.id === selectedAddressId) ||
    addresses[0] || {
      id: 'addr_default',
      title: 'Select Address',
      recipientName: user?.name || 'Site In-Charge',
      phone: user?.phone || '+91 98260 11223',
      addressLine: 'Corporate House, South Tukoganj',
      city: currentCity || 'Indore',
      pincode: currentPincode || '452001',
    };

  const isOnline = paymentMethod === 'online';

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      const res = applyCoupon(couponInput.trim());
      if (!res) {
        setCouponError('Invalid coupon code');
      } else {
        setCouponError('');
        setCouponInput('');
        setIsCouponsOpen(false);
      }
    }
  };

  // Handle Cash Order Placement
  const handleCashOrderSlide = () => {
    requireAuth(async () => {
      setIsOrderProcessing(true);
      try {
        const newOrder = await placeOrder({
          paymentMethod: 'Cash on Delivery (Pay on Site)',
          siteAddress: selectedAddress,
          unloadingNotes: 'Direct site delivery',
        });
        setIsOrderProcessing(false);
        setIsOrderSuccess(true);
        setTimeout(() => {
          navigateTo('order-confirmation', { order: newOrder });
        }, 600);
      } catch (err) {
        // placeOrder already told the customer why; let them try again.
        setIsOrderProcessing(false);
      }
    });
  };

  // Handle Online Slide to Pay
  const handleOnlineOrderSlide = () => {
    requireAuth(() => {
      setIsPaymentModalOpen(true);
    });
  };

  // Callback when Online Payment Gateway authorizes transaction
  // Called once Razorpay reports the payment. The server confirms the payment with
  // Razorpay before it accepts the order.
  const handleOnlinePaymentSuccess = async (paymentDetails) => {
    setIsPaymentModalOpen(false);
    setIsOrderProcessing(true);
    try {
      const newOrder = await placeOrder({
        paymentMethod: paymentDetails.paymentMethod || 'Online Payment (UPI/Card)',
        razorpayOrderId: paymentDetails.razorpayOrderId,
        razorpayPaymentId: paymentDetails.razorpayPaymentId,
        razorpaySignature: paymentDetails.razorpaySignature,
        siteAddress: selectedAddress,
        unloadingNotes: 'Direct site delivery',
      });
      setIsOrderProcessing(false);
      setIsOrderSuccess(true);
      navigateTo('order-confirmation', { order: newOrder });
    } catch (err) {
      setIsOrderProcessing(false);
      // Money may have left the customer's account, so give them the reference.
      if (paymentDetails.razorpayPaymentId) {
        addToast(
          `If you were charged, contact support with payment ID ${paymentDetails.razorpayPaymentId}.`,
          'warning',
          12000
        );
      }
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '2rem 16px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#0F172A', fontWeight: '800', marginBottom: '1rem' }}>
          Your cart is empty
        </h2>
        <button
          onClick={() => navigateTo('home')}
          style={{
            backgroundColor: '#E11D48',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 20px',
            fontSize: '0.9rem',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          Return to Store
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '110px' }}>
      {/* 1. Clean Top Header: Back Button + Title + Subtitle + Secure Badge */}
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
            onClick={() => navigateTo('cart')}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '0.75rem', fontWeight: '700' }}>
          <ShieldCheck size={18} />
          <span>100% Secure</span>
        </div>
      </div>

      {/* Main Checkout Container */}
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
        {/* 2. Delivery Address Card (Exact Reference Image Match) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            padding: '16px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
          }}
        >
          {/* Top Header Action */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.78rem',
              color: '#64748B',
              marginBottom: '12px',
            }}
          >
            <span>Ordering for someone else?</span>
            <span
              onClick={() => setIsLocationModalOpen(true)}
              style={{ color: '#E11D48', fontWeight: '700', cursor: 'pointer' }}
            >
              Add details
            </span>
          </div>

          <div
            style={{
              fontSize: '0.95rem',
              fontWeight: '800',
              color: '#0F172A',
              marginBottom: '12px',
            }}
          >
            Delivery address
          </div>

          {/* Selected Address Box (Red/Rose Pill Border Matching Reference Image 3) */}
          <div
            style={{
              border: '1.5px solid #FECDD3',
              backgroundColor: '#FFF5F5',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
            }}
          >
            <div style={{ color: '#E11D48', marginTop: '2px', flexShrink: 0 }}>
              <CheckCircle2 size={18} fill="#FFE4E6" color="#E11D48" />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: '800', fontSize: '0.88rem', color: '#0F172A' }}>
                  {selectedAddress.title || 'Select Address'}
                </span>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(true)}
                    style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 0 }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(true)}
                    style={{ background: 'none', border: 'none', color: '#E11D48', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                  >
                    Change
                  </button>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
                {selectedAddress.recipientName && <span>{selectedAddress.recipientName}, </span>}
                {selectedAddress.addressLine}, {selectedAddress.city} - {selectedAddress.pincode}
              </div>
            </div>
          </div>

          {/* Use Current Location Button with Automatic GPS Fetching */}
          <button
            type="button"
            onClick={handleGpsLocationClick}
            disabled={isDetectingLocation}
            style={{
              width: '100%',
              marginTop: '12px',
              padding: '10px 14px',
              backgroundColor: isDetectingLocation ? '#FFF5F5' : '#FFFFFF',
              border: `1.5px dashed ${isDetectingLocation ? '#E11D48' : '#CBD5E1'}`,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.84rem',
              fontWeight: '700',
              color: isDetectingLocation ? '#E11D48' : '#334155',
              cursor: isDetectingLocation ? 'wait' : 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {isDetectingLocation ? (
              <>
                <span
                  style={{
                    width: '14px',
                    height: '14px',
                    border: '2px solid #E11D48',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                <span>Detecting GPS satellite location...</span>
              </>
            ) : (
              <>
                <Navigation size={15} color="#E11D48" />
                <span>Use current location (from GPS)</span>
              </>
            )}
          </button>
        </div>

        {/* 3. Your Items Summary Card (Exact Reference Image 3 Match) */}
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map((item, idx) => {
              const itemTotal = (item.price || 0) * item.quantity;
              const isLast = idx === cart.length - 1;

              return (
                <div
                  key={item.product.id}
                  style={{
                    paddingBottom: isLast ? 0 : '16px',
                    borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '8px',
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
                        style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.86rem', fontWeight: '700', color: '#0F172A', margin: '0 0 4px 0', lineHeight: 1.3 }}>
                        {item.product.name}
                      </h4>

                      <div style={{ marginBottom: '4px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            backgroundColor: '#FFE4E6',
                            color: '#E11D48',
                            fontSize: '0.68rem',
                            fontWeight: '800',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                          }}
                        >
                          VARIANT {item.variant || item.product.unit || 'Standard'}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '500' }}>
                        ₹{(item.price || 0).toLocaleString('en-IN')} each
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        border: '1.5px solid #E11D48',
                        borderRadius: '8px',
                        height: '30px',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                        style={{ width: '28px', height: '28px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E11D48' }}
                      >
                        {item.quantity === 1 ? <Trash2 size={13} color="#E11D48" /> : <Minus size={13} color="#E11D48" strokeWidth={2.5} />}
                      </button>
                      <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: '800', fontSize: '0.84rem', color: '#E11D48' }}>
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                        style={{ width: '28px', height: '28px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E11D48' }}
                      >
                        <Plus size={13} color="#E11D48" strokeWidth={2.5} />
                      </button>
                    </div>

                    <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A' }}>
                      ₹{itemTotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Order Summary Card (Exact Reference Image 3 & 4 Match) */}
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
            <span>Order summary</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>Item total</span>
              <span style={{ fontWeight: '600', color: '#0F172A' }}>₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>Delivery</span>
                {siteSettings?.deliveryType === 'km_based' && (
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    ({siteSettings?.estimatedDeliveryKm || 5} km)
                  </span>
                )}
              </div>
              {deliveryFee === 0 ? (
                <span style={{ fontWeight: '700', color: '#10B981' }}>FREE</span>
              ) : (
                <span style={{ fontWeight: '700', color: '#0F172A' }}>₹{deliveryFee.toLocaleString('en-IN')}</span>
              )}
            </div>

            {siteSettings?.enableUnloadingFee && unloadingCharge > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Site Unloading & Crane Handling</span>
                <span style={{ fontWeight: '600', color: '#0F172A' }}>₹{unloadingCharge.toLocaleString('en-IN')}</span>
              </div>
            )}

            {gstAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>
                  Estimated GST ({siteSettings?.gstRatePercent || 18}% {isGstInclusive ? 'Included' : 'ITC Benefit'})
                </span>
                <span style={{ fontWeight: '600', color: '#0F172A' }}>
                  {isGstInclusive ? `(₹${gstAmount.toLocaleString('en-IN')})` : `₹${gstAmount.toLocaleString('en-IN')}`}
                </span>
              </div>
            )}

            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E11D48' }}>
                <span>Contractor Coupon / Rebate</span>
                <span style={{ fontWeight: '700' }}>-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            {/* Coupons Dropdown Row (Exact Reference Match) */}
            <div
              onClick={() => setIsCouponsOpen(!isCouponsOpen)}
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                padding: '10px 12px',
                cursor: 'pointer',
                marginTop: '4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#FFE4E6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E11D48' }}>
                    <Tag size={15} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.84rem', color: '#0F172A' }}>
                      Coupons
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                      {appliedCoupon ? `Applied: ${appliedCoupon.code} (${appliedCoupon.discountPercentage}% OFF)` : 'No manual coupons'}
                    </div>
                  </div>
                </div>

                <div style={{ color: '#64748B' }}>
                  {isCouponsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {isCouponsOpen && (
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #E2E8F0' }} onClick={(e) => e.stopPropagation()}>
                  {appliedCoupon ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: '#E11D48', fontWeight: '700' }}>
                        '{appliedCoupon.code}' Active
                      </span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        style={{ background: 'none', border: 'none', color: '#E11D48', fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="ENTER COUPON CODE"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        style={{
                          flex: 1,
                          height: '36px',
                          borderRadius: '6px',
                          border: '1px solid #CBD5E1',
                          padding: '0 10px',
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          fontWeight: '700',
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          backgroundColor: '#0F172A',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0 14px',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && (
                    <div style={{ color: '#E11D48', fontSize: '0.74rem', marginTop: '4px' }}>
                      {couponError}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment Method Selector Row (Exact Reference Match) */}
            <div
              onClick={() => setIsPaymentSelectorOpen(!isPaymentSelectorOpen)}
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                padding: '10px 12px',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#FFE4E6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E11D48' }}>
                    <CreditCard size={15} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.84rem', color: '#0F172A' }}>
                      Payment
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                      {isOnline ? 'Pay Online (UPI/Card)' : 'Cash on Delivery (Pay on Site)'}
                    </div>
                  </div>
                </div>

                <div style={{ color: '#64748B' }}>
                  {isPaymentSelectorOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {isPaymentSelectorOpen && (
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      padding: '6px',
                      borderRadius: '6px',
                      backgroundColor: isOnline ? '#FFF5F5' : 'transparent',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={isOnline}
                      onChange={() => setPaymentMethod('online')}
                      style={{ accentColor: '#E11D48' }}
                    />
                    <span style={{ fontWeight: isOnline ? '800' : '500', color: '#0F172A' }}>
                      💳 Pay Online (UPI / Credit & Debit Cards / NetBanking)
                    </span>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      padding: '6px',
                      borderRadius: '6px',
                      backgroundColor: !isOnline ? '#FFF5F5' : 'transparent',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={!isOnline}
                      onChange={() => setPaymentMethod('cash')}
                      style={{ accentColor: '#E11D48' }}
                    />
                    <span style={{ fontWeight: !isOnline ? '800' : '500', color: '#0F172A' }}>
                      💵 Cash on Delivery (Pay upon material delivery at site)
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ borderTop: '1px solid #F1F5F9', margin: '4px 0' }} />

            {/* To Pay Amount */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '2px',
              }}
            >
              <span style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A' }}>
                To pay
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A' }}>
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Guest OTP notice (Matching Reference Image 4) */}
            {!user && (
              <div
                style={{
                  backgroundColor: '#FFF1F2',
                  border: '1px solid #FFE4E6',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  textAlign: 'center',
                  fontSize: '0.78rem',
                  color: '#9F1239',
                  fontWeight: '600',
                  marginTop: '6px',
                }}
              >
                OTP login when you slide to pay — browse as guest until then.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Sticky Bottom Action Bar: SLIDE TO PAY (Compact Mobile-Responsive) */}
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
          <SlideToOrder
            paymentMethod={paymentMethod}
            amount={grandTotal}
            isLoading={isOrderProcessing}
            isSuccess={isOrderSuccess}
            onSlideComplete={isOnline ? handleOnlineOrderSlide : handleCashOrderSlide}
          />
        </div>
      </div>

      {/* Address Selection Modal */}
      {isAddressModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setIsAddressModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '540px',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              padding: '20px',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                Select Delivery Address
              </h3>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => {
                    setSelectedAddressId(addr.id);
                    setIsAddressModalOpen(false);
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: `1.5px solid ${selectedAddressId === addr.id ? '#E11D48' : '#E2E8F0'}`,
                    backgroundColor: selectedAddressId === addr.id ? '#FFF5F5' : '#FFFFFF',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '800', fontSize: '0.88rem', color: '#0F172A' }}>
                      {addr.title}
                    </span>
                    {selectedAddressId === addr.id && (
                      <span style={{ color: '#E11D48', fontSize: '0.75rem', fontWeight: '800' }}>Active</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    {addr.recipientName && <span>{addr.recipientName} • {addr.phone}<br /></span>}
                    {addr.addressLine}, {addr.city} - {addr.pincode}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsAddressModalOpen(false);
                setIsLocationModalOpen(true);
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                borderRadius: '10px',
                border: 'none',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              + Add / Change City or Location
            </button>
          </div>
        </div>
      )}

      {/* Online Payment Modal */}
      <OnlinePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={grandTotal}
        customer={user}
        orderItems={cart}
        couponCode={appliedCoupon?.code || null}
        summary={{
          subtotal: cartSubtotal,
          gstAmount: gstAmount,
          discountAmount: discountAmount,
          grandTotal: grandTotal,
        }}
        onPaymentSuccess={handleOnlinePaymentSuccess}
      />
    </div>
  );
};

export default CheckoutView;
