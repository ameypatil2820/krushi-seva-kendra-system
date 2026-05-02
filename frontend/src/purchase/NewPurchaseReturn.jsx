import React, { useState, useEffect, useRef } from 'react';
import { Save, ArrowLeft, Plus, Trash2, Truck, Calendar, FileText, RotateCcw, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MockService } from '../mastermodel/services/MockService';
import SearchableSelect from './SearchableSelect';

const NewPurchaseReturn = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const rowRefs = useRef({});
  const [master, setMaster] = useState({
    purchaseId: '',
    supplierId: '',
    returnDate: new Date().toISOString().split('T')[0],
    reason: '',
    totalAmount: 0
  });

  useEffect(() => {
    MockService.getAll('suppliers').then(data => setSuppliers(data));
    MockService.getAll('products').then(data => setProducts(data));
  }, []);

  const [items, setItems] = useState([
    { id: Date.now(), productId: '', quantity: 1, purchasePrice: 0, amount: 0 }
  ]);
  const rowToFocus = useRef(null);

  useEffect(() => {
    if (rowToFocus.current) {
      const el = rowRefs.current[rowToFocus.current];
      if (el) {
        el.focus();
        rowToFocus.current = null;
      }
    }
  }, [items]);

  const addItem = (focusAfter = true) => {
    const id = Date.now() + Math.random();
    if (focusAfter) {
      rowToFocus.current = id;
    }
    setItems([...items, { id, productId: '', quantity: 1, purchasePrice: 0, amount: 0 }]);
  };

  const handleProductEnterSelect = () => addItem();

  const handleEnterNavigation = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (index === items.length - 1) {
        addItem();
      } else {
        const nextId = items[index + 1].id;
        const el = rowRefs.current[nextId];
        if (el) el.focus();
      }
    }
  };

  const handleItemChange = (id, field, value, extraData) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        let updatedItem = { ...item, [field]: value };
        
        if (field === 'productId' && extraData) {
          updatedItem.purchasePrice = parseFloat(extraData.purchasePrice) || 0;
        }

        const qty = field === 'quantity' ? parseFloat(value) || 0 : updatedItem.quantity;
        const price = field === 'purchasePrice' || (field === 'productId' && extraData) ? (parseFloat(updatedItem.purchasePrice) || 0) : item.purchasePrice;
        
        updatedItem.amount = qty * price;
        return updatedItem;
      }
      return item;
    });
    setItems(updatedItems);
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 style={{ color: '#f59e0b', margin: 0 }}>New Purchase Return</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Return items to your supplier</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/purchase/returns')}>
          <ArrowLeft size={18} /> Back to List
        </button>
      </div>

      <div className="glass-card" style={{ padding: '25px', marginBottom: '25px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div className="input-group">
            <label><FileText size={14} /> Original Purchase ID</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. PUR-101"
              value={master.purchaseId}
              onChange={(e) => setMaster({...master, purchaseId: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label><Truck size={14} /> Supplier</label>
            <SearchableSelect 
              options={suppliers}
              value={master.supplierId}
              onChange={(val) => setMaster({...master, supplierId: val})}
              placeholder="Search Supplier..."
              textColor="#0f172a"
              bgColor="#ffffff"
            />
          </div>
          <div className="input-group">
            <label><Calendar size={14} /> Return Date</label>
            <input 
              type="date" 
              className="input-field"
              value={master.returnDate}
              onChange={(e) => setMaster({...master, returnDate: e.target.value})}
              style={{ colorScheme: 'dark' }}
            />
          </div>
        </div>
        <div className="input-group" style={{ marginTop: '20px' }}>
          <label>Reason for Return</label>
          <textarea 
            className="input-field" 
            placeholder="Reason (e.g. Damaged goods, Wrong items...)"
            value={master.reason}
            onChange={(e) => setMaster({...master, reason: e.target.value})}
            style={{ minHeight: '80px' }}
          ></textarea>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '25px', marginBottom: '25px' }}>
        <h4 style={{ marginBottom: '20px' }}>Return Items</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px' }}>Product Name</th>
              <th style={{ padding: '12px' }}>Quantity</th>
              <th style={{ padding: '12px' }}>Purchase Price</th>
              <th style={{ padding: '12px' }}>Amount</th>
              <th style={{ padding: '12px' }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '8px', minWidth: '250px' }}>
                  <SearchableSelect 
                    options={products}
                    value={item.productId}
                    onChange={(val, data) => handleItemChange(item.id, 'productId', val, data)}
                    onEnterSelect={handleProductEnterSelect}
                    placeholder="Search Product..."
                    icon={Package}
                    height="36px"
                    padding="0 8px"
                    textColor="#0f172a"
                    bgColor="#ffffff"
                    inputRef={el => rowRefs.current[item.id] = el}
                  />
                </td>
                <td style={{ padding: '8px' }}>
                  <input type="number" className="input-field" style={{ width: '80px' }} value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)} onKeyDown={(e) => handleEnterNavigation(e, idx)} />
                </td>
                <td style={{ padding: '8px' }}>
                  <input type="number" className="input-field" style={{ width: '120px' }} value={item.purchasePrice} onChange={(e) => handleItemChange(item.id, 'purchasePrice', e.target.value)} onKeyDown={(e) => handleEnterNavigation(e, idx)} />
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
        <button className="btn btn-secondary" onClick={() => addItem(true)} style={{ marginTop: '15px' }}>
          <Plus size={16} /> Add Product
        </button>

        <div style={{ marginTop: '30px', textAlign: 'right' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '5px' }}>Total Return Value</p>
          <h2 style={{ color: '#f59e0b', margin: 0 }}>₹{items.reduce((sum, i) => sum + i.amount, 0).toFixed(2)}</h2>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/purchase/returns')}>Cancel</button>
        <button className="btn" style={{ background: '#f59e0b', color: 'white', padding: '10px 30px' }}>
          <RotateCcw size={18} /> Confirm Return
        </button>
      </div>
    </div>
  );
};

export default NewPurchaseReturn;
