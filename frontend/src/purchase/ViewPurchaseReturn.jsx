import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Calendar, User, FileText, AlertCircle, Package, IndianRupee, Printer } from 'lucide-react';
import { MockService } from '../mastermodel/services/MockService';

const ViewPurchaseReturn = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [returnData, setReturnData] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Mock fetching data based on ID
    // In a real app, you would fetch from API: fetch(`/api/returns/${id}`)
    const fetchReturnData = async () => {
      // Mock Master Data
      const mockMaster = {
        id: id,
        purchaseId: 'PUR-501',
        supplierId: 'SUP-101',
        supplierName: 'Agro Traders Pvt Ltd',
        returnDate: '2026-04-28',
        totalAmount: 1200.50,
        reason: 'Damaged Products',
        status: 'Processed'
      };

      // Mock Items Data
      const mockItems = [
        { id: 1, productName: 'Urea Fertilizer 50kg', batchNo: 'B-2309', quantity: 1, rate: 450.00, taxAmount: 22.50, amount: 472.50 },
        { id: 2, productName: 'Glyphosate Weedicide 1L', batchNo: 'G-1102', quantity: 2, rate: 350.00, taxAmount: 28.00, amount: 728.00 }
      ];

      setReturnData(mockMaster);
      setItems(mockItems);
    };

    fetchReturnData();
  }, [id]);

  if (!returnData) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading return details...</div>;
  }

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
        <p>Purchase Return Receipt / Documentation</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 style={{ color: '#ef4444', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <RotateCcw size={24} /> Purchase Return Details
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '5px' }}>
            Viewing details for Return ID: <strong style={{ color: 'white' }}>{returnData.id}</strong>
          </p>
        </div>
        <div className="no-print" style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={18} /> Print
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/purchase/returns')}>
            <ArrowLeft size={18} /> Back
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
        {/* General Details Card */}
        <div className="glass-card" style={{ padding: '25px' }}>
          <h4 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px', color: 'var(--primary)' }}>General Info</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '15px', fontSize: '0.95rem' }}>
            <div style={{ color: 'var(--text-secondary)' }}>Return ID</div>
            <div style={{ fontWeight: '600' }}>{returnData.id}</div>

            <div style={{ color: 'var(--text-secondary)' }}>Return Date</div>
            <div>{returnData.returnDate}</div>

            <div style={{ color: 'var(--text-secondary)' }}>Reason</div>
            <div style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={14} /> {returnData.reason}
            </div>

            <div style={{ color: 'var(--text-secondary)' }}>Status</div>
            <div>
              <span className="badge badge-success">{returnData.status}</span>
            </div>
          </div>
        </div>

        {/* Supplier Details Card */}
        <div className="glass-card" style={{ padding: '25px' }}>
          <h4 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px', color: 'var(--primary)' }}>Supplier & Bill Info</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '15px', fontSize: '0.95rem' }}>
            <div style={{ color: 'var(--text-secondary)' }}>Original Bill ID</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} color="var(--primary)" /> {returnData.purchaseId}
            </div>

            <div style={{ color: 'var(--text-secondary)' }}>Supplier ID</div>
            <div>{returnData.supplierId}</div>

            <div style={{ color: 'var(--text-secondary)' }}>Supplier Name</div>
            <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} color="var(--primary)" /> {returnData.supplierName}
            </div>
          </div>
        </div>
      </div>

      {/* Returned Products Table */}
      <div className="glass-card" style={{ padding: '25px' }}>
        <h4 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px', color: 'var(--primary)' }}>Returned Products</h4>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.05)', textAlign: 'left' }}>
                <th style={{ padding: '12px 15px' }}>Product</th>
                <th style={{ padding: '12px 15px' }}>Batch</th>
                <th style={{ padding: '12px 15px', textAlign: 'center' }}>Qty Returned</th>
                <th style={{ padding: '12px 15px', textAlign: 'right' }}>Rate (₹)</th>
                <th style={{ padding: '12px 15px', textAlign: 'right' }}>Tax (₹)</th>
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
                  <td style={{ padding: '12px 15px', textAlign: 'center', fontWeight: '600', color: '#ef4444' }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: '12px 15px', textAlign: 'right' }}>
                    {item.rate.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 15px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                    {item.taxAmount.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 15px', textAlign: 'right', fontWeight: '600' }}>
                    {item.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                <td colSpan="5" style={{ padding: '15px', textAlign: 'right', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  Total Return Amount:
                </td>
                <td style={{ padding: '15px', textAlign: 'right', fontWeight: '700', fontSize: '1.1rem', color: '#ef4444' }}>
                  ₹{returnData.totalAmount.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewPurchaseReturn;
