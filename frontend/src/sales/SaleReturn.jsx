import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Search, AlertCircle, Calendar, User, FileText, IndianRupee } from 'lucide-react';

const SaleReturn = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [returns, setReturns] = useState([
    { id: 'SRET-001', saleId: 'SALE-501', customerId: 'CUS-101', returnDate: '2026-04-28', totalAmount: 450.00, reason: 'Incorrect Product' },
    { id: 'SRET-002', saleId: 'SALE-505', customerId: 'CUS-105', returnDate: '2026-04-29', totalAmount: 120.00, reason: 'Defective Item' },
  ]);

  const filteredReturns = returns.filter(r => 
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.saleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.customerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 style={{ color: '#ef4444', margin: 0 }}>Sales Returns</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage customer returns and refunds</p>
        </div>
        <button 
          className="btn" 
          style={{ background: '#ef4444', color: 'white' }}
          onClick={() => navigate('/sales/returns/new')}
        >
          <RotateCcw size={18} /> New Sale Return
        </button>
      </div>

      <div className="glass-card" style={{ padding: '20px', marginBottom: '25px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
          <input 
            type="text" 
            className="input-field" 
            placeholder="Search by Return ID, Sale ID or Customer..." 
            style={{ paddingLeft: '40px' }} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.05)', textAlign: 'left' }}>
              <th style={{ padding: '15px 20px' }}>Return ID</th>
              <th style={{ padding: '15px 20px' }}>Sale ID</th>
              <th style={{ padding: '15px 20px' }}>Customer</th>
              <th style={{ padding: '15px 20px' }}>Date</th>
              <th style={{ padding: '15px 20px' }}>Amount</th>
              <th style={{ padding: '15px 20px' }}>Reason</th>
              <th style={{ padding: '15px 20px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReturns.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '15px 20px', fontWeight: '600', color: '#ef4444' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <RotateCcw size={16} />
                    {item.id}
                  </div>
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={14} color="var(--text-secondary)" />
                    {item.saleId}
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
                    {item.returnDate}
                  </div>
                </td>
                <td style={{ padding: '15px 20px', fontWeight: '700' }}>
                   <span style={{ display: 'flex', alignItems: 'center' }}>
                     <IndianRupee size={14} /> {item.totalAmount.toFixed(2)}
                   </span>
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <AlertCircle size={14} color="#f59e0b" />
                    {item.reason}
                  </span>
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <button className="btn btn-secondary" onClick={() => navigate(`/sales/returns/view/${item.id}`)} style={{ padding: '5px 12px', fontSize: '0.8rem' }}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SaleReturn;
