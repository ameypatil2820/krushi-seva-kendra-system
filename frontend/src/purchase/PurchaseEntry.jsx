import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft, Calendar, Truck, CreditCard, Package } from 'lucide-react';
import { MockService } from '../mastermodel/services/MockService';
import SearchableSelect from './SearchableSelect';

const newRow = () => ({
  id: Date.now() + Math.random(),
  productId: '',
  productName: '',
  batchNo: '',
  quantity: 1,
  purchasePrice: '',
  salePrice: '',
  mrp: '',
  taxPercent: '',
  taxAmount: 0,
  totalAmount: 0,
  purchaseDate: '',
  expiryDate: ''
});

const PurchaseEntry = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const rowRefs = useRef({});

  const [master, setMaster] = useState({
    supplierId: '',
    billDate: new Date().toISOString().split('T')[0],
    totalQuantity: 0,
    subtotal: 0,
    totalTaxAmount: 0,
    discount: 0,
    grandTotal: 0,
    paymentType: 'Cash',
    paidAmount: 0,
    dueAmount: 0
  });

  const [children, setChildren] = useState([newRow()]);
  const rowToFocus = useRef(null);

  // Focus the new row automatically after it renders
  useEffect(() => {
    if (rowToFocus.current) {
      const el = rowRefs.current[rowToFocus.current];
      if (el) {
        el.focus();
        rowToFocus.current = null;
      }
    }
  }, [children]);

  useEffect(() => {
    MockService.getAll('suppliers').then(data => setSuppliers(data));
    MockService.getAll('products').then(data => setProducts(data));
  }, []);

  const calculateTotals = (rows, discount) => {
    let totalQty = 0, subtotal = 0, totalTax = 0;
    rows.forEach(child => {
      const qty = parseFloat(child.quantity) || 0;
      const price = parseFloat(child.purchasePrice) || 0;
      const taxP = parseFloat(child.taxPercent) || 0;
      const rowSub = qty * price;
      const rowTax = (rowSub * taxP) / 100;
      totalQty += qty;
      subtotal += rowSub;
      totalTax += rowTax;
    });
    const disc = parseFloat(discount) || 0;
    const paid = parseFloat(master.paidAmount) || 0;
    const grandTotal = Math.max(0, subtotal + totalTax - disc);
    setMaster(prev => ({
      ...prev,
      totalQuantity: totalQty,
      subtotal,
      totalTaxAmount: totalTax,
      grandTotal,
      dueAmount: grandTotal - paid,
      discount: disc
    }));
  };

  const handleChildChange = (id, field, value, extraData) => {
    const updated = children.map(child => {
      if (child.id !== id) return child;
      let u = { ...child, [field]: value };
      if (field === 'productId' && extraData) {
        u.productName = extraData.name || '';
        u.batchNo = extraData.batchNo || '';
        u.purchasePrice = parseFloat(extraData.costPrice) || '';
        u.salePrice = parseFloat(extraData.salePrice) || '';
        u.mrp = parseFloat(extraData.mrp) || '';
        u.taxPercent = parseFloat(extraData.tax) || '';
      }
      const qty = parseFloat(field === 'quantity' ? value : u.quantity) || 0;
      const price = parseFloat(field === 'purchasePrice' ? value : u.purchasePrice) || 0;
      const taxP = parseFloat(field === 'taxPercent' ? value : u.taxPercent) || 0;
      const rowSub = qty * price;
      const rowTax = (rowSub * taxP) / 100;
      u.taxAmount = rowTax;
      u.totalAmount = rowSub + rowTax;
      return u;
    });
    setChildren(updated);
    calculateTotals(updated, master.discount);
  };

  const addChildRow = () => {
    const r = newRow();
    rowToFocus.current = r.id;
    setChildren(prev => [...prev, r]);
  };

  const removeChildRow = (id) => {
    if (children.length > 1) {
      const updated = children.filter(c => c.id !== id);
      setChildren(updated);
      calculateTotals(updated, master.discount);
    }
  };

  const handleProductEnterSelect = () => addChildRow();

  const handleEnterNavigation = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (index === children.length - 1) {
        addChildRow();
      } else {
        const nextId = children[index + 1].id;
        const el = rowRefs.current[nextId];
        if (el) el.focus();
      }
    }
  };

  const handleMasterChange = (field, value) => {
    const val = ['discount', 'paidAmount'].includes(field) ? (parseFloat(value) || 0) : value;
    const updated = { ...master, [field]: val };
    if (field === 'discount' || field === 'paidAmount') {
      const disc = field === 'discount' ? val : master.discount;
      const paid = field === 'paidAmount' ? val : master.paidAmount;
      updated.grandTotal = Math.max(0, updated.subtotal + updated.totalTaxAmount - disc);
      updated.dueAmount = updated.grandTotal - paid;
    }
    setMaster(updated);
  };

  return (
    <div className="animate-fade">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 style={{ color: 'var(--primary)', margin: 0 }}>New Purchase Entry</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Add a new stock purchase bill</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/purchase/bills')}>
          <ArrowLeft size={18} /> Back to List
        </button>
      </div>

      {/* Master Section — Supplier + Date only */}
      <div className="glass-card" style={{ padding: '25px', marginBottom: '25px', position: 'relative', zIndex: 10 }}>
        <h4 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Bill Details</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div className="input-group">
            <label><Truck size={14} /> Supplier</label>
            <SearchableSelect
              options={suppliers}
              value={master.supplierId}
              onChange={(val) => handleMasterChange('supplierId', val)}
              placeholder="Search Supplier..."
              textColor="#0f172a"
              bgColor="#ffffff"
            />
          </div>
          <div className="input-group">
            <label><Calendar size={14} /> Bill Date</label>
            <input
              type="date"
              className="input-field"
              value={master.billDate}
              onChange={(e) => handleMasterChange('billDate', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="glass-card" style={{ padding: '25px', marginBottom: '25px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h4 style={{ margin: 0 }}>Products</h4>
          <button className="btn btn-primary" onClick={addChildRow} style={{ padding: '5px 15px', fontSize: '0.85rem' }}>
            <Plus size={16} /> Add Row
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px', minWidth: '220px' }}>Product Name</th>
              <th style={{ padding: '12px', width: '80px' }}>Qty</th>
              <th style={{ padding: '12px', width: '110px' }}>Purchase Price</th>
              <th style={{ padding: '12px', width: '100px' }}>Sale Price</th>
              <th style={{ padding: '12px', width: '90px' }}>MRP</th>
              <th style={{ padding: '12px', width: '70px' }}>Tax %</th>
              <th style={{ padding: '12px', width: '130px' }}>Mfg Date</th>
              <th style={{ padding: '12px', width: '130px' }}>Expiry Date</th>
              <th style={{ padding: '12px', width: '110px' }}>Total</th>
              <th style={{ padding: '12px', width: '40px' }}></th>
            </tr>
          </thead>
          <tbody>
            {children.map((child, idx) => (
              <tr key={child.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                {/* Product — batch sub-text */}
                <td style={{ padding: '8px', minWidth: '220px' }}>
                  <SearchableSelect
                    options={products}
                    value={child.productId}
                    onChange={(val, data) => handleChildChange(child.id, 'productId', val, data)}
                    onEnterSelect={handleProductEnterSelect}
                    placeholder="Search Product..."
                    icon={Package}
                    height="36px"
                    padding="0 8px"
                    textColor="#0f172a"
                    bgColor="#ffffff"
                    inputRef={el => rowRefs.current[child.id] = el}
                  />
                  {child.batchNo && (
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '3px', paddingLeft: '4px' }}>
                      Batch: <strong>{child.batchNo}</strong>
                    </div>
                  )}
                </td>

                {/* Qty */}
                <td style={{ padding: '8px' }}>
                  <input type="number" className="input-field" style={{ padding: '6px', width: '70px' }}
                    value={child.quantity}
                    onChange={(e) => handleChildChange(child.id, 'quantity', e.target.value)}
                    onKeyDown={(e) => handleEnterNavigation(e, idx)}
                  />
                </td>

                {/* Purchase Price */}
                <td style={{ padding: '8px' }}>
                  <input type="number" className="input-field" style={{ padding: '6px', width: '100px' }}
                    value={child.purchasePrice}
                    onChange={(e) => handleChildChange(child.id, 'purchasePrice', e.target.value)}
                    onKeyDown={(e) => handleEnterNavigation(e, idx)}
                  />
                </td>

                {/* Sale Price */}
                <td style={{ padding: '8px' }}>
                  <input type="number" className="input-field" style={{ padding: '6px', width: '90px' }}
                    value={child.salePrice}
                    onChange={(e) => handleChildChange(child.id, 'salePrice', e.target.value)}
                    onKeyDown={(e) => handleEnterNavigation(e, idx)}
                  />
                </td>

                {/* MRP */}
                <td style={{ padding: '8px' }}>
                  <input type="number" className="input-field" style={{ padding: '6px', width: '80px' }}
                    value={child.mrp}
                    onChange={(e) => handleChildChange(child.id, 'mrp', e.target.value)}
                    onKeyDown={(e) => handleEnterNavigation(e, idx)}
                  />
                </td>

                {/* Tax % */}
                <td style={{ padding: '8px' }}>
                  <input type="number" className="input-field" style={{ padding: '6px', width: '60px' }}
                    value={child.taxPercent}
                    onChange={(e) => handleChildChange(child.id, 'taxPercent', e.target.value)}
                    onKeyDown={(e) => handleEnterNavigation(e, idx)}
                  />
                </td>

                {/* Purchase / Mfg Date */}
                <td style={{ padding: '8px' }}>
                  <input type="date" className="input-field" style={{ padding: '6px', width: '120px' }}
                    value={child.purchaseDate}
                    onChange={(e) => handleChildChange(child.id, 'purchaseDate', e.target.value)}
                    onKeyDown={(e) => handleEnterNavigation(e, idx)}
                  />
                </td>

                {/* Expiry Date */}
                <td style={{ padding: '8px' }}>
                  <input type="date" className="input-field" style={{ padding: '6px', width: '120px' }}
                    value={child.expiryDate}
                    onChange={(e) => handleChildChange(child.id, 'expiryDate', e.target.value)}
                    onKeyDown={(e) => handleEnterNavigation(e, idx)}
                  />
                </td>

                {/* Total (read-only) */}
                <td style={{ padding: '12px', fontWeight: '600' }}>₹{child.totalAmount.toFixed(2)}</td>

                {/* Delete */}
                <td style={{ padding: '8px' }}>
                  <button onClick={() => removeChildRow(child.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary + Payment */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>

        {/* Payment Info */}
        <div className="glass-card" style={{ padding: '25px' }}>
          <h4 style={{ marginBottom: '20px' }}>Payment Info</h4>
          <div style={{ display: 'grid', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label><CreditCard size={14} style={{ marginRight: '6px' }} />Payment Type</label>
              <select className="input-field" style={{ width: '140px' }} value={master.paymentType}
                onChange={(e) => handleMasterChange('paymentType', e.target.value)}>
                <option value="Cash">Cash</option>
                <option value="Bank">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="Credit">Credit</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Discount</label>
              <input type="number" className="input-field" style={{ width: '120px' }} value={master.discount}
                onChange={(e) => handleMasterChange('discount', e.target.value)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Paid Amount</label>
              <input type="number" className="input-field" style={{ width: '120px' }} value={master.paidAmount}
                onChange={(e) => handleMasterChange('paidAmount', e.target.value)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ef4444', fontWeight: '600' }}>
              <label>Balance Due</label>
              <span>₹{master.dueAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Bill Total */}
        <div className="glass-card" style={{ padding: '25px', background: 'rgba(16, 185, 129, 0.1)' }}>
          <h4 style={{ marginBottom: '20px' }}>Bill Total</h4>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Quantity</span>
              <span style={{ fontWeight: '600' }}>{master.totalQuantity}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: '600' }}>₹{master.subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Tax</span>
              <span style={{ fontWeight: '600' }}>₹{master.totalTaxAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '800', marginTop: '10px', color: 'var(--primary)', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
              <span>Grand Total</span>
              <span>₹{master.grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px', height: '50px', fontSize: '1.1rem' }}>
            <Save size={20} /> Save Purchase Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseEntry;
