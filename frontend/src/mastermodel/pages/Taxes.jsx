import React, { useState, useEffect } from 'react';
import { FiPlus, FiArrowLeft, FiSave, FiX, FiPercent, FiInfo } from 'react-icons/fi';
import { useCRUD } from '../hooks/useCRUD';
import DataTable from '../components/DataTable';
import FormField from '../components/FormField';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/MasterModel.css';

const Taxes = () => {
  const { 
    data, loading, isDeleteOpen, setIsDeleteOpen,
    currentItem, handleAdd, handleEdit, handleView, 
    handleDeleteClick, handleConfirmDelete, handleSave 
  } = useCRUD('taxes');

  const [viewMode, setViewMode] = useState('list');
  const [formData, setFormData] = useState({ name: '', rate: '', isActive: true });

  useEffect(() => {
    if (currentItem && (viewMode === 'edit' || viewMode === 'view')) {
      setFormData(currentItem);
    } else if (viewMode === 'add') {
      setFormData({ name: '', rate: '', isActive: true });
    }
  }, [currentItem, viewMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onBack = () => setViewMode('list');

  const handleActionAdd = () => { handleAdd(); setViewMode('add'); };
  const handleActionEdit = (item) => { handleEdit(item); setViewMode('edit'); };
  const handleActionView = (item) => { handleView(item); setViewMode('view'); };

  const handleFinalSave = async (e) => {
    e.preventDefault();
    await handleSave(formData);
    setViewMode('list');
  };

  const columns = [
    { header: 'Tax Name', accessor: 'name' },
    { header: 'Rate (%)', render: (row) => `${row.rate}%` },
    { 
      header: 'Status', 
      render: (row) => (
        <span className={`badge ${row.isActive ? 'badge-success' : 'badge-danger'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ) 
    }
  ];

  if (viewMode === 'list') {
    return (
      <div className="agro-container">
        <div className="page-header">
          <div className="page-title">
            <h1>Tax Management</h1>
            <p>Configure GST rates and other taxes</p>
          </div>
          <button className="btn-agro btn-primary" onClick={handleActionAdd}>
            <FiPlus size={20} /> Add Tax
          </button>
        </div>
        <DataTable title="Taxes" columns={columns} data={data} onEdit={handleActionEdit} onDelete={handleDeleteClick} onView={handleActionView} />
        <ConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleConfirmDelete} title="Delete Tax?" message={`Delete ${currentItem?.name}?`} />
      </div>
    );
  }

  if (viewMode === 'add' || viewMode === 'edit') {
    return (
      <div className="agro-container">
        <div className="page-header">
          <div className="page-title">
            <button className="btn-agro btn-outline" onClick={onBack} style={{ marginBottom: '15px', border: 'none', padding: '0', background: 'transparent' }}>
              <FiArrowLeft size={18} /> Back to Taxes
            </button>
            <h1>{viewMode === 'edit' ? 'Edit Tax Rate' : 'Add New Tax'}</h1>
          </div>
        </div>
        <div className="agro-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <form onSubmit={handleFinalSave}>
            <FormField label="Tax Name" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. GST 18%" />
            <FormField label="Rate (%)" name="rate" type="number" value={formData.rate} onChange={handleChange} required placeholder="e.g. 18" />
            <div style={{ marginTop: '20px', padding: '15px', background: '#f9fafb', borderRadius: '10px' }}>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 0 }}>
                <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleChange} />
                <label htmlFor="isActive" style={{ marginBottom: 0 }}>Active Tax Rate</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '30px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-agro btn-outline" onClick={onBack}><FiX /> Cancel</button>
              <button type="submit" className="btn-agro btn-primary"><FiSave /> Save Tax</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (viewMode === 'view') {
    return (
      <div className="agro-container">
        <div className="page-header">
          <div className="page-title">
            <button className="btn-agro btn-outline" onClick={onBack} style={{ marginBottom: '15px', border: 'none', padding: '0', background: 'transparent' }}>
              <FiArrowLeft size={18} /> Back to Taxes
            </button>
            <h1>Tax Configuration Details</h1>
          </div>
          <button className="btn-agro btn-primary" onClick={onBack}>Done</button>
        </div>
        <div className="agro-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '80px', background: '#f0fdf4', color: '#16a34a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>
              <FiPercent />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ color: '#111827', marginBottom: '5px' }}>{formData.name}</h2>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a', marginBottom: '10px' }}>{formData.rate}%</div>
              <span className={`badge ${formData.isActive ? 'badge-success' : 'badge-danger'}`}>{formData.isActive ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default Taxes;
