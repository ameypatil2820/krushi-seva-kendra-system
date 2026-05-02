import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Plus, Calendar, User, IndianRupee, CheckCircle, Clock, FileText } from 'lucide-react';

const initialBills = [
  { id: 'SALE-101', customerId: 'CUS-501', customerName: 'Ramesh Patil', billDate: '2026-04-20', grandTotal: 5400.00, paidAmount: 5400.00, dueAmount: 0, paymentType: 'Cash', status: 'Paid' },
  { id: 'SALE-102', customerId: 'CUS-502', customerName: 'Suresh Deshmukh', billDate: '2026-04-22', grandTotal: 12450.50, paidAmount: 8000, dueAmount: 4450.50, paymentType: 'UPI', status: 'Partial' },
  { id: 'SALE-103', customerId: 'CUS-503', customerName: 'Anil Jadhav', billDate: '2026-04-25', grandTotal: 8900.00, paidAmount: 0, dueAmount: 8900.00, paymentType: 'Credit', status: 'Unpaid' },
];

const SaleBill = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredBills = initialBills.filter(b => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':    return <span className="badge badge-success"  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> Paid</span>;
      case 'Partial': return <span className="badge badge-warning"  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> Partial</span>;
      case 'Unpaid':  return <span className="badge badge-danger"   style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> Unpaid</span>;
      default:        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="animate-fade">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 style={{ color: 'var(--primary)', margin: 0 }}>Sale Bills</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>View and manage all customer sale bills</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/sales/entry')}
        >
          <Plus size={18} /> New Sale Bill
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '25px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
          <input
            type="text"
            className="input-field"
            placeholder="Search by Bill ID or Customer..."
            style={{ paddingLeft: '40px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="input-field"
          style={{ width: '160px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
              <th style={{ padding: '15px 20px' }}>Bill ID</th>
              <th style={{ padding: '15px 20px' }}>Customer</th>
              <th style={{ padding: '15px 20px' }}>Date</th>
              <th style={{ padding: '15px 20px' }}>Grand Total</th>
              <th style={{ padding: '15px 20px' }}>Paid</th>
              <th style={{ padding: '15px 20px' }}>Due</th>
              <th style={{ padding: '15px 20px' }}>Payment</th>
              <th style={{ padding: '15px 20px' }}>Status</th>
              <th style={{ padding: '15px 20px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill) => (
              <tr key={bill.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '15px 20px', fontWeight: '600' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={16} color="var(--primary)" />
                    {bill.id}
                  </div>
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <div style={{ fontWeight: '600' }}>{bill.customerName}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{bill.customerId}</div>
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} color="var(--text-secondary)" />
                    {bill.billDate}
                  </div>
                </td>
                <td style={{ padding: '15px 20px', fontWeight: '700' }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <IndianRupee size={14} /> {bill.grandTotal.toFixed(2)}
                  </span>
                </td>
                <td style={{ padding: '15px 20px', color: '#10b981', fontWeight: '600' }}>
                  ₹{bill.paidAmount.toFixed(2)}
                </td>
                <td style={{ padding: '15px 20px', color: bill.dueAmount > 0 ? '#ef4444' : '#6b7280', fontWeight: '600' }}>
                  ₹{bill.dueAmount.toFixed(2)}
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <span style={{ background: 'rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: '6px', fontSize: '13px' }}>
                    {bill.paymentType}
                  </span>
                </td>
                <td style={{ padding: '15px 20px' }}>{getStatusBadge(bill.status)}</td>
                <td style={{ padding: '15px 20px' }}>
                  <button className="btn btn-secondary" onClick={() => navigate(`/sales/bills/view/${bill.id}`)} style={{ padding: '5px 12px', fontSize: '0.8rem' }}>View</button>
                </td>
              </tr>
            ))}
            {filteredBills.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  No bills found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SaleBill;
