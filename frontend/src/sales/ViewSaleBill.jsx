import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar, User, Package, IndianRupee, Printer, CheckCircle, Clock } from 'lucide-react';
import { MockService } from '../mastermodel/services/MockService';

const ViewSaleBill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [billData, setBillData] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Mock fetching data based on ID
    const fetchBillData = async () => {
      // Mock Master Data
      const mockMaster = {
        id: id,
        customerId: 'CUS-501',
        customerName: 'Ramesh Patil',
        billDate: '2026-04-20',
        paymentType: 'Cash',
        status: 'Paid',
        totalAmount: 5000.00,
        taxAmount: 400.00,
        grandTotal: 5400.00,
        paidAmount: 5400.00,
        dueAmount: 0
      };

      // Mock Items Data
      const mockItems = [
        { id: 1, productName: 'Urea Fertilizer 50kg', batchNo: 'B-120', quantity: 10, salePrice: 400.00, taxPercent: 5, taxAmount: 200.00, amount: 4200.00 },
        { id: 2, productName: 'Pesticide XYZ', batchNo: 'P-09', quantity: 2, salePrice: 500.00, taxPercent: 20, taxAmount: 200.00, amount: 1200.00 }
      ];

      setBillData(mockMaster);
      setItems(mockItems);
    };

    fetchBillData();
  }, [id]);

  if (!billData) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading bill details...</div>;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid': return <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> {status}</span>;
      case 'Partial': return <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {status}</span>;
      case 'Unpaid': return <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {status}</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="animate-fade print-area">
      <style>
        {`
          @media screen {
            .print-only-header { display: none !important; }
          }
          @media print {
            .print-only-header { display: block !important; margin-bottom: 30px; text-align: center; border-bottom: 2px solid #000; padding-bottom: 15px; }
            .print-only-header h1 { margin: 0 0 5px 0; font-size: 24px; color: #000; letter-spacing: 1px; }
            .print-only-header p { margin: 0; font-size: 14px; color: #444; }
          }
        `}
      </style>

      {/* Company Header - Only visible in Print */}
      <div className="print-only-header">
        <h1>KRUSHI SEVA KENDRA</h1>
        <p>Sale Bill / Tax Invoice</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 style={{ color: 'var(--primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={24} /> Sale Bill Details
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '5px' }}>
            Viewing details for Bill ID: <strong style={{ color: 'white' }}>{billData.id}</strong>
          </p>
        </div>
        <div className="no-print" style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={18} /> Print
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/sales/bills')}>
            <ArrowLeft size={18} /> Back
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
        {/* General Details Card */}
        <div className="glass-card" style={{ padding: '25px' }}>
          <h4 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px', color: 'var(--primary)' }}>General Info</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '15px', fontSize: '0.95rem' }}>
            <div style={{ color: 'var(--text-secondary)' }}>Bill ID</div>
            <div style={{ fontWeight: '600' }}>{billData.id}</div>

            <div style={{ color: 'var(--text-secondary)' }}>Bill Date</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={14} color="var(--text-secondary)" /> {billData.billDate}
            </div>

            <div style={{ color: 'var(--text-secondary)' }}>Payment Mode</div>
            <div>{billData.paymentType}</div>

            <div style={{ color: 'var(--text-secondary)' }}>Status</div>
            <div>{getStatusBadge(billData.status)}</div>
          </div>
        </div>

        {/* Customer Details Card */}
        <div className="glass-card" style={{ padding: '25px' }}>
          <h4 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px', color: 'var(--primary)' }}>Customer Info</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '15px', fontSize: '0.95rem' }}>
            <div style={{ color: 'var(--text-secondary)' }}>Customer ID</div>
            <div>{billData.customerId}</div>

            <div style={{ color: 'var(--text-secondary)' }}>Customer Name</div>
            <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} color="var(--primary)" /> {billData.customerName}
            </div>
          </div>
        </div>
      </div>

      {/* Bill Products Table */}
      <div className="glass-card" style={{ padding: '25px' }}>
        <h4 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px', color: 'var(--primary)' }}>Billed Products</h4>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.05)', textAlign: 'left' }}>
                <th style={{ padding: '12px 15px' }}>Product</th>
                <th style={{ padding: '12px 15px' }}>Batch</th>
                <th style={{ padding: '12px 15px', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '12px 15px', textAlign: 'right' }}>Rate (₹)</th>
                <th style={{ padding: '12px 15px', textAlign: 'right' }}>Tax (%)</th>
                <th style={{ padding: '12px 15px', textAlign: 'right' }}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '12px 15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                      <Package size={16} color="var(--text-secondary)" />
                      {item.productName}
                    </div>
                  </td>
                  <td style={{ padding: '12px 15px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {item.batchNo}
                  </td>
                  <td style={{ padding: '12px 15px', textAlign: 'center', fontWeight: '600' }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: '12px 15px', textAlign: 'right' }}>
                    {item.salePrice.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 15px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                    {item.taxPercent}%
                  </td>
                  <td style={{ padding: '12px 15px', textAlign: 'right', fontWeight: '600' }}>
                    {item.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                <td colSpan="5" style={{ padding: '15px', textAlign: 'right', color: 'var(--text-secondary)' }}>Sub Total:</td>
                <td style={{ padding: '15px', textAlign: 'right', fontWeight: '600' }}>₹{billData.totalAmount.toFixed(2)}</td>
              </tr>
              <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                <td colSpan="5" style={{ padding: '15px', textAlign: 'right', color: 'var(--text-secondary)' }}>Total Tax:</td>
                <td style={{ padding: '15px', textAlign: 'right', fontWeight: '600' }}>₹{billData.taxAmount.toFixed(2)}</td>
              </tr>
              <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                <td colSpan="5" style={{ padding: '15px', textAlign: 'right', fontWeight: '700', fontSize: '1.1rem', color: 'var(--primary)' }}>Grand Total:</td>
                <td style={{ padding: '15px', textAlign: 'right', fontWeight: '700', fontSize: '1.1rem', color: 'var(--primary)' }}>₹{billData.grandTotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="5" style={{ padding: '15px', textAlign: 'right', color: 'var(--success)', fontWeight: '600' }}>Paid Amount:</td>
                <td style={{ padding: '15px', textAlign: 'right', color: 'var(--success)', fontWeight: '600' }}>₹{billData.paidAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="5" style={{ padding: '15px', textAlign: 'right', color: 'var(--danger)', fontWeight: '600' }}>Due Amount:</td>
                <td style={{ padding: '15px', textAlign: 'right', color: 'var(--danger)', fontWeight: '600' }}>₹{billData.dueAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewSaleBill;
