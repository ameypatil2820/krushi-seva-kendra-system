import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, ArrowLeft, Calendar, User, FileText, CreditCard, Truck, Package, Search as SearchIcon } from 'lucide-react';
import { MockService } from '../mastermodel/services/MockService';
import SearchableSelect from './SearchableSelect';

const PurchaseEntry = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [master, setMaster] = useState({
    supplierId: '',
    billNo: '',
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

  useEffect(() => {
    MockService.getAll('suppliers').then(data => setSuppliers(data));
    MockService.getAll('products').then(data => setProducts(data));
  }, []);

  const [children, setChildren] = useState([
    {
      id: Date.now(),
      productId: '',
      batchNo: '',
      quantity: 0,
      purchasePrice: 0,
      salePrice: 0,
      mrp: 0,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 0,
      expiryDate: ''
    }
  ]);

  const addChildRow = () => {
    setChildren([...children, {
      id: Date.now(),
      productId: '',
      batchNo: '',
      quantity: 0,
      purchasePrice: 0,
      salePrice: 0,
      mrp: 0,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 0,
      expiryDate: ''
    }]);
  };

  const removeChildRow = (id) => {
    if (children.length > 1) {
      setChildren(children.filter(child => child.id !== id));
    }
  };

  const handleChildChange = (id, field, value, extraData) => {
    const updatedChildren = children.map(child => {
      if (child.id === id) {
        let updatedChild = { ...child, [field]: value };
        
        // Auto-fill from product selection
        if (field === 'productId' && extraData) {
          updatedChild.purchasePrice = parseFloat(extraData.purchasePrice) || 0;
          updatedChild.salePrice = parseFloat(extraData.salePrice) || 0;
          updatedChild.mrp = parseFloat(extraData.mrp) || 0;
          updatedChild.taxPercent = parseFloat(extraData.tax) || 0;
        }

        const qty = field === 'quantity' ? parseFloat(value) || 0 : updatedChild.quantity;
        const price = field === 'purchasePrice' || (field === 'productId' && extraData) ? (parseFloat(updatedChild.purchasePrice) || 0) : child.purchasePrice;
        const taxP = field === 'taxPercent' || (field === 'productId' && extraData) ? (parseFloat(updatedChild.taxPercent) || 0) : child.taxPercent;
        
        const rowSubtotal = qty * price;
        const rowTax = (rowSubtotal * taxP) / 100;
        updatedChild.taxAmount = rowTax;
        updatedChild.totalAmount = rowSubtotal + rowTax;
        
        return updatedChild;
      }
      return child;
    });
    setChildren(updatedChildren);
    calculateTotals(updatedChildren, master.discount);
  };

  const calculateTotals = (currentChildren, discount) => {
    let totalQty = 0;
    let subtotal = 0;
    let totalTax = 0;

    currentChildren.forEach(child => {
      const qty = parseFloat(child.quantity) || 0;
      const price = parseFloat(child.purchasePrice) || 0;
      const taxP = parseFloat(child.taxPercent) || 0;

      const rowSubtotal = qty * price;
      const rowTax = (rowSubtotal * taxP) / 100;

      totalQty += qty;
      subtotal += rowSubtotal;
      totalTax += rowTax;
    });

    const disc = parseFloat(discount) || 0;
    const paid = parseFloat(master.paidAmount) || 0;
    const grandTotal = Math.max(0, subtotal + totalTax - disc);
    const dueAmount = grandTotal - paid;

    setMaster(prev => ({
      ...prev,
      totalQuantity: totalQty,
      subtotal,
      totalTaxAmount: totalTax,
      grandTotal,
      dueAmount,
      discount: disc
    }));
  };

  const handleMasterChange = (field, value) => {
    const val = field === 'discount' || field === 'paidAmount' ? (parseFloat(value) || 0) : value;
    const updatedMaster = { ...master, [field]: val };

    if (field === 'discount' || field === 'paidAmount') {
      const disc = field === 'discount' ? val : master.discount;
      const paid = field === 'paidAmount' ? val : master.paidAmount;
      updatedMaster.grandTotal = Math.max(0, updatedMaster.subtotal + updatedMaster.totalTaxAmount - disc);
      updatedMaster.dueAmount = updatedMaster.grandTotal - paid;
    }
    setMaster(updatedMaster);
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 style={{ color: 'var(--primary)', margin: 0 }}>New Purchase Entry</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Add a new stock purchase bill</p>
        </div>
        <button className="btn btn-secondary"><ArrowLeft size={18} /> Back to List</button>
      </div>

      {/* Master Section */}
      <div className="glass-card" style={{ padding: '25px', marginBottom: '25px', position: 'relative', zIndex: 10 }}>
        <h4 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Bill Details (Master)</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div className="input-group" style={{ gridColumn: 'span 1' }}>
            <label><Truck size={14} /> Supplier</label>
            <SearchableSelect 
              options={suppliers}
              value={master.supplierId}
              onChange={(val) => handleMasterChange('supplierId', val)}
              placeholder="Search Supplier..."
            />
          </div>
          <div className="input-group">
            <label><FileText size={14} /> Bill No</label>
            <input
              type="text"
              className="input-field"
              value={master.billNo}
              onChange={(e) => handleMasterChange('billNo', e.target.value)}
              placeholder="INV-1234"
            />
          </div>
          <div className="input-group">
            <label><Calendar size={14} /> Bill Date</label>
            <input
              type="date"
              className="input-field"
              value={master.billDate}
              onChange={(e) => handleMasterChange('billDate', e.target.value)}
              style={{ colorScheme: 'dark' }}
            />
          </div>
          <div className="input-group">
            <label><CreditCard size={14} /> Payment Type</label>
            <select
              className="input-field"
              value={master.paymentType}
              onChange={(e) => handleMasterChange('paymentType', e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="Bank">Bank Transfer</option>
              <option value="UPI">UPI</option>
              <option value="Credit">Credit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Child Section (Table) */}
      <div className="glass-card" style={{ padding: '25px', marginBottom: '25px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h4 style={{ margin: 0 }}>Product Items (Child)</h4>
          <button className="btn btn-primary" onClick={addChildRow} style={{ padding: '5px 15px', fontSize: '0.85rem' }}>
            <Plus size={16} /> Add Product
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px' }}>Product Name</th>
              <th style={{ padding: '12px' }}>Batch</th>
              <th style={{ padding: '12px' }}>Qty</th>
              <th style={{ padding: '12px' }}>P. Price</th>
              <th style={{ padding: '12px' }}>S. Price</th>
              <th style={{ padding: '12px' }}>MRP</th>
              <th style={{ padding: '12px' }}>Tax %</th>
              <th style={{ padding: '12px' }}>Total</th>
              <th style={{ padding: '12px' }}>Expiry</th>
              <th style={{ padding: '12px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {children.map((child) => (
              <tr key={child.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '8px', minWidth: '250px' }}>
                  <SearchableSelect 
                    options={products}
                    value={child.productId}
                    onChange={(val, data) => handleChildChange(child.id, 'productId', val, data)}
                    placeholder="Search Product..."
                    icon={Package}
                    height="36px"
                    padding="0 8px"
                  />
                </td>
                <td style={{ padding: '8px' }}>
                  <input type="text" className="input-field" style={{ padding: '6px' }} value={child.batchNo} onChange={(e) => handleChildChange(child.id, 'batchNo', e.target.value)} />
                </td>
                <td style={{ padding: '8px' }}>
                  <input type="number" className="input-field" style={{ padding: '6px', width: '70px' }} value={child.quantity} onChange={(e) => handleChildChange(child.id, 'quantity', e.target.value)} />
                </td>
                <td style={{ padding: '8px' }}>
                  <input type="number" className="input-field" style={{ padding: '6px', width: '90px' }} value={child.purchasePrice} onChange={(e) => handleChildChange(child.id, 'purchasePrice', e.target.value)} />
                </td>
                <td style={{ padding: '8px' }}>
                  <input type="number" className="input-field" style={{ padding: '6px', width: '90px' }} value={child.salePrice} onChange={(e) => handleChildChange(child.id, 'salePrice', e.target.value)} />
                </td>
                <td style={{ padding: '8px' }}>
                  <input type="number" className="input-field" style={{ padding: '6px', width: '90px' }} value={child.mrp} onChange={(e) => handleChildChange(child.id, 'mrp', e.target.value)} />
                </td>
                <td style={{ padding: '8px' }}>
                  <input type="number" className="input-field" style={{ padding: '6px', width: '60px' }} value={child.taxPercent} onChange={(e) => handleChildChange(child.id, 'taxPercent', e.target.value)} />
                </td>
                <td style={{ padding: '12px', fontWeight: '600' }}>₹{child.totalAmount.toFixed(2)}</td>
                <td style={{ padding: '8px' }}>
                  <input type="date" className="input-field" style={{ padding: '6px', colorScheme: 'dark' }} value={child.expiryDate} onChange={(e) => handleChildChange(child.id, 'expiryDate', e.target.value)} />
                </td>
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

      {/* Summary Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
        <div className="glass-card" style={{ padding: '25px' }}>
          <h4 style={{ marginBottom: '20px' }}>Payment Details</h4>
          <div style={{ display: 'grid', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Discount Amount</label>
              <input type="number" className="input-field" style={{ width: '120px' }} value={master.discount} onChange={(e) => handleMasterChange('discount', e.target.value)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Paid Amount</label>
              <input type="number" className="input-field" style={{ width: '120px' }} value={master.paidAmount} onChange={(e) => handleMasterChange('paidAmount', e.target.value)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ef4444', fontWeight: '600' }}>
              <label>Due Amount</label>
              <span>₹{master.dueAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '25px', background: 'rgba(16, 185, 129, 0.1)' }}>
          <h4 style={{ marginBottom: '20px' }}>Bill Summary</h4>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Quantity</span>
              <span style={{ fontWeight: '600' }}>{master.totalQuantity}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal (Before Tax)</span>
              <span style={{ fontWeight: '600' }}>₹{master.subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Tax Amount</span>
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
