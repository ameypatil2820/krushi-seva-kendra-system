import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Users, Truck, Search, Plus } from 'lucide-react';
import '../mastermodel/styles/MasterModel.css';

// Initial Mock Data
const initialCustomerBilling = [
  { id: 'CB-001', customerId: 'CUST-101', customerName: 'Ramesh Patil', totalBill: 15000, paid: 10000, due: 5000, paymentDate: '2026-05-01' },
  { id: 'CB-002', customerId: 'CUST-102', customerName: 'Suresh Deshmukh', totalBill: 8000, paid: 8000, due: 0, paymentDate: '2026-04-28' },
  { id: 'CB-003', customerId: 'CUST-103', customerName: 'Anil Jadhav', totalBill: 25000, paid: 15000, due: 10000, paymentDate: '2026-04-25' },
];

const initialSupplierBilling = [
  { id: 'SB-001', supplierId: 'SUP-201', supplierName: 'Agro Fertilizers Ltd', totalPurchase: 50000, paid: 20000, due: 30000, date: '2026-04-15', paymentMode: 'Bank Transfer' },
  { id: 'SB-002', supplierId: 'SUP-202', supplierName: 'Kisan Seeds Pvt', totalPurchase: 30000, paid: 30000, due: 0, date: '2026-04-20', paymentMode: 'UPI' },
  { id: 'SB-003', supplierId: 'SUP-203', supplierName: 'Global Pesticides', totalPurchase: 45000, paid: 10000, due: 35000, date: '2026-05-02', paymentMode: 'Cheque' },
];

const BillingDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('customer');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [customerBills, setCustomerBills] = useState([]);
  const [supplierBills, setSupplierBills] = useState([]);

  useEffect(() => {
    const localCust = JSON.parse(localStorage.getItem('ksk_customer_bills') || '[]');
    setCustomerBills([...initialCustomerBilling, ...localCust]);

    const localSupp = JSON.parse(localStorage.getItem('ksk_supplier_bills') || '[]');
    setSupplierBills([...initialSupplierBilling, ...localSupp]);
  }, []);

  const filteredCustomerBilling = useMemo(() => {
    return customerBills.filter(item => 
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.customerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, customerBills]);

  const filteredSupplierBilling = useMemo(() => {
    return supplierBills.filter(item => 
      item.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.supplierId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, supplierBills]);

  const handleAddClick = () => {
    if (activeTab === 'customer') {
      navigate('/billing/customer/new');
    } else {
      navigate('/billing/supplier/new');
    }
  };

  const renderCustomerBilling = () => (
    <div className="table-responsive">
      <table className="agro-table">
        <thead>
          <tr>
            <th>Billing ID</th>
            <th>Customer Name / ID</th>
            <th>Total Bill (₹)</th>
            <th>Paid Amount (₹)</th>
            <th>Due Amount (₹)</th>
            <th>Last Payment Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomerBilling.map(item => (
            <tr key={item.id}>
              <td><span style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', fontSize: '13px' }}>{item.id}</span></td>
              <td>
                <div style={{ fontWeight: '600' }}>{item.customerName}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.customerId}</div>
              </td>
              <td style={{ fontWeight: '600' }}>{item.totalBill.toLocaleString()}</td>
              <td style={{ color: '#16a34a', fontWeight: '600' }}>{item.paid.toLocaleString()}</td>
              <td style={{ color: item.due > 0 ? '#ef4444' : '#6b7280', fontWeight: '700' }}>{item.due.toLocaleString()}</td>
              <td>{item.paymentDate}</td>
              <td>
                {item.due <= 0 ? (
                  <span className="badge badge-success">Cleared</span>
                ) : (
                  <span className="badge badge-warning">Pending Due</span>
                )}
              </td>
            </tr>
          ))}
          {filteredCustomerBilling.length === 0 && (
            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>No records found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderSupplierBilling = () => (
    <div className="table-responsive">
      <table className="agro-table">
        <thead>
          <tr>
            <th>Billing ID</th>
            <th>Supplier Name / ID</th>
            <th>Total Purchase (₹)</th>
            <th>Paid Amount (₹)</th>
            <th>Due Amount (₹)</th>
            <th>Date</th>
            <th>Payment Mode</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredSupplierBilling.map(item => (
            <tr key={item.id}>
              <td><span style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', fontSize: '13px' }}>{item.id}</span></td>
              <td>
                <div style={{ fontWeight: '600' }}>{item.supplierName}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.supplierId}</div>
              </td>
              <td style={{ fontWeight: '600' }}>{item.totalPurchase.toLocaleString()}</td>
              <td style={{ color: '#16a34a', fontWeight: '600' }}>{item.paid.toLocaleString()}</td>
              <td style={{ color: item.due > 0 ? '#ef4444' : '#6b7280', fontWeight: '700' }}>{item.due.toLocaleString()}</td>
              <td>{item.date}</td>
              <td><span className="badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>{item.paymentMode}</span></td>
              <td>
                {item.due <= 0 ? (
                  <span className="badge badge-success">Paid</span>
                ) : (
                  <span className="badge badge-danger">Outstanding</span>
                )}
              </td>
            </tr>
          ))}
          {filteredSupplierBilling.length === 0 && (
            <tr><td colSpan="8" style={{ textAlign: 'center', padding: '30px' }}>No records found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="agro-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="page-title-area">
          <div className="page-title">
            <h1>Billing & Payments</h1>
            <p>Track customer payments, supplier dues, and overall billing status</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '8px 16px', borderRadius: '12px', border: '1px solid #e5e7eb', width: '250px' }}>
            <Search size={18} color="#9ca3af" />
            <input 
              type="text" 
              placeholder="Search ID or Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', outline: 'none', marginLeft: '10px', width: '100%', fontSize: '14px' }}
            />
          </div>
          
          <button className="btn-agro btn-primary" onClick={handleAddClick}>
            <Plus size={20} /> Add New Bill
          </button>
        </div>
      </div>

      <div className="agro-card" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
          <button 
            onClick={() => setActiveTab('customer')}
            style={{
              padding: '16px 24px', border: 'none', background: activeTab === 'customer' ? 'white' : 'transparent',
              color: activeTab === 'customer' ? '#0ea5e9' : '#6b7280', fontWeight: '700', fontSize: '15px',
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
              borderTop: activeTab === 'customer' ? '3px solid #0ea5e9' : '3px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            <Users size={18} /> Customer Billing
          </button>
          <button 
            onClick={() => setActiveTab('supplier')}
            style={{
              padding: '16px 24px', border: 'none', background: activeTab === 'supplier' ? 'white' : 'transparent',
              color: activeTab === 'supplier' ? '#f59e0b' : '#6b7280', fontWeight: '700', fontSize: '15px',
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
              borderTop: activeTab === 'supplier' ? '3px solid #f59e0b' : '3px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            <Truck size={18} /> Supplier Billing
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '20px' }}>
          {activeTab === 'customer' && renderCustomerBilling()}
          {activeTab === 'supplier' && renderSupplierBilling()}
        </div>
      </div>
    </div>
  );
};

export default BillingDashboard;
