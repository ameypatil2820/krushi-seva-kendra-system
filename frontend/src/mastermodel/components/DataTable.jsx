import React from 'react';
<<<<<<< HEAD
import { FiEdit2, FiTrash2, FiEye, FiSearch, FiFilter } from 'react-icons/fi';
=======
import { Pencil, Trash2, Eye, Search } from 'lucide-react';
>>>>>>> 9f1c9438dd26883529e4fc1f585163a0c4e6f6bc

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
<<<<<<< HEAD
      <div className="page-header" style={{ marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
          <div className="search-box" style={{ position: 'relative', flex: 1, maxWidth: '450px' }}>
            <FiSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
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
            <FiFilter style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', zIndex: 1 }} />
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
=======
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <div className="search-box" style={{ position: 'relative', width: '300px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input 
            type="text" 
            placeholder={`Search ${title}...`} 
            className="form-control" 
            style={{ paddingLeft: '38px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
>>>>>>> 9f1c9438dd26883529e4fc1f585163a0c4e6f6bc
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
<<<<<<< HEAD
                      <button className="btn-agro btn-outline" style={{ padding: '8px', borderRadius: '8px' }} onClick={() => onView(row)} title="View">
                        <FiEye size={18} color="#3b82f6" />
                      </button>
                      <button className="btn-agro btn-outline" style={{ padding: '8px', borderRadius: '8px' }} onClick={() => onEdit(row)} title="Edit">
                        <FiEdit2 size={18} color="#16a34a" />
                      </button>
                      <button className="btn-agro btn-outline" style={{ padding: '8px', borderRadius: '8px' }} onClick={() => onDelete(row)} title="Delete">
                        <FiTrash2 size={18} color="#ef4444" />
=======
                      <button className="btn-agro btn-outline" style={{ padding: '6px' }} onClick={() => onView(row)}>
                        <Eye size={16} color="#3b82f6" />
                      </button>
                      <button className="btn-agro btn-outline" style={{ padding: '6px' }} onClick={() => onEdit(row)}>
                        <Pencil size={16} color="#16a34a" />
                      </button>
                      <button className="btn-agro btn-outline" style={{ padding: '6px' }} onClick={() => onDelete(row)}>
                        <Trash2 size={16} color="#ef4444" />
>>>>>>> 9f1c9438dd26883529e4fc1f585163a0c4e6f6bc
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                  <div style={{ marginBottom: '10px' }}><FiSearch size={32} /></div>
                  No data found matching your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="pagination" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>Showing {data.length} results</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-agro btn-outline" disabled>Previous</button>
          <button className="btn-agro btn-outline" disabled>Next</button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
