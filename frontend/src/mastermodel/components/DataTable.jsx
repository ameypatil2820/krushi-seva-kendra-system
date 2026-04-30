import React from 'react';
import { Edit2, Trash2, Eye, Search, Filter } from 'lucide-react';

const DataTable = ({ columns, data, onEdit, onDelete, onView, title }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const filteredData = data.filter(item => {
    const matchesSearch = Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && item.isActive === true) || 
      (statusFilter === 'inactive' && item.isActive === false);
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="agro-card">
      <div className="page-header" style={{ marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
          <div className="search-box" style={{ position: 'relative', flex: 1, maxWidth: '450px' }}>
            <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input 
              type="text" 
              placeholder={`Search in ${title}...`} 
              className="form-control" 
              style={{ paddingLeft: '42px', height: '45px', borderRadius: '10px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div style={{ position: 'relative', width: '180px' }}>
            <Filter style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', zIndex: 1 }} />
            <select 
              className="form-control" 
              style={{ paddingLeft: '42px', height: '45px', borderRadius: '10px', appearance: 'none', cursor: 'pointer' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="agro-table-container">
        <table className="agro-table">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col.header}</th>
              ))}
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button className="btn-agro btn-outline" style={{ padding: '8px', borderRadius: '8px' }} onClick={() => onView(row)} title="View">
                        <Eye size={18} color="#3b82f6" />
                      </button>
                      <button className="btn-agro btn-outline" style={{ padding: '8px', borderRadius: '8px' }} onClick={() => onEdit(row)} title="Edit">
                        <Edit2 size={18} color="#16a34a" />
                      </button>
                      <button className="btn-agro btn-outline" style={{ padding: '8px', borderRadius: '8px' }} onClick={() => onDelete(row)} title="Delete">
                        <Trash2 size={18} color="#ef4444" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                  <div style={{ marginBottom: '10px' }}><Search size={32} /></div>
                  No data found matching your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
