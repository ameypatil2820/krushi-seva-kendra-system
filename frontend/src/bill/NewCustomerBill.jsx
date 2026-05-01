import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, ArrowLeft } from 'lucide-react';
import FormField from '../mastermodel/components/FormField';
import SearchableSelect from '../sales/SearchableSelect';
import { MockService } from '../mastermodel/services/MockService';
import '../mastermodel/styles/MasterModel.css';

const NewCustomerBill = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '', customerId: '', totalBill: '', paid: '', paymentDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      const data = await MockService.getAll('customers');
      setCustomers(data);
    };
    fetchCustomers();
  }, []);

  const customerOptions = customers.map(c => ({
    id: c.id,
    name: c.name,
    city: c.city,
    code: c.mobile
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomerSelect = (id, opt) => {
    if (opt) {
      setFormData(prev => ({
        ...prev,
        customerId: opt.id,
        customerName: opt.name
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        customerId: '',
        customerName: ''
      }));
    }
  };

  const handleSave = (e, shouldPrint = false) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem('ksk_customer_bills') || '[]');
    const total = Number(formData.totalBill || 0);
    const paid = Number(formData.paid || 0);
    
    const newBill = {
      id: `CB-00${existing.length + 4}`, // starts from 4 since mock has 3
      customerId: formData.customerId || 'N/A',
      customerName: formData.customerName,
      totalBill: total,
      paid: paid,
      due: total - paid,
      paymentDate: formData.paymentDate
    };
    localStorage.setItem('ksk_customer_bills', JSON.stringify([...existing, newBill]));

    if (shouldPrint) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Bill - ${newBill.id}</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
              .header { text-align: center; border-bottom: 2px solid #16a34a; padding-bottom: 20px; margin-bottom: 30px; }
              .header h1 { margin: 0; color: #16a34a; font-size: 28px; }
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
              <p>Customer Payment Receipt</p>
            </div>
            
            <div class="details">
              <div>
                <strong>Bill To:</strong><br/>
                ${newBill.customerName}<br/>
                Customer ID: ${newBill.customerId}
              </div>
              <div style="text-align: right;">
                <strong>Receipt No:</strong> ${newBill.id}<br/>
                <strong>Date:</strong> ${newBill.paymentDate}
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
                  <td>Total Bill Amount</td>
                  <td style="text-align: right;">Rs. ${newBill.totalBill.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Payment Received</td>
                  <td style="text-align: right; color: #16a34a;">Rs. ${newBill.paid.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div class="totals">
              <div class="totals-row final">
                <span>Remaining Due:</span>
                <span style="color: ${newBill.due > 0 ? '#ef4444' : '#16a34a'};">Rs. ${newBill.due.toLocaleString()}</span>
              </div>
            </div>

            <div class="footer">
              Thank you for your business!<br/>
              This is a computer generated receipt.
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
            <h1 style={{ fontSize: '28px' }}>Create Customer Bill</h1>
            <p>Record a new bill or payment for a customer</p>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => handleSave(e, false)} style={{ background: 'white', padding: '30px', borderRadius: '15px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <div style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: '20px', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: 0 }}>Bill Information</h2>
          <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>Enter customer and payment details below</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#374151', textTransform: 'uppercase' }}>Select Customer *</label>
              <SearchableSelect 
                options={customerOptions}
                value={formData.customerId}
                onChange={handleCustomerSelect}
                placeholder="Search by Name, Mobile or City..."
                height="48px"
              />
              <input 
                type="text" 
                name="customerName" 
                value={formData.customerName} 
                onChange={handleChange} 
                required 
                style={{ display: 'none' }} 
              />
            </div>

            <FormField label="Payment Date" name="paymentDate" type="date" value={formData.paymentDate} onChange={handleChange} required />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <FormField label="Customer ID" name="customerId" value={formData.customerId} onChange={() => {}} placeholder="Auto-filled" readonly />
              <FormField label="Total Bill (₹)" name="totalBill" type="number" value={formData.totalBill} onChange={handleChange} required placeholder="0" />
            </div>
            
            <FormField label="Paid Amount (₹)" name="paid" type="number" value={formData.paid} onChange={handleChange} required placeholder="0" />
          </div>
        </div>
        
        <div style={{ marginTop: '40px', padding: '30px', background: 'linear-gradient(to right, #f8fafc, #f1f5f9)', borderRadius: '15px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontWeight: '700', color: '#475569', fontSize: '16px', display: 'block' }}>Summary</span>
            <span style={{ color: '#64748b', fontSize: '14px' }}>Net outstanding amount for this transaction</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '5px' }}>Outstanding Due</span>
            <span style={{ fontSize: '32px', fontWeight: '800', color: (Number(formData.totalBill || 0) - Number(formData.paid || 0)) > 0 ? '#ef4444' : '#10b981' }}>
              ₹{(Number(formData.totalBill || 0) - Number(formData.paid || 0)).toLocaleString()}
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
export default NewCustomerBill;
