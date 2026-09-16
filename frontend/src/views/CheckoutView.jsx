import React, { useState } from 'react';
import {
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  Building,
  Calendar,
  Clock,
  ShieldCheck,
  ArrowRight,
  Plus,
  Phone,
  User,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CheckoutView = () => {
  const {
    cart,
    cartSubtotal,
    discountAmount,
    unloadingCharge,
    gstAmount,
    grandTotal,
    addresses,
    placeOrder,
    navigateTo,
    user,
    requireAuth,
    openLoginModal,
  } = useStore();

  const [activeStep, setActiveStep] = useState(1); // 1: Address, 2: Delivery, 3: Payment, 4: Review
  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0]?.id || 'addr_1');
  const [deliverySlot, setDeliverySlot] = useState('Express Morning (08:00 AM - 12:00 PM)');
  const [siteVehicleAccess, setSiteVehicleAccess] = useState('Heavy 10-Wheeler Truck Access');
  const [paymentMethod, setPaymentMethod] = useState('UPI Instant Transfer (GPay / PhonePe / Paytm)');
  const [unloadingNotes, setUnloadingNotes] = useState('Contact Site In-Charge 30 mins prior to arrival.');

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handlePlaceOrder = () => {
    requireAuth(() => {
      const orderData = {
        siteAddress: selectedAddress,
        deliverySlot,
        paymentMethod,
        unloadingNotes,
      };

      const newOrder = placeOrder(orderData);
      navigateTo('order-confirmation', { order: newOrder });
    });
  };

  return (
    <div className="container page-container">
      {/* Guest Checkout Notice */}
      {!user && (
        <div
          style={{
            maxWidth: '820px',
            margin: '0 auto 1.5rem auto',
            backgroundColor: '#EFF8FF',
            border: '1.5px solid #B2DDFF',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#D1E9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#175CD3', flexShrink: 0 }}>
              <User size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#175CD3' }}>
                Ordering as a Guest Builder
              </div>
              <div style={{ fontSize: '0.78rem', color: '#475467' }}>
                Sign in or register to save your site delivery address, get contractor credits & download GST tax invoices.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openLoginModal('login')}
            className="btn btn-navy btn-sm"
            style={{ fontWeight: '800', whiteSpace: 'nowrap' }}
          >
            Sign In / Register
          </button>
        </div>
      )}

      {/* Checkout Steps Progress Bar */}
      <div style={{ maxWidth: '820px', margin: '0 auto 2rem auto' }}>
        <div className="tab-scroll-container" style={{ paddingBottom: '4px' }}>
          {[
            { num: 1, title: '1. Site Address' },
            { num: 2, title: '2. Delivery Slot' },
            { num: 3, title: '3. Payment Mode' },
            { num: 4, title: '4. Order Review' },
          ].map((step) => {
            const isCompleted = activeStep > step.num;
            const isCurrent = activeStep === step.num;

            return (
              <div
                key={step.num}
                onClick={() => isCompleted && setActiveStep(step.num)}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  textAlign: 'center',
                  padding: '9px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isCurrent ? 'var(--primary-navy)' : isCompleted ? 'var(--light-orange)' : 'var(--bg-surface)',
                  color: isCurrent ? '#FFFFFF' : isCompleted ? 'var(--primary-orange)' : 'var(--text-muted)',
                  fontWeight: '700',
                  fontSize: '0.825rem',
                  cursor: isCompleted ? 'pointer' : 'default',
                  border: isCurrent ? '2px solid var(--primary-orange)' : '1px solid var(--border-subtle)',
                  whiteSpace: 'nowrap',
                }}
              >
                {step.title}
              </div>
            );
          })}
        </div>
      </div>

      <div className="responsive-split">
        {/* Left Column: Active Step Interactive Form */}
        <div>
          {/* STEP 1: Address Selection */}
          {activeStep === 1 && (
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <h2 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)' }}>
                  1. Select Construction Delivery Site
                </h2>
                <button
                  type="button"
                  onClick={() => navigateTo('addresses')}
                  className="btn btn-outline-orange btn-sm"
                  style={{ display: 'flex', gap: '4px' }}
                >
                  <Plus size={14} />
                  <span>Add New Site</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-sm)',
                        border: `2px solid ${isSelected ? 'var(--primary-orange)' : 'var(--border-subtle)'}`,
                        backgroundColor: isSelected ? 'var(--light-orange)' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                      }}
                    >
                      <input
                        type="radio"
                        name="delivery_address"
                        checked={isSelected}
                        onChange={() => setSelectedAddressId(addr.id)}
                        style={{ accentColor: 'var(--primary-orange)', marginTop: '4px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--primary-navy)' }}>
                            {addr.title}
                          </span>
                          <span className="badge badge-navy">{addr.type}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                          <strong>In-charge:</strong> {addr.recipientName} • <strong>Phone:</strong> {addr.phone}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                          {addr.addressLine}, {addr.city} - {addr.pincode}
                        </div>
                        {addr.unloadingNotes && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            <strong>Unloading Note:</strong> {addr.unloadingNotes}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="btn btn-primary btn-lg btn-block"
                style={{ fontWeight: '800' }}
              >
                Continue to Delivery Schedule
              </button>
            </div>
          )}

          {/* STEP 2: Delivery Schedule & Site Vehicle Access */}
          {activeStep === 2 && (
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.75rem', boxShadow: 'var(--shadow-xs)' }}>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                2. Site Delivery Slot & Vehicle Access
              </h2>

              {/* Delivery Slots */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ marginBottom: '0.6rem' }}>Select Desired Delivery Slot</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    'Express Morning (08:00 AM - 12:00 PM) - Recommended for Slab Casting',
                    'Standard Afternoon (01:00 PM - 05:00 PM)',
                    'Evening Off-Peak (06:00 PM - 09:00 PM) - Heavy City Bypass Entry',
                  ].map((slot) => (
                    <label
                      key={slot}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: `1.5px solid ${deliverySlot === slot ? 'var(--primary-orange)' : 'var(--border-subtle)'}`,
                        backgroundColor: deliverySlot === slot ? 'var(--light-orange)' : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: deliverySlot === slot ? '700' : '500',
                      }}
                    >
                      <input
                        type="radio"
                        name="slot"
                        checked={deliverySlot === slot}
                        onChange={() => setDeliverySlot(slot)}
                        style={{ accentColor: 'var(--primary-orange)' }}
                      />
                      <span>{slot}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Vehicle Entry Type */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ marginBottom: '0.6rem' }}>Site Access & Unloading Vehicle Requirement</label>
                <select
                  className="form-control"
                  value={siteVehicleAccess}
                  onChange={(e) => setSiteVehicleAccess(e.target.value)}
                >
                  <option value="Heavy 10-Wheeler Truck Access">Heavy 10-Wheeler Dumper / Trailer Access (Wide Road)</option>
                  <option value="Mini Truck / Eicher (Narrow Lane)">Mini Truck / Eicher Pro (Narrow Residential Street)</option>
                  <option value="Crane-Assisted Mechanical Unload">Hydraulic Crane-Assisted Unload for TMT Steel Bundles</option>
                </select>
              </div>

              {/* Driver Unloading Instructions */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Gate Pass / Driver Instructions (Optional)</label>
                <textarea
                  rows={2}
                  className="form-control"
                  placeholder="e.g. Call gate supervisor upon arrival at MR-10 pillar 82..."
                  value={unloadingNotes}
                  onChange={(e) => setUnloadingNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="btn btn-primary btn-lg"
                  style={{ flex: 2, fontWeight: '800' }}
                >
                  Continue to Payment Mode
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method UI (Mock) */}
          {activeStep === 3 && (
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.75rem', boxShadow: 'var(--shadow-xs)' }}>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                3. Choose Payment Mode
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
                {[
                  { id: 'upi', title: 'UPI Instant Transfer (GPay / PhonePe / Paytm / BHIM)', desc: 'Zero surcharge. Instant payment verification.' },
                  { id: 'rtgs', title: 'Bank RTGS / NEFT / IMPS', desc: 'Ideal for large contractor orders above ₹1,00,000.' },
                  { id: 'card', title: 'Commercial Credit / Debit Card', desc: 'Visa, MasterCard, RuPay Corporate Cards accepted.' },
                  { id: 'cod', title: 'Pay on Site Unloading', desc: 'Pay by cash or on-spot UPI QR upon material verification.' },
                ].map((mode) => (
                  <label
                    key={mode.id}
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1.5px solid ${paymentMethod.includes(mode.title.split(' ')[0]) ? 'var(--primary-orange)' : 'var(--border-subtle)'}`,
                      backgroundColor: paymentMethod.includes(mode.title.split(' ')[0]) ? 'var(--light-orange)' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod.includes(mode.title.split(' ')[0])}
                      onChange={() => setPaymentMethod(mode.title)}
                      style={{ accentColor: 'var(--primary-orange)', marginTop: '3px' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.925rem', fontWeight: '700', color: 'var(--primary-navy)' }}>
                        {mode.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {mode.desc}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="btn btn-primary btn-lg"
                  style={{ flex: 2, fontWeight: '800' }}
                >
                  Review Order Details
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Final Confirmation */}
          {activeStep === 4 && (
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.75rem', boxShadow: 'var(--shadow-xs)' }}>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                4. Final Order Verification
              </h2>

              {/* Delivery Summary */}
              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--primary-navy)', marginBottom: '6px' }}>
                  Delivery Site Destination:
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {selectedAddress.title} — {selectedAddress.addressLine}, {selectedAddress.city} - {selectedAddress.pincode}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <strong>Site In-charge:</strong> {selectedAddress.recipientName} ({selectedAddress.phone})
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary-orange)', fontWeight: '600', marginTop: '6px' }}>
                  🚚 Slot: {deliverySlot}
                </div>
              </div>

              {/* Payment Summary */}
              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--primary-navy)', marginBottom: '4px' }}>
                  Payment Method:
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                  {paymentMethod}
                </div>
              </div>

              {/* Place Order CTA */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="btn btn-primary btn-lg"
                  style={{ flex: 2, fontWeight: '800' }}
                >
                  Confirm & Place Order (₹{grandTotal.toLocaleString()})
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Mini Cart Summary */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.5rem', boxShadow: 'var(--shadow-xs)' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy)', fontWeight: '800', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            Summary of Materials
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', maxHeight: '240px', overflowY: 'auto' }}>
            {cart.map((item) => (
              <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <div style={{ maxWidth: '65%' }}>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.product.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.quantity} x ₹{item.price.toLocaleString()}</div>
                </div>
                <div style={{ fontWeight: '700', color: 'var(--primary-navy)' }}>
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal:</span>
              <span>₹{cartSubtotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary-orange)', fontWeight: '700' }}>
                <span>Rebate:</span>
                <span>- ₹{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Unloading & Crane:</span>
              <span>{unloadingCharge === 0 ? 'FREE' : `₹${unloadingCharge}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>GST 18%:</span>
              <span>₹{gstAmount.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '0.75rem', borderTop: '2px solid var(--border-subtle)', marginTop: '0.5rem' }}>
              <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--primary-navy)' }}>Grand Total:</span>
              <span style={{ fontWeight: '800', fontSize: '1.4rem', color: 'var(--primary-orange)' }}>₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;
