import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Search, AlertCircle, Calendar, User, FileText, IndianRupee } from 'lucide-react';

const PurchaseReturn = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [returns, setReturns] = useState([
    { id: 'RET-001', purchaseId: 'PUR-501', supplierId: 'SUP-101', returnDate: '2026-04-28', totalAmount: 1200.50, reason: 'Damaged Products' },
    { id: 'RET-002', purchaseId: 'PUR-505', supplierId: 'SUP-105', returnDate: '2026-04-29', totalAmount: 850.00, reason: 'Expired Stock' },
  ]);

  const filteredReturns = returns.filter(r => 
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.purchaseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.supplierId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 style={{ color: '#ef4444', margin: 0 }}>Purchase Returns</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Record and manage returned items to suppliers</p>
        </div>
        <button 
          className="btn" 
          style={{ background: '#ef4444', color: 'white' }}
          onClick={() => navigate('/purchase/returns/new')}
        >
          <RotateCcw size={18} /> Process Return
        </button>
      </div>

      <div className="glass-card" style={{ padding: '20px', marginBottom: '25px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
          <input 
            type="text" 
            className="input-field" 
            placeholder="Search returns by ID, Purchase ID or Supplier..." 
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
              <th style={{ padding: '15px 20px' }}>Purchase ID</th>
              <th style={{ padding: '15px 20px' }}>Supplier</th>
              <th style={{ padding: '15px 20px' }}>Date</th>
              <th style={{ padding: '15px 20px' }}>Total Amount</th>
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
                    {item.purchaseId}
                  </div>
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={14} color="var(--text-secondary)" />
                    {item.supplierId}
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
                  <button className="btn btn-secondary" onClick={() => navigate(`/purchase/returns/view/${item.id}`)} style={{ padding: '5px 12px', fontSize: '0.8rem' }}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseReturn;
