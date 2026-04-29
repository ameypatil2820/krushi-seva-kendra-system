import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ background: '#fee2e2', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <FiAlertTriangle size={32} color="#ef4444" />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>{title}</h2>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>{message}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-agro btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn-agro btn-primary" style={{ flex: 1, background: '#ef4444' }} onClick={onConfirm}>Delete Now</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
