import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, ArrowLeft } from 'lucide-react';
import FormField from '../mastermodel/components/FormField';
import SearchableSelect from '../sales/SearchableSelect';
import { MockService } from '../mastermodel/services/MockService';
import '../mastermodel/styles/MasterModel.css';

const NewSupplierBill = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    supplierName: '', supplierId: '', totalPurchase: '', paid: '', date: new Date().toISOString().split('T')[0], paymentMode: ''
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      const data = await MockService.getAll('suppliers');
      setSuppliers(data);
    };
    fetchSuppliers();
  }, []);

  const supplierOptions = suppliers.map(s => ({
    id: s.id,
    name: s.name,
    city: s.city,
    code: s.mobile
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSupplierSelect = (id, opt) => {
    if (opt) {
      setFormData(prev => ({
        ...prev,
        supplierId: opt.id,
        supplierName: opt.name
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        supplierId: '',
        supplierName: ''
      }));
    }
  };

  const handleSave = (e, shouldPrint = false) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem('ksk_supplier_bills') || '[]');
    const total = Number(formData.totalPurchase || 0);
    const paid = Number(formData.paid || 0);
    
    const newBill = {
      id: `SB-00${existing.length + 4}`,
      supplierId: formData.supplierId || 'N/A',
      supplierName: formData.supplierName,
      totalPurchase: total,
      paid: paid,
      due: total - paid,
      date: formData.date,
      paymentMode: formData.paymentMode || 'Cash'
    };
    localStorage.setItem('ksk_supplier_bills', JSON.stringify([...existing, newBill]));

    if (shouldPrint) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Supplier Bill - ${newBill.id}</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
              .header { text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px; }
              .header h1 { margin: 0; color: #f59e0b; font-size: 28px; }
              .header p { margin: 5px 0 0 0; color: #666; }
              .details { margin-bottom: 30px; display: flex; justify-content: space-between; }
              .details div { line-height: 1.6; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              th, td { border-bottom: 1px solid #ddd; padding: 12px 8px; text-align: left; }
              th { background-color: #f8fafc; color: #475569; }
              .totals { width: 50%; float: right; }
              .totals-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
              .totals-row.final { font-weight: bold; font-size: 18px; border-top: 2px solid #333; border-bottom: none; margin-top: 5px; }
              .footer { clear: both; margin-top: 80px; text-align: center; color: #888; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>AGRO SEVA KENDRA</h1>
              <p>Supplier Payment / Purchase Voucher</p>
            </div>
            
            <div class="details">
              <div>
                <strong>Supplier:</strong><br/>
                ${newBill.supplierName}<br/>
                Supplier ID: ${newBill.supplierId}
              </div>
              <div style="text-align: right;">
                <strong>Voucher No:</strong> ${newBill.id}<br/>
                <strong>Date:</strong> ${newBill.date}<br/>
                <strong>Payment Mode:</strong> ${newBill.paymentMode}
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Total Purchase Amount</td>
                  <td style="text-align: right;">Rs. ${newBill.totalPurchase.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Amount Paid</td>
                  <td style="text-align: right; color: #f59e0b;">Rs. ${newBill.paid.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div class="totals">
              <div class="totals-row final">
                <span>Remaining Due:</span>
                <span style="color: ${newBill.due > 0 ? '#ef4444' : '#10b981'};">Rs. ${newBill.due.toLocaleString()}</span>
              </div>
            </div>

            <div class="footer">
              Authorized Signatory<br/><br/>
              This is a computer generated voucher.
            </div>
            
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }

    navigate('/billing');
  };

  return (
    <div className="agro-container">
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <div className="page-title-area" style={{ display: 'flex', alignItems: 'center' }}>
          <button className="btn-agro btn-outline" onClick={() => navigate('/billing')} style={{ marginRight: '15px', padding: '8px', border: 'none', background: 'transparent' }}>
            <ArrowLeft size={24} color="#6b7280" />
          </button>
          <div className="page-title">
            <h1 style={{ fontSize: '28px' }}>Create Supplier Bill</h1>
            <p>Record a new purchase bill or payment to a supplier</p>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => handleSave(e, false)} style={{ background: 'white', padding: '30px', borderRadius: '15px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <div style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: '20px', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: 0 }}>Supplier Bill Information</h2>
          <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>Enter supplier purchase and payment details below</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#374151', textTransform: 'uppercase' }}>Select Supplier *</label>
              <SearchableSelect 
                options={supplierOptions}
                value={formData.supplierId}
                onChange={handleSupplierSelect}
                placeholder="Search by Name, Mobile or City..."
                height="48px"
              />
              <input 
                type="text" 
                name="supplierName" 
                value={formData.supplierName} 
                onChange={handleChange} 
                required 
                style={{ display: 'none' }} 
              />
            </div>

            <FormField label="Payment Date" name="date" type="date" value={formData.date} onChange={handleChange} required />
            
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#374151', textTransform: 'uppercase' }}>Payment Mode</label>
              <select name="paymentMode" className="input-field" value={formData.paymentMode} onChange={handleChange} required style={{ height: '48px', borderRadius: '10px', border: '1px solid #d1d5db', padding: '0 12px' }}>
                <option value="">Select Mode</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <FormField label="Supplier ID" name="supplierId" value={formData.supplierId} onChange={() => {}} placeholder="Auto-filled" readonly />
              <FormField label="Total Purchase (₹)" name="totalPurchase" type="number" value={formData.totalPurchase} onChange={handleChange} required placeholder="0" />
            </div>
            
            <FormField label="Paid Amount (₹)" name="paid" type="number" value={formData.paid} onChange={handleChange} required placeholder="0" />
          </div>
        </div>
        
        <div style={{ marginTop: '40px', padding: '30px', background: 'linear-gradient(to right, #f8fafc, #fff7ed)', borderRadius: '15px', border: '1px solid #fed7aa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontWeight: '700', color: '#9a3412', fontSize: '16px', display: 'block' }}>Payment Summary</span>
            <span style={{ color: '#c2410c', fontSize: '14px' }}>Outstanding balance for this supplier</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'block', fontSize: '14px', color: '#c2410c', marginBottom: '5px' }}>Outstanding Due</span>
            <span style={{ fontSize: '32px', fontWeight: '800', color: (Number(formData.totalPurchase || 0) - Number(formData.paid || 0)) > 0 ? '#ef4444' : '#10b981' }}>
              ₹{(Number(formData.totalPurchase || 0) - Number(formData.paid || 0)).toLocaleString()}
            </span>
          </div>
        </div>

        <div style={{ marginTop: '40px', borderTop: '1px solid #f1f5f9', paddingTop: '30px', display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
          <button type="button" className="btn-agro btn-outline" onClick={() => navigate('/billing')} style={{ padding: '12px 30px', minWidth: '120px' }}><X size={18} /> Cancel</button>
          <button type="submit" className="btn-agro btn-primary" style={{ padding: '12px 40px', fontWeight: 'bold', minWidth: '160px' }}><Save size={18} /> Save Bill</button>
          <button type="button" className="btn-agro btn-primary" style={{ padding: '12px 40px', fontWeight: 'bold', background: '#0ea5e9', borderColor: '#0ea5e9', minWidth: '160px' }} onClick={(e) => handleSave(e, true)}>
            <Save size={18} /> Save & Print
          </button>
        </div>
      </form>
    </div>
  );
};
export default NewSupplierBill;
