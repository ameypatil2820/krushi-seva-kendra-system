import React, { useState, useEffect } from 'react';
import { Plus, ArrowLeft, Save, X, Percent } from 'lucide-react';
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
        <div className="agro-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="agro-card-header" style={{ padding: '24px 30px', marginBottom: 0 }}>
            <div>
              <h2>Tax Management</h2>
              <p>Configure GST rates and other taxes</p>
            </div>
            <button className="btn-agro btn-primary" onClick={handleActionAdd}>
              <Plus size={20} /> Add Tax
            </button>
          </div>
          
          <div style={{ padding: '30px' }}>
            <DataTable 
              title="Taxes" 
              columns={columns} 
              data={data} 
              onEdit={handleActionEdit} 
              onDelete={handleDeleteClick} 
            />
          </div>
        </div>

        <ConfirmModal 
          isOpen={isDeleteOpen} 
          onClose={() => setIsDeleteOpen(false)} 
          onConfirm={handleConfirmDelete} 
          title="Delete Tax?" 
          message={`Are you sure you want to delete ${currentItem?.name}?`} 
        />
      </div>
    );
  }

  if (viewMode === 'add' || viewMode === 'edit') {
    return (
      <div className="agro-container">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <form onSubmit={handleFinalSave} className="agro-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="agro-card-header" style={{ padding: '30px', background: 'white' }}>
              <div>
                <h2 style={{ fontSize: '24px' }}>{viewMode === 'edit' ? 'Update Tax Configuration' : 'Register New Tax Rate'}</h2>
                <p>Configure GST and other tax rates</p>
              </div>
              <button type="button" className="btn-agro btn-outline" onClick={onBack}>
                <ArrowLeft size={18} /> Back to List
              </button>
            </div>

            <div style={{ padding: '40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-section-title" style={{ marginBottom: '10px' }}>
                  <Percent size={18} />
                  <h3 style={{ fontSize: '14px', margin: 0 }}>Tax Details</h3>
                </div>
                
                <FormField label="Tax Name" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. GST 18%" />
                <FormField label="Rate (%)" name="rate" type="number" value={formData.rate} onChange={handleChange} required placeholder="e.g. 18" />
                
                <div style={{ marginTop: '10px', padding: '20px', background: 'var(--primary-soft)', borderRadius: '15px', border: '1px solid #dcfce7' }}>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 0 }}>
                    <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleChange} style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }} />
                    <label htmlFor="isActive" style={{ marginBottom: 0, cursor: 'pointer', textTransform: 'none', fontWeight: '700', fontSize: '14px', color: 'var(--primary)' }}>Active Tax Rate</label>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ 
              padding: '25px 40px', 
              background: '#f9fafb', 
              borderTop: '1px solid var(--border-light)', 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '15px' 
            }}>
              <button type="button" className="btn-agro btn-outline" onClick={onBack} style={{ minWidth: '120px' }}>
                <X size={18} /> Cancel
              </button>
              <button type="submit" className="btn-agro btn-primary" style={{ minWidth: '180px' }}>
                <Save size={18} /> Save Tax
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (viewMode === 'view') {
    return (
      <div className="agro-container">
        <div style={{ maxWidth: '700px', margin: '40px auto 0' }}>
          <div className="agro-card" style={{ marginBottom: '24px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: 0 }}>Tax Details</h2>
                <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>Full configuration details of the tax rate</p>
              </div>
              <button className="btn-agro btn-primary" onClick={onBack} style={{ padding: '10px 30px' }}>Done</button>
            </div>
          </div>

          <div className="agro-card">
            <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: '#f0fdf4', color: '#16a34a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>
                <Percent />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '24px', color: '#111827', margin: 0 }}>{formData.name}</h2>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#16a34a', marginTop: '4px' }}>Rate: {formData.rate}%</div>
                  </div>
                  <span className={`badge ${formData.isActive ? 'badge-success' : 'badge-danger'}`}>
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default Taxes;
