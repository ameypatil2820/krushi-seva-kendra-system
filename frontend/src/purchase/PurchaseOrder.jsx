import React, { useState } from 'react';
import { ShoppingBag, Search, Filter, Plus, Calendar, User, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const PurchaseOrder = () => {
  const [orders, setOrders] = useState([
    { id: 'PO-001', supplierId: 'SUP-101', orderDate: '2026-04-20', expiryDate: '2026-05-20', status: 'Pending' },
    { id: 'PO-002', supplierId: 'SUP-102', orderDate: '2026-04-22', expiryDate: '2026-05-22', status: 'Completed' },
    { id: 'PO-003', supplierId: 'SUP-103', orderDate: '2026-04-25', expiryDate: '2026-05-25', status: 'Cancelled' },
  ]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> {status}</span>;
      case 'Pending': return <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {status}</span>;
      case 'Cancelled': return <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {status}</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 style={{ color: 'var(--primary)', margin: 0 }}>Purchase Orders</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage your inventory orders and suppliers</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> New Order
        </button>
      </div>

      <div className="glass-card" style={{ padding: '20px', marginBottom: '25px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
          <input type="text" className="input-field" placeholder="Search orders by ID or Supplier..." style={{ paddingLeft: '40px' }} />
        </div>
        <button className="btn btn-secondary" style={{ width: 'auto' }}>
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.05)', textAlign: 'left' }}>
              <th style={{ padding: '15px 20px' }}>Order ID</th>
              <th style={{ padding: '15px 20px' }}>Supplier ID</th>
              <th style={{ padding: '15px 20px' }}>Order Date</th>
              <th style={{ padding: '15px 20px' }}>Expiry Date</th>
              <th style={{ padding: '15px 20px' }}>Status</th>
              <th style={{ padding: '15px 20px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.3s' }} className="hover-row">
                <td style={{ padding: '15px 20px', fontWeight: '600' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShoppingBag size={16} color="var(--primary)" />
                    {order.id}
                  </div>
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={14} color="var(--text-secondary)" />
                    {order.supplierId}
                  </div>
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} color="var(--text-secondary)" />
                    {order.orderDate}
                  </div>
                </td>
                <td style={{ padding: '15px 20px' }}>{order.expiryDate}</td>
                <td style={{ padding: '15px 20px' }}>{getStatusBadge(order.status)}</td>
                <td style={{ padding: '15px 20px' }}>
                  <button className="btn btn-secondary" style={{ padding: '5px 12px', fontSize: '0.8rem' }}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .hover-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }
      `}</style>
    </div>
  );
};

export default PurchaseOrder;
