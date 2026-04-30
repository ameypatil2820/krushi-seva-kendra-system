import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, ArrowLeft, Calendar, User, FileText, CreditCard, IndianRupee } from 'lucide-react';
import { MockService } from '../mastermodel/services/MockService';

const SaleEntry = () => {
  const [customers, setCustomers] = useState([]);
  const [master, setMaster] = useState({
    customerId: '',
    billNo: '',
    billDate: new Date().toISOString().split('T')[0],
    totalQuantity: 0,
    subtotal: 0,
    discount: 0,
    taxAmount: 0,
    grandTotal: 0,
    paymentType: 'Cash',
    paidAmount: 0,
    dueAmount: 0
  });

  useEffect(() => {
    MockService.getAll('customers').then(data => setCustomers(data));
  }, []);

  const [children, setChildren] = useState([
    { 
      id: Date.now(), 
      productId: '', 
      batchNo: '', 
      quantity: 0, 
      saleRate: 0, 
      taxPercent: 0, 
      taxAmount: 0, 
      amount: 0 
    }
  ]);

  const addChildRow = () => {
    setChildren([...children, { 
      id: Date.now(), 
      productId: '', 
      batchNo: '', 
      quantity: 0, 
      saleRate: 0, 
      taxPercent: 0, 
      taxAmount: 0, 
      amount: 0 
    }]);
  };

  const removeChildRow = (id) => {
    if (children.length > 1) {
      setChildren(children.filter(child => child.id !== id));
    }
  };

  const handleChildChange = (id, field, value) => {
    const updatedChildren = children.map(child => {
      if (child.id === id) {
        const updatedChild = { ...child, [field]: value };
        
        // Calculate tax and total for this row
        if (field === 'quantity' || field === 'saleRate' || field === 'taxPercent') {
          const qty = field === 'quantity' ? parseFloat(value) || 0 : child.quantity;
          const rate = field === 'saleRate' ? parseFloat(value) || 0 : child.saleRate;
          const taxP = field === 'taxPercent' ? parseFloat(value) || 0 : child.taxPercent;
          
          const rowSubtotal = qty * rate;
          const rowTax = (rowSubtotal * taxP) / 100;
          updatedChild.taxAmount = rowTax;
          updatedChild.amount = rowSubtotal + rowTax;
        }
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
      totalQty += parseFloat(child.quantity) || 0;
      subtotal += (parseFloat(child.quantity) || 0) * (parseFloat(child.saleRate) || 0);
      totalTax += parseFloat(child.taxAmount) || 0;
    });

    const grandTotal = subtotal + totalTax - (parseFloat(discount) || 0);
    const dueAmount = grandTotal - (parseFloat(master.paidAmount) || 0);

    setMaster(prev => ({
      ...prev,
      totalQuantity: totalQty,
      subtotal,
      taxAmount: totalTax,
      grandTotal,
      dueAmount,
      discount
    }));
  };

  const handleMasterChange = (field, value) => {
    const updatedMaster = { ...master, [field]: value };
    if (field === 'discount' || field === 'paidAmount') {
      const disc = field === 'discount' ? parseFloat(value) || 0 : master.discount;
      const paid = field === 'paidAmount' ? parseFloat(value) || 0 : master.paidAmount;
      updatedMaster.grandTotal = updatedMaster.subtotal + updatedMaster.taxAmount - disc;
      updatedMaster.dueAmount = updatedMaster.grandTotal - paid;
    }
    setMaster(updatedMaster);
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 style={{ color: 'var(--primary)', margin: 0 }}>New Sale Entry</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Create a new sales invoice</p>
        </div>
        <button className="btn btn-secondary"><ArrowLeft size={18} /> Back to List</button>
      </div>

      {/* Master Section */}
      <div className="glass-card" style={{ padding: '25px', marginBottom: '25px' }}>
        <h4 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Invoice Details (Master)</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div className="input-group">
            <label><User size={14} /> Select Customer</label>
            <select 
              className="input-field" 
              value={master.customerId} 
              onChange={(e) => handleMasterChange('customerId', e.target.value)}
              required
            >
              <option value="">-- Select Customer --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.city})</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label><FileText size={14} /> Bill No</label>
            <input 
              type="text" 
              className="input-field" 
              value={master.billNo} 
              onChange={(e) => handleMasterChange('billNo', e.target.value)}
              placeholder="SALE-101"
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
          <h4 style={{ margin: 0 }}>Products (Child)</h4>
          <button className="btn btn-primary" onClick={addChildRow} style={{ padding: '5px 15px', fontSize: '0.85rem' }}>
            <Plus size={16} /> Add Product
          </button>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px' }}>Product Name</th>
              <th style={{ padding: '12px' }}>Batch</th>
              <th style={{ padding: '12px' }}>Qty</th>
              <th style={{ padding: '12px' }}>Sale Rate</th>
              <th style={{ padding: '12px' }}>Tax %</th>
              <th style={{ padding: '12px' }}>Tax Amount</th>
              <th style={{ padding: '12px' }}>Amount</th>
              <th style={{ padding: '12px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {children.map((child) => (
              <tr key={child.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '8px' }}>
                  <input type="text" className="input-field" style={{ padding: '6px' }} value={child.productId} onChange={(e) => handleChildChange(child.id, 'productId', e.target.value)} />
                </td>
                <td style={{ padding: '8px' }}>
                  <input type="text" className="input-field" style={{ padding: '6px' }} value={child.batchNo} onChange={(e) => handleChildChange(child.id, 'batchNo', e.target.value)} />
                </td>
                <td style={{ padding: '8px' }}>
                  <input type="number" className="input-field" style={{ padding: '6px', width: '70px' }} value={child.quantity} onChange={(e) => handleChildChange(child.id, 'quantity', e.target.value)} />
                </td>
                <td style={{ padding: '8px' }}>
                  <input type="number" className="input-field" style={{ padding: '6px', width: '100px' }} value={child.saleRate} onChange={(e) => handleChildChange(child.id, 'saleRate', e.target.value)} />
                </td>
                <td style={{ padding: '8px' }}>
                  <input type="number" className="input-field" style={{ padding: '6px', width: '60px' }} value={child.taxPercent} onChange={(e) => handleChildChange(child.id, 'taxPercent', e.target.value)} />
                </td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>₹{child.taxAmount.toFixed(2)}</td>
                <td style={{ padding: '12px', fontWeight: '600' }}>₹{child.amount.toFixed(2)}</td>
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
          <h4 style={{ marginBottom: '20px' }}>Payment Info</h4>
          <div style={{ display: 'grid', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Discount</label>
              <input type="number" className="input-field" style={{ width: '120px' }} value={master.discount} onChange={(e) => handleMasterChange('discount', e.target.value)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Paid Amount</label>
              <input type="number" className="input-field" style={{ width: '120px' }} value={master.paidAmount} onChange={(e) => handleMasterChange('paidAmount', e.target.value)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ef4444', fontWeight: '600' }}>
              <label>Balance Due</label>
              <span>₹{master.dueAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '25px', background: 'rgba(59, 130, 246, 0.1)' }}>
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
              <span>GST / Tax Amount</span>
              <span style={{ fontWeight: '600' }}>₹{master.taxAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '800', marginTop: '10px', color: '#3b82f6', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
              <span>Grand Total</span>
              <span>₹{master.grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <button className="btn" style={{ width: '100%', marginTop: '20px', height: '50px', fontSize: '1.1rem', background: '#3b82f6', color: 'white' }}>
            <Save size={20} /> Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleEntry;
