import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useStore();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxWidth: '380px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            pointerEvents: 'auto',
            background: toast.type === 'danger' ? '#FEF3F2' : toast.type === 'info' ? '#F0F9FF' : '#FFFFFF',
            border: `1.5px solid ${toast.type === 'danger' ? '#FDA29B' : toast.type === 'info' ? '#B2DDFF' : '#F47721'}`,
            boxShadow: '0 10px 25px -5px rgba(11, 41, 71, 0.15)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {toast.type === 'danger' ? (
            <AlertCircle size={20} color="#D92D20" />
          ) : toast.type === 'info' ? (
            <Info size={20} color="#026AA2" />
          ) : (
            <CheckCircle2 size={20} color="#F47721" />
          )}

          <div style={{ flex: 1, fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
            {toast.message}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '2px',
            }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
