import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Calendar, User, CheckCircle, Package, IndianRupee, Printer, Clock, AlertCircle } from 'lucide-react';
import { MockService } from '../mastermodel/services/MockService';

const ViewPurchaseOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Mock fetching data based on ID
    const fetchOrderData = async () => {
      // Mock Master Data
      const mockMaster = {
        id: id,
        supplierId: 'SUP-102',
        supplierName: 'Green Farms Supply',
        orderDate: '2026-04-20',
        expiryDate: '2026-05-20',
        status: 'Pending',
        expectedTotal: 24500.00
      };

      // Mock Items Data
      const mockItems = [
        { id: 1, productName: 'DAP Fertilizer 50kg', quantity: 20, expectedPrice: 1000.00, amount: 20000.00 },
        { id: 2, productName: 'Monocrotophos 1L', quantity: 10, expectedPrice: 450.00, amount: 4500.00 }
      ];

      setOrderData(mockMaster);
      setItems(mockItems);
    };

    fetchOrderData();
  }, [id]);

  if (!orderData) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading order details...</div>;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> {status}</span>;
      case 'Pending': return <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {status}</span>;
      case 'Cancelled': return <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {status}</span>;
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
        <p>Purchase Order Details / Official Document</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 style={{ color: 'var(--primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={24} /> Purchase Order Details
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '5px' }}>
            Viewing details for Order ID: <strong style={{ color: 'white' }}>{orderData.id}</strong>
          </p>
        </div>
        <div className="no-print" style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={18} /> Print
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/purchase/orders')}>
            <ArrowLeft size={18} /> Back
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
        {/* General Details Card */}
        <div className="glass-card" style={{ padding: '25px' }}>
          <h4 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px', color: 'var(--primary)' }}>General Info</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '15px', fontSize: '0.95rem' }}>
            <div style={{ color: 'var(--text-secondary)' }}>Order ID</div>
            <div style={{ fontWeight: '600' }}>{orderData.id}</div>

            <div style={{ color: 'var(--text-secondary)' }}>Order Date</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={14} color="var(--text-secondary)" /> {orderData.orderDate}
            </div>

            <div style={{ color: 'var(--text-secondary)' }}>Expected Till</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b' }}>
              <Clock size={14} /> {orderData.expiryDate}
            </div>

            <div style={{ color: 'var(--text-secondary)' }}>Status</div>
            <div>
              {getStatusBadge(orderData.status)}
            </div>
          </div>
        </div>

        {/* Supplier Details Card */}
        <div className="glass-card" style={{ padding: '25px' }}>
          <h4 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px', color: 'var(--primary)' }}>Supplier Info</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '15px', fontSize: '0.95rem' }}>
            <div style={{ color: 'var(--text-secondary)' }}>Supplier ID</div>
            <div>{orderData.supplierId}</div>

            <div style={{ color: 'var(--text-secondary)' }}>Supplier Name</div>
            <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} color="var(--primary)" /> {orderData.supplierName}
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Products Table */}
      <div className="glass-card" style={{ padding: '25px' }}>
        <h4 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px', color: 'var(--primary)' }}>Ordered Products</h4>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.05)', textAlign: 'left' }}>
                <th style={{ padding: '12px 15px' }}>Product</th>
                <th style={{ padding: '12px 15px', textAlign: 'center' }}>Ordered Qty</th>
                <th style={{ padding: '12px 15px', textAlign: 'right' }}>Expected Price (₹)</th>
                <th style={{ padding: '12px 15px', textAlign: 'right' }}>Total Expected (₹)</th>
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
                  <td style={{ padding: '12px 15px', textAlign: 'center', fontWeight: '600', color: 'var(--primary)' }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: '12px 15px', textAlign: 'right' }}>
                    {item.expectedPrice.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 15px', textAlign: 'right', fontWeight: '600' }}>
                    {item.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                <td colSpan="3" style={{ padding: '15px', textAlign: 'right', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  Total Expected Amount:
                </td>
                <td style={{ padding: '15px', textAlign: 'right', fontWeight: '700', fontSize: '1.1rem', color: 'var(--primary)' }}>
                  ₹{orderData.expectedTotal.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewPurchaseOrder;
