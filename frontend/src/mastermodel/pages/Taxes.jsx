import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useCRUD } from '../hooks/useCRUD';
import DataTable from '../components/DataTable';
import AdminModal from '../components/AdminModal';
import FormField from '../components/FormField';
import '../styles/MasterModel.css';

const Taxes = () => {
  const { 
    data, loading, isModalOpen, setIsModalOpen, 
    currentItem, handleAdd, handleEdit, handleDelete, handleSave 
  } = useCRUD('taxes');

  const [formData, setFormData] = useState({
    name: '', percentage: '', isActive: true
  });

  useEffect(() => {
    if (currentItem) {
      setFormData(currentItem);
    } else {
      setFormData({
        name: '', percentage: '', isActive: true
      });
    }
  }, [currentItem, isModalOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const columns = [
    { header: 'Tax Name', accessor: 'name' },
    { 
      header: 'Percentage (%)', 
      render: (row) => <strong>{row.percentage}%</strong>
    },
    { 
      header: 'Status', 
      render: (row) => (
        <span className={`badge ${row.isActive ? 'badge-success' : 'badge-danger'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ) 
    }
  ];

  return (
    <div className="agro-container">
      <div className="page-header">
        <div className="page-title">
          <h1>Tax Management</h1>
          <p>Configure GST and other tax rates</p>
        </div>
        <button className="btn-agro btn-primary" onClick={handleAdd}>
          <FiPlus size={20} /> Add Tax
        </button>
      </div>

      <DataTable 
        title="Taxes"
        columns={columns} 
        data={data} 
        onEdit={handleEdit} 
        onDelete={(item) => handleDelete(item.id)}
        onView={(item) => alert(JSON.stringify(item, null, 2))}
      />

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={currentItem ? 'Edit Tax' : 'Add New Tax'}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }}>
          <div className="form-grid">
            <FormField label="Tax Name" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. GST 18%" />
            <FormField label="Percentage (%)" name="percentage" type="number" value={formData.percentage} onChange={handleChange} required placeholder="e.g. 18" />
          </div>
          <FormField label="Active Status" name="isActive" isToggle value={formData.isActive} onChange={handleChange} />
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-agro btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-agro btn-primary">Save Tax</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default Taxes;
