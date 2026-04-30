import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Plus, Trash2, Truck, Calendar, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MockService } from '../mastermodel/services/MockService';

const NewPurchaseOrder = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [master, setMaster] = useState({
    supplierId: '',
    orderDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    status: 'Pending'
  });

  useEffect(() => {
    MockService.getAll('suppliers').then(data => setSuppliers(data));
  }, []);

  const [items, setItems] = useState([
    { id: Date.now(), productId: '', quantity: 1, expectedPrice: 0 }
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), productId: '', quantity: 1, expectedPrice: 0 }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id, field, value) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setItems(updatedItems);
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 style={{ color: 'var(--primary)', margin: 0 }}>Create Purchase Order</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Place a new order with your supplier</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/purchase/orders')}>
          <ArrowLeft size={18} /> Back to List
        </button>
      </div>

      <div className="glass-card" style={{ padding: '25px', marginBottom: '25px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div className="input-group">
            <label><Truck size={14} /> Select Supplier</label>
            <select 
              className="input-field" 
              value={master.supplierId} 
              onChange={(e) => setMaster({...master, supplierId: e.target.value})}
              required
            >
              <option value="">-- Select Supplier --</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label><Calendar size={14} /> Order Date</label>
            <input 
              type="date" 
              className="input-field"
              value={master.orderDate}
              onChange={(e) => setMaster({...master, orderDate: e.target.value})}
              style={{ colorScheme: 'dark' }}
            />
          </div>
          <div className="input-group">
            <label><Calendar size={14} /> Expected Delivery</label>
            <input 
              type="date" 
              className="input-field"
              value={master.expiryDate}
              onChange={(e) => setMaster({...master, expiryDate: e.target.value})}
              style={{ colorScheme: 'dark' }}
            />
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '25px', marginBottom: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h4 style={{ margin: 0 }}>Order Items</h4>
          <button className="btn btn-primary" onClick={addItem}>
            <Plus size={16} /> Add Product
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px' }}>Product Name</th>
              <th style={{ padding: '12px' }}>Quantity</th>
              <th style={{ padding: '12px' }}>Expected Rate</th>
              <th style={{ padding: '12px' }}>Total Est.</th>
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
                  <input type="number" className="input-field" style={{ width: '100px' }} value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)} />
                </td>
                <td style={{ padding: '8px' }}>
                  <input type="number" className="input-field" style={{ width: '120px' }} value={item.expectedPrice} onChange={(e) => handleItemChange(item.id, 'expectedPrice', e.target.value)} />
                </td>
                <td style={{ padding: '12px', fontWeight: '600' }}>₹{(item.quantity * item.expectedPrice).toFixed(2)}</td>
                <td style={{ padding: '8px' }}>
                  <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/purchase/orders')}>Cancel</button>
        <button className="btn btn-primary" style={{ padding: '10px 30px' }}>
          <ShoppingBag size={18} /> Place Order
        </button>
      </div>
    </div>
  );
};

export default NewPurchaseOrder;
