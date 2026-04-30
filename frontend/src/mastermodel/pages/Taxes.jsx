import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useCRUD } from '../hooks/useCRUD';
import DataTable from '../components/DataTable';
import AdminModal from '../components/AdminModal';
import FormField from '../components/FormField';
import ConfirmModal from '../components/ConfirmModal';
import ViewDetailsModal from '../components/ViewDetailsModal';
import '../styles/MasterModel.css';

const Taxes = () => {
  const { 
    data, loading, isModalOpen, setIsModalOpen, 
    isViewOpen, setIsViewOpen, isDeleteOpen, setIsDeleteOpen,
    currentItem, handleAdd, handleEdit, handleView, 
    handleDeleteClick, handleConfirmDelete, handleSave 
  } = useCRUD('taxes');

  const [formData, setFormData] = useState({
    name: '', percentage: '', isActive: true
  });

  useEffect(() => {
    if (currentItem && isModalOpen) {
      setFormData(currentItem);
    } else if (!isModalOpen) {
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

  const taxFields = [
    { label: 'Tax Name', accessor: 'name' },
    { label: 'Percentage', render: (row) => `${row.percentage}%` },
    { 
      label: 'Status', 
      render: (row) => row.isActive ? 'Active' : 'Inactive' 
    },
    { 
      label: 'Created Date', 
      render: (row) => new Date(row.createdAt).toLocaleDateString() 
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
          <Plus size={20} /> Add Tax
        </button>
      </div>

      <DataTable 
        title="Taxes"
        columns={columns} 
        data={data} 
        onEdit={handleEdit} 
        onDelete={handleDeleteClick}
        onView={handleView}
      />

      {/* Add/Edit Modal */}
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
            <button type="submit" className="btn-agro btn-primary">
              {currentItem ? 'Update Tax' : 'Save Tax'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* View Modal */}
      <ViewDetailsModal 
        isOpen={isViewOpen} 
        onClose={() => setIsViewOpen(false)} 
        title="Tax Details" 
        data={currentItem} 
        fields={taxFields} 
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={handleConfirmDelete} 
        title="Delete Tax?" 
        message={`Are you sure you want to delete ${currentItem?.name}? This may affect products using this tax rate.`} 
      />
    </div>
  );
};

export default Taxes;
