import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Filter, Plus, Calendar, User, CheckCircle, Clock, AlertCircle, IndianRupee } from 'lucide-react';

const Quotation = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [quotations, setQuotations] = useState([
    { id: 'QTN-201', customerId: 'CUS-501', date: '2026-04-20', totalAmount: 5400.00, status: 'Pending' },
    { id: 'QTN-202', customerId: 'CUS-502', date: '2026-04-22', totalAmount: 12450.50, status: 'Accepted' },
    { id: 'QTN-203', customerId: 'CUS-503', date: '2026-04-25', totalAmount: 8900.00, status: 'Expired' },
  ]);

  const filteredQuotations = quotations.filter(q => {
    const matchesSearch = q.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         q.customerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted': return <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> {status}</span>;
      case 'Pending': return <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {status}</span>;
      case 'Expired': return <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {status}</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 style={{ color: '#8b5cf6', margin: 0 }}>Sales Quotations</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Create and manage price quotes for customers</p>
        </div>
        <button 
          className="btn" 
          style={{ background: '#8b5cf6', color: 'white' }}
          onClick={() => navigate('/sales/quotations/new')}
        >
          <Plus size={18} /> New Quotation
        </button>
      </div>

      <div className="glass-card" style={{ padding: '20px', marginBottom: '25px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
          <input 
            type="text" 
            className="input-field" 
            placeholder="Search by Qtn ID or Customer ID..." 
            style={{ paddingLeft: '40px' }} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={18} color="var(--text-secondary)" />
          <select 
            className="input-field" 
            style={{ width: '150px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.05)', textAlign: 'left' }}>
              <th style={{ padding: '15px 20px' }}>Qtn ID</th>
              <th style={{ padding: '15px 20px' }}>Customer ID</th>
              <th style={{ padding: '15px 20px' }}>Date</th>
              <th style={{ padding: '15px 20px' }}>Total Amount</th>
              <th style={{ padding: '15px 20px' }}>Status</th>
              <th style={{ padding: '15px 20px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotations.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '15px 20px', fontWeight: '600' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={16} color="#8b5cf6" />
                    {item.id}
                  </div>
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={14} color="var(--text-secondary)" />
                    {item.customerId}
                  </div>
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} color="var(--text-secondary)" />
                    {item.date}
                  </div>
                </td>
                <td style={{ padding: '15px 20px', fontWeight: '700' }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <IndianRupee size={14} /> {item.totalAmount.toFixed(2)}
                  </span>
                </td>
                <td style={{ padding: '15px 20px' }}>{getStatusBadge(item.status)}</td>
                <td style={{ padding: '15px 20px' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '5px 12px', fontSize: '0.8rem' }}
                    onClick={() => navigate('/sales/entry', { state: { quotationData: item } })}
                  >
                    Convert to Bill
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Quotation;
