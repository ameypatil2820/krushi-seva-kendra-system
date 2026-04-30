import React, { useState } from 'react';
import { Save, ArrowLeft, Plus, Trash2, User, Calendar, FileText, RotateCcw, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewSaleReturn = () => {
  const navigate = useNavigate();
  const [master, setMaster] = useState({
    saleId: '',
    customerId: '',
    returnDate: new Date().toISOString().split('T')[0],
    reason: '',
    totalAmount: 0
  });

  const [items, setItems] = useState([
    { id: Date.now(), productId: '', quantity: 1, rate: 0, amount: 0 }
  ]);

  const handleItemChange = (id, field, value) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        const qty = field === 'quantity' ? parseFloat(value) || 0 : item.quantity;
        const rate = field === 'rate' ? parseFloat(value) || 0 : item.rate;
        updatedItem.amount = qty * rate;
        return updatedItem;
      }
      return item;
    });
    setItems(updatedItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 style={{ color: '#ef4444', margin: 0 }}>New Sale Return</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Process a product return and update inventory</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/sales/returns')}>
          <ArrowLeft size={18} /> Back to List
        </button>
      </div>

      <div className="glass-card" style={{ padding: '25px', marginBottom: '25px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div className="input-group">
            <label><FileText size={14} /> Original Sale ID</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. SALE-101"
              value={master.saleId}
              onChange={(e) => setMaster({...master, saleId: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label><User size={14} /> Customer</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Customer Name/ID"
              value={master.customerId}
              onChange={(e) => setMaster({...master, customerId: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label><Calendar size={14} /> Return Date</label>
            <input 
              type="date" 
              className="input-field"
              value={master.returnDate}
              onChange={(e) => setMaster({...master, returnDate: e.target.value})}
            />
          </div>
        </div>
        <div className="input-group" style={{ marginTop: '20px' }}>
          <label><AlertCircle size={14} /> Reason for Return</label>
          <textarea 
            className="input-field" 
            placeholder="Describe why the product is being returned..."
            value={master.reason}
            onChange={(e) => setMaster({...master, reason: e.target.value})}
            style={{ minHeight: '80px' }}
          ></textarea>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '25px', marginBottom: '25px' }}>
        <h4 style={{ marginBottom: '20px' }}>Returned Items</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px' }}>Product</th>
              <th style={{ padding: '12px' }}>Quantity</th>
              <th style={{ padding: '12px' }}>Rate</th>
              <th style={{ padding: '12px' }}>Amount</th>
              <th style={{ padding: '12px' }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '8px' }}>
                  <input type="text" className="input-field" placeholder="Product Name" value={item.productId} onChange={(e) => handleItemChange(item.id, 'productId', e.target.value)} />
                </td>
                <td style={{ padding: '8px' }}>
                  <input type="number" className="input-field" style={{ width: '80px' }} value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)} />
                </td>
                <td style={{ padding: '8px' }}>
                  <input type="number" className="input-field" style={{ width: '120px' }} value={item.rate} onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)} />
                </td>
                <td style={{ padding: '12px', fontWeight: '600' }}>₹{item.amount.toFixed(2)}</td>
                <td style={{ padding: '8px' }}>
                  <button onClick={() => setItems(items.filter(i => i.id !== item.id))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-secondary" onClick={() => setItems([...items, { id: Date.now(), productId: '', quantity: 1, rate: 0, amount: 0 }])} style={{ marginTop: '15px' }}>
          <Plus size={16} /> Add Product
        </button>

        <div style={{ marginTop: '30px', textAlign: 'right' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '5px' }}>Refund Amount</p>
          <h2 style={{ color: '#ef4444', margin: 0 }}>₹{calculateTotal().toFixed(2)}</h2>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/sales/returns')}>Cancel</button>
        <button className="btn" style={{ background: '#ef4444', color: 'white', padding: '10px 30px' }}>
          <RotateCcw size={18} /> Confirm Return
        </button>
      </div>
    </div>
  );
};

export default NewSaleReturn;
