import React from 'react';
import { FiEdit2, FiTrash2, FiEye, FiSearch } from 'react-icons/fi';

const DataTable = ({ columns, data, onEdit, onDelete, onView, title }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredData = data.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="agro-card">
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <div className="search-box" style={{ position: 'relative', width: '300px' }}>
          <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input 
            type="text" 
            placeholder={`Search ${title}...`} 
            className="form-control" 
            style={{ paddingLeft: '38px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                      <button className="btn-agro btn-outline" style={{ padding: '6px' }} onClick={() => onView(row)}>
                        <FiEye size={16} color="#3b82f6" />
                      </button>
                      <button className="btn-agro btn-outline" style={{ padding: '6px' }} onClick={() => onEdit(row)}>
                        <FiEdit2 size={16} color="#16a34a" />
                      </button>
                      <button className="btn-agro btn-outline" style={{ padding: '6px' }} onClick={() => onDelete(row)}>
                        <FiTrash2 size={16} color="#ef4444" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  No data found matching your search.
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
