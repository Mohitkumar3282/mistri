import React from 'react';
import { Truck, Phone, MapPin, CheckCircle2, Clock, ShieldCheck, ArrowLeft, Navigation, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MOCK_ORDERS } from '../data/mockData';
import OrderTimeline from '../components/OrderTimeline';
import { getDeliverySchedule } from '../utils/deliverySchedule';

export const OrderTrackingView = () => {
  const { viewParams, navigateTo, getOrderById, siteSettings } = useStore();
  const orderId = viewParams?.id || viewParams?.orderId || viewParams?.order?.id || 'MST-100245';
  const order = getOrderById(orderId) || MOCK_ORDERS[0];
  const deliveryInfo = getDeliverySchedule(order, siteSettings);

  // The 4-step timeline is driven directly by the admin's order status (set via the
  // dropdown in Admin > Orders), not a separate stored snapshot - so it always reflects
  // where the admin has actually moved the order, live.
  const STATUS_STEP_INDEX = { confirmed: 1, 'out-for-delivery': 2, delivered: 3 };
  const currentStepIndex = order.statusCode === 'cancelled' ? 0 : (STATUS_STEP_INDEX[order.statusCode] ?? 1);
  const steps = [
    { title: 'Order Placed', time: order.date && order.time ? `${order.date}, ${order.time}` : 'Just now', done: true, desc: 'Material order verified & invoice generated' },
    { title: 'Order Confirmed', time: currentStepIndex >= 1 ? 'Confirmed' : 'Pending', done: currentStepIndex >= 1, desc: 'Confirmed by MISTRI Central Logistics Hub' },
    { title: 'Out for Delivery', time: currentStepIndex === 2 ? 'In Progress' : currentStepIndex > 2 ? 'Completed' : 'Pending', done: currentStepIndex >= 2, desc: 'En route to construction site' },
    { title: 'Delivered', time: currentStepIndex >= 3 ? 'Delivered' : 'Pending', done: currentStepIndex >= 3, desc: 'Site delivery & unload verification' },
  ];
  // The one logistics partner the admin set once in Settings, shown the same way on
  // every order, rather than a per-order driver.
  const tracking = {
    currentStep: currentStepIndex + 1,
    steps,
    liveEtaMinutes: order.tracking?.liveEtaMinutes ?? 35,
    driverName: siteSettings.defaultDriverName || '',
    driverPhone: siteSettings.defaultDriverPhone || '',
    vehicleNumber: siteSettings.defaultVehicleNumber || '',
  };

  return (
    <div className="container page-container">
      {/* Back Button */}
      <button
        onClick={() => navigateTo('orders')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--primary-navy)', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer', marginBottom: '1.25rem' }}
      >
        <ArrowLeft size={16} />
        <span>Back to My Orders</span>
      </button>

      {/* Dynamic Delivery Date Notice Banner */}
      <div
        style={{
          backgroundColor: '#EFF6FF',
          border: '1.5px solid #BFDBFE',
          borderRadius: '12px',
          padding: '12px 18px',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: '#DBEAFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1D4ED8',
              flexShrink: 0,
            }}
          >
            <Truck size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.94rem', fontWeight: '800', color: '#1E3A8A' }}>
              Your order will be delivered on {order.deliveryDate || deliveryInfo.deliveryDate}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#3B82F6', fontWeight: '500' }}>
              {deliveryInfo.isAfter8PM
                ? `Night Order · Scheduled for Next Day Delivery (${order.deliveryDate || deliveryInfo.deliveryDate})`
                : deliveryInfo.expressEnabled
                ? `Active express delivery assignment`
                : `Active delivery assignment`}
            </div>
          </div>
        </div>
        <span
          style={{
            backgroundColor: '#DBEAFE',
            color: '#1E40AF',
            fontSize: '0.74rem',
            fontWeight: '800',
            padding: '4px 10px',
            borderRadius: '6px',
          }}
        >
          {order.deliveryDate || deliveryInfo.deliveryDate}
        </span>
      </div>

      {/* Header Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px 12px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary-orange)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Live Consignment Tracking
            </span>
            <span className="badge badge-orange">{order.status}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.65rem)', color: 'var(--primary-navy)', fontWeight: '800' }}>
            Consignment #{order.id}
          </h1>
        </div>

        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Estimated Site Arrival:</div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-orange)' }}>
            {order.expectedDelivery || deliveryInfo.expectedDelivery}
          </div>
        </div>
      </div>

      <div className="responsive-split">
        {/* Left Column: Simulated Live Route Map & Vehicle Status */}
        <div>
          {/* Simulated Map Visualizer */}
          <div
            style={{
              position: 'relative',
              minHeight: '260px',
              backgroundColor: '#0F1E2E',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              marginBottom: '1.25rem',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {/* Grid overlay for map feel */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'linear-gradient(rgba(244, 119, 33, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(244, 119, 33, 0.08) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
                pointerEvents: 'none',
              }}
            />

            {/* Top Map HUD */}
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ backgroundColor: 'rgba(11, 41, 71, 0.85)', padding: '5px 10px', borderRadius: '4px', color: '#FFF1E7', fontSize: '0.75rem', fontWeight: '700', border: '1px solid rgba(244,119,33,0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Navigation size={13} color="#F47721" />
                <span>Super Corridor Expressway (4.2 km away)</span>
              </div>
              <div style={{ backgroundColor: '#10b981', color: '#FFFFFF', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '800' }}>
                ACTIVE DISPATCH
              </div>
            </div>

            {/* Central Animated Route Indicator */}
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 0' }}>
              <div style={{ width: '100%', maxWidth: '380px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Hub Pin */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-navy)', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px auto', color: '#fff' }}>
                    <ShieldCheck size={16} />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '700' }}>Palda Hub</div>
                </div>

                {/* Connecting Track Line */}
                <div style={{ flex: 1, height: '4px', background: 'linear-gradient(90deg, #10b981 0%, #F47721 70%, #64748B 100%)', margin: '0 8px', borderRadius: '2px', position: 'relative' }}>
                  {/* Animated Moving Truck */}
                  <div style={{ position: 'absolute', top: '-13px', left: '62%', width: '30px', height: '30px', borderRadius: '50%', background: 'var(--primary-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 0 10px #F47721' }}>
                    <Truck size={15} />
                  </div>
                </div>

                {/* Destination Site Pin */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F47721', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px auto', color: '#fff' }}>
                    <MapPin size={16} />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#FFF1E7', fontWeight: '700' }}>Site #44B</div>
                </div>
              </div>
            </div>

            {/* Bottom Map Info */}
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', backgroundColor: 'rgba(11, 41, 71, 0.9)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Delivery Vehicle:</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#FFFFFF' }}>{tracking.vehicleNumber}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Site Unload OTP:</div>
                <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--primary-orange)', letterSpacing: '2px' }}>7492</div>
              </div>
            </div>
          </div>

          {/* Driver Contact Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: 'var(--shadow-xs)',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--navy-subtle)', color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1rem' }}>
                {tracking.driverName?.charAt(0) || 'D'}
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Logistics Driver In-Charge</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--primary-navy)' }}>{tracking.driverName}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{tracking.vehicleNumber}</div>
              </div>
            </div>

            <a
              href={`tel:${tracking.driverPhone}`}
              className="btn btn-primary btn-sm mobile-w-full"
              style={{ display: 'inline-flex', gap: '6px', fontWeight: '700', alignItems: 'center' }}
            >
              <Phone size={14} />
              <span>Call Driver</span>
            </a>
          </div>
        </div>

        {/* Right Column: 6-Step Visual Timeline */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.5rem', boxShadow: 'var(--shadow-xs)' }}>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--primary-navy)', fontWeight: '800', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            Consignment Dispatch Timeline
          </h2>

          <OrderTimeline steps={tracking.steps} currentStep={tracking.currentStep} />
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingView;
