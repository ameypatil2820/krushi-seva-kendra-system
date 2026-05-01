import React, { useState, useMemo } from 'react';
import { Package, Search, CheckCircle, XCircle } from 'lucide-react';
import '../mastermodel/styles/MasterModel.css';

const mockStockMaster = [
  { id: 'SM001', productName: 'Urea 45%', totalQuantity: 1000, totalAvailable: 850 },
  { id: 'SM002', productName: 'DAP Fertilizer', totalQuantity: 500, totalAvailable: 200 },
  { id: 'SM003', productName: 'Pesticide X', totalQuantity: 200, totalAvailable: 0 },
];

const StockMaster = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMaster = useMemo(() => {
    return mockStockMaster.filter(item => 
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="agro-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="page-title-area">
          <div className="page-title">
            <h1>Stock Master</h1>
            <p>Overall product stock levels across all batches</p>
          </div>
        </div>
        
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
      </div>

      <div className="agro-card" style={{ padding: '20px' }}>
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
      </div>
    </div>
  );
};

export default StockMaster;
