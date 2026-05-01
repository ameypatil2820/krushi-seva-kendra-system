import React, { useState, useMemo } from 'react';
import { Package, Layers, AlertTriangle, Search, CheckCircle, XCircle } from 'lucide-react';
import '../mastermodel/styles/MasterModel.css';

// Mock Data
const mockStockMaster = [
  { id: 'SM001', productName: 'Urea 45%', totalQuantity: 1000, totalAvailable: 850 },
  { id: 'SM002', productName: 'DAP Fertilizer', totalQuantity: 500, totalAvailable: 200 },
  { id: 'SM003', productName: 'Pesticide X', totalQuantity: 200, totalAvailable: 0 },
];

const mockStockBatches = [
  { id: 'B001', productName: 'Urea 45%', batchNo: 'UR-2023-1', purchaseId: 'PO-101', quantityAvailable: 500, mrp: 300, costPrice: 250, expireDate: '2026-10-15' },
  { id: 'B002', productName: 'Urea 45%', batchNo: 'UR-2023-2', purchaseId: 'PO-105', quantityAvailable: 350, mrp: 320, costPrice: 260, expireDate: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }, // expires in 15 days
  { id: 'B003', productName: 'DAP Fertilizer', batchNo: 'DAP-A1', purchaseId: 'PO-102', quantityAvailable: 200, mrp: 1200, costPrice: 1000, expireDate: '2027-01-01' },
  { id: 'B004', productName: 'Pesticide X', batchNo: 'PX-99', purchaseId: 'PO-099', quantityAvailable: 10, mrp: 500, costPrice: 400, expireDate: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }, // expired 10 days ago
];

const getExpiryStatus = (expireDate) => {
  if (!expireDate) return { status: 'Unknown', type: 'unknown' };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expireDate);
  const diffTime = exp - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { status: 'Expired - Sale Blocked', type: 'danger', days: diffDays };
  } else if (diffDays <= 30) {
    return { status: `Expiring in ${diffDays} days`, type: 'warning', days: diffDays };
  } else {
    return { status: 'Safe', type: 'success', days: diffDays };
  }
};

const StockManagement = () => {
  const [activeTab, setActiveTab] = useState('master');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMaster = useMemo(() => {
    return mockStockMaster.filter(item => 
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const filteredBatches = useMemo(() => {
    return mockStockBatches.filter(item => 
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.batchNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const expiryAlerts = useMemo(() => {
    return mockStockBatches.map(batch => ({ ...batch, expiryInfo: getExpiryStatus(batch.expireDate) }))
      .filter(batch => batch.expiryInfo.type === 'danger' || batch.expiryInfo.type === 'warning')
      .sort((a, b) => a.expiryInfo.days - b.expiryInfo.days);
  }, []);

  const renderMasterTable = () => (
    <div className="table-responsive">
      <table className="agro-table">
        <thead>
          <tr>
            <th>Master ID</th>
            <th>Product Name</th>
            <th>Total Quantity</th>
            <th>Total Available Stock</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredMaster.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td style={{ fontWeight: '600' }}>{item.productName}</td>
              <td>{item.totalQuantity}</td>
              <td>
                <span style={{ fontWeight: '700', color: item.totalAvailable > 0 ? '#16a34a' : '#ef4444' }}>
                  {item.totalAvailable}
                </span>
              </td>
              <td>
                {item.totalAvailable > 0 ? (
                  <span className="badge badge-success"><CheckCircle size={12} style={{marginRight: '4px'}}/> In Stock</span>
                ) : (
                  <span className="badge badge-danger"><XCircle size={12} style={{marginRight: '4px'}}/> Out of Stock</span>
                )}
              </td>
            </tr>
          ))}
          {filteredMaster.length === 0 && (
            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>No records found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderBatchesTable = () => (
    <div className="table-responsive">
      <table className="agro-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Batch No</th>
            <th>Purchase ID</th>
            <th>Qty Available</th>
            <th>Cost Price (₹)</th>
            <th>MRP (₹)</th>
            <th>Expire Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredBatches.map(item => {
            const expiry = getExpiryStatus(item.expireDate);
            return (
              <tr key={item.id}>
                <td style={{ fontWeight: '600' }}>{item.productName}</td>
                <td><span style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', fontSize: '13px' }}>{item.batchNo}</span></td>
                <td>{item.purchaseId}</td>
                <td><span style={{ fontWeight: '700' }}>{item.quantityAvailable}</span></td>
                <td>{item.costPrice}</td>
                <td>{item.mrp}</td>
                <td>{item.expireDate}</td>
                <td>
                  <span className={`badge badge-${expiry.type}`} style={{ fontSize: '12px' }}>
                    {expiry.status}
                  </span>
                </td>
              </tr>
            );
          })}
          {filteredBatches.length === 0 && (
            <tr><td colSpan="8" style={{ textAlign: 'center', padding: '30px' }}>No batches found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderExpiryTracking = () => (
    <div className="table-responsive">
      <table className="agro-table">
        <thead>
          <tr>
            <th>Alert Type</th>
            <th>Product Name</th>
            <th>Batch No</th>
            <th>Qty Remaining</th>
            <th>Expire Date</th>
            <th>Action Required</th>
          </tr>
        </thead>
        <tbody>
          {expiryAlerts.map(item => (
            <tr key={item.id} style={{ background: item.expiryInfo.type === 'danger' ? '#fef2f2' : '#fffbeb' }}>
              <td>
                <span className={`badge badge-${item.expiryInfo.type}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', width: 'max-content' }}>
                  <AlertTriangle size={14} />
                  {item.expiryInfo.type === 'danger' ? 'Expired' : 'Expiring Soon'}
                </span>
              </td>
              <td style={{ fontWeight: '600' }}>{item.productName}</td>
              <td>{item.batchNo}</td>
              <td style={{ fontWeight: '700' }}>{item.quantityAvailable}</td>
              <td>{item.expireDate}</td>
              <td>
                {item.expiryInfo.type === 'danger' ? (
                  <span style={{ color: '#ef4444', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <XCircle size={16} /> Blocked for Sale
                  </span>
                ) : (
                  <span style={{ color: '#d97706', fontWeight: '600' }}>
                    Clear stock in {item.expiryInfo.days} days
                  </span>
                )}
              </td>
            </tr>
          ))}
          {expiryAlerts.length === 0 && (
            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>No expiry alerts at the moment. All stock is safe.</td></tr>
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
            <h1>Stock Management</h1>
            <p>Monitor stock levels, manage batches, and track product expirations</p>
          </div>
        </div>
        
        {activeTab !== 'expiry' && (
          <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '8px 16px', borderRadius: '12px', border: '1px solid #e5e7eb', width: '300px' }}>
            <Search size={18} color="#9ca3af" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', outline: 'none', marginLeft: '10px', width: '100%', fontSize: '14px' }}
            />
          </div>
        )}
      </div>

      <div className="agro-card" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
          <button 
            onClick={() => setActiveTab('master')}
            style={{
              padding: '16px 24px', border: 'none', background: activeTab === 'master' ? 'white' : 'transparent',
              color: activeTab === 'master' ? '#16a34a' : '#6b7280', fontWeight: '700', fontSize: '15px',
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
              borderTop: activeTab === 'master' ? '3px solid #16a34a' : '3px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            <Package size={18} /> Stock Master
          </button>
          <button 
            onClick={() => setActiveTab('batches')}
            style={{
              padding: '16px 24px', border: 'none', background: activeTab === 'batches' ? 'white' : 'transparent',
              color: activeTab === 'batches' ? '#16a34a' : '#6b7280', fontWeight: '700', fontSize: '15px',
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
              borderTop: activeTab === 'batches' ? '3px solid #16a34a' : '3px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            <Layers size={18} /> Stock Child (Batches)
          </button>
          <button 
            onClick={() => setActiveTab('expiry')}
            style={{
              padding: '16px 24px', border: 'none', background: activeTab === 'expiry' ? 'white' : 'transparent',
              color: activeTab === 'expiry' ? '#ef4444' : '#6b7280', fontWeight: '700', fontSize: '15px',
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
              borderTop: activeTab === 'expiry' ? '3px solid #ef4444' : '3px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            <AlertTriangle size={18} /> Expiry Tracking
            {expiryAlerts.length > 0 && (
              <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', marginLeft: '5px' }}>
                {expiryAlerts.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '20px' }}>
          {activeTab === 'master' && renderMasterTable()}
          {activeTab === 'batches' && renderBatchesTable()}
          {activeTab === 'expiry' && renderExpiryTracking()}
        </div>
      </div>
    </div>
  );
};

export default StockManagement;
