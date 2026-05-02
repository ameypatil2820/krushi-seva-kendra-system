import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft, Calendar, Truck, CreditCard, Package } from 'lucide-react';
import { MockService } from '../mastermodel/services/MockService';
import SearchableSelect from './SearchableSelect';
import '../mastermodel/styles/MasterModel.css';

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
    <div className="agro-container" style={{ padding: '0 25px' }}>
      <div className="agro-unified-card" style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--border-light)',
        marginTop: '5px',
        overflow: 'hidden'
      }}>
        <div className="agro-header-compact" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          borderBottom: '1px solid var(--border-light)',
          background: 'white'
        }}>
          <div>
            <h2 style={{ fontSize: '18px', marginBottom: '1px' }}>New Purchase Entry</h2>
            <p style={{ fontSize: '12px', margin: 0 }}>Add a new stock purchase bill</p>
          </div>
          <button className="btn-agro btn-outline" onClick={() => navigate('/purchase/bills')} style={{ height: '34px', padding: '0 12px', fontSize: '12px' }}>
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        <div style={{ padding: '15px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Bill Details Section */}
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', color: 'var(--primary)' }}>
                <Truck size={16} />
                <h3 style={{ fontSize: '13px', margin: 0, fontWeight: '700' }}>Bill Details</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '10px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '12px', marginBottom: '3px' }}>Supplier</label>
                  <SearchableSelect
                    options={suppliers}
                    value={master.supplierId}
                    onChange={(val) => handleMasterChange('supplierId', val)}
                    placeholder="Search Supplier..."
                    height="36px"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '12px', marginBottom: '3px' }}>Bill Date</label>
                  <input type="date" className="form-control" style={{ height: '36px', fontSize: '13px' }} value={master.billDate} onChange={(e) => handleMasterChange('billDate', e.target.value)} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '12px', marginBottom: '3px' }}>Payment Mode</label>
                  <select className="form-control" style={{ height: '36px', fontSize: '13px' }} value={master.paymentType} onChange={(e) => handleMasterChange('paymentType', e.target.value)}>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                    <option value="UPI">UPI</option>
                    <option value="Credit">Credit</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Table Section */}
            <div style={{ border: '1px solid var(--border-light)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '10px 15px', background: '#f8fafc', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)' }}>
                  <Package size={16} />
                  <h3 style={{ fontSize: '13px', margin: 0, fontWeight: '700' }}>Stock Items</h3>
                </div>
                <button className="btn-agro btn-primary" onClick={addChildRow} style={{ height: '28px', padding: '0 10px', fontSize: '11px' }}>
                  <Plus size={14} /> Add Row
                </button>
              </div>
              <div className="agro-table-wrapper-simple" style={{ overflowX: 'auto' }}>
                <table className="agro-table" style={{ border: 'none' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '220px' }}>Product</th>
                      <th style={{ width: '70px' }}>Qty</th>
                      <th style={{ width: '90px' }}>P.Price</th>
                      <th style={{ width: '90px' }}>S.Price</th>
                      <th style={{ width: '80px' }}>MRP</th>
                      <th style={{ width: '60px' }}>Tax%</th>
                      <th style={{ width: '110px' }}>Mfg. Date</th>
                      <th style={{ width: '110px' }}>Exp. Date</th>
                      <th style={{ width: '100px' }}>Amount</th>
                      <th style={{ width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {children.map((child, idx) => (
                      <tr key={child.id}>
                        <td>
                          <SearchableSelect
                            options={products}
                            value={child.productId}
                            onChange={(val, data) => handleChildChange(child.id, 'productId', val, data)}
                            onEnterSelect={handleProductEnterSelect}
                            placeholder="Product..."
                            height="34px"
                            inputRef={el => rowRefs.current[child.id] = el}
                          />
                          {child.batchNo && <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>Batch: {child.batchNo}</div>}
                        </td>
                        <td><input type="number" className="form-control" style={{ height: '34px', fontSize: '12px' }} value={child.quantity} onChange={(e) => handleChildChange(child.id, 'quantity', e.target.value)} onKeyDown={(e) => handleEnterNavigation(e, idx)} /></td>
                        <td><input type="number" className="form-control" style={{ height: '34px', fontSize: '12px' }} value={child.purchasePrice} onChange={(e) => handleChildChange(child.id, 'purchasePrice', e.target.value)} onKeyDown={(e) => handleEnterNavigation(e, idx)} /></td>
                        <td><input type="number" className="form-control" style={{ height: '34px', fontSize: '12px' }} value={child.salePrice} onChange={(e) => handleChildChange(child.id, 'salePrice', e.target.value)} onKeyDown={(e) => handleEnterNavigation(e, idx)} /></td>
                        <td><input type="number" className="form-control" style={{ height: '34px', fontSize: '12px' }} value={child.mrp} onChange={(e) => handleChildChange(child.id, 'mrp', e.target.value)} onKeyDown={(e) => handleEnterNavigation(e, idx)} /></td>
                        <td><input type="number" className="form-control" style={{ height: '34px', fontSize: '12px' }} value={child.taxPercent} onChange={(e) => handleChildChange(child.id, 'taxPercent', e.target.value)} onKeyDown={(e) => handleEnterNavigation(e, idx)} /></td>
                        <td><input type="date" className="form-control" style={{ height: '34px', fontSize: '12px', padding: '0 5px' }} value={child.purchaseDate} onChange={(e) => handleChildChange(child.id, 'purchaseDate', e.target.value)} onKeyDown={(e) => handleEnterNavigation(e, idx)} /></td>
                        <td><input type="date" className="form-control" style={{ height: '34px', fontSize: '12px', padding: '0 5px' }} value={child.expiryDate} onChange={(e) => handleChildChange(child.id, 'expiryDate', e.target.value)} onKeyDown={(e) => handleEnterNavigation(e, idx)} /></td>
                        <td style={{ fontSize: '13px', fontWeight: '700' }}>₹{child.totalAmount.toFixed(2)}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button onClick={() => removeChildRow(child.id)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Summary Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', marginTop: '5px' }}>
              <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '12px', marginBottom: '3px' }}>Discount</label>
                    <input type="number" className="form-control" style={{ height: '36px', fontSize: '13px' }} value={master.discount} onChange={(e) => handleMasterChange('discount', e.target.value)} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '12px', marginBottom: '3px' }}>Paid Amount</label>
                    <input type="number" className="form-control" style={{ height: '36px', fontSize: '13px' }} value={master.paidAmount} onChange={(e) => handleMasterChange('paidAmount', e.target.value)} />
                  </div>
                </div>
                <div style={{ marginTop: '15px', padding: '10px', background: 'white', borderRadius: '8px', border: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Total Quantity: <strong>{master.totalQuantity}</strong></span>
                  <span style={{ fontSize: '13px', color: '#ef4444', fontWeight: '700' }}>Due Balance: ₹{master.dueAmount.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ textAlign: 'right', padding: '15px 25px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#166534' }}>Grand Total Amount</p>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#15803d' }}>₹{master.grandTotal.toFixed(2)}</h2>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button className="btn-agro btn-outline" onClick={() => navigate('/purchase/bills')} style={{ flex: 1, height: '38px', fontSize: '13px' }}>Cancel</button>
                  <button className="btn-agro btn-primary" style={{ flex: 1, height: '38px', fontSize: '13px' }}><Save size={18} /> Save Bill</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseEntry;
