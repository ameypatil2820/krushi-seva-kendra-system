import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { FiPlus, FiArrowLeft, FiSave, FiX, FiLayers, FiCheckCircle } from 'react-icons/fi';
=======
import { Plus } from 'lucide-react';
>>>>>>> 9f1c9438dd26883529e4fc1f585163a0c4e6f6bc
import { useCRUD } from '../hooks/useCRUD';
import DataTable from '../components/DataTable';
import FormField from '../components/FormField';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/MasterModel.css';

const Categories = () => {
  const { 
    data, loading, isDeleteOpen, setIsDeleteOpen,
    currentItem, handleAdd, handleEdit, handleView, 
    handleDeleteClick, handleConfirmDelete, handleSave 
  } = useCRUD('categories');

  const [viewMode, setViewMode] = useState('list');
  const [formData, setFormData] = useState({ name: '', description: '', isActive: true });

  useEffect(() => {
    if (currentItem && (viewMode === 'edit' || viewMode === 'view')) {
      setFormData(currentItem);
    } else if (viewMode === 'add') {
      setFormData({ name: '', description: '', isActive: true });
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
    { header: 'Category Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    { 
      header: 'Status', 
      render: (row) => (
        <span className={`badge ${row.isActive ? 'badge-success' : 'badge-danger'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ) 
    }
  ];

<<<<<<< HEAD
  if (viewMode === 'list') {
    return (
      <div className="agro-container">
        <div className="page-header">
          <div className="page-title">
            <h1>Categories</h1>
            <p>Manage product groupings and classifications</p>
=======
  const categoryFields = [
    { label: 'Category Name', accessor: 'name' },
    { label: 'Description', accessor: 'description' },
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
          <h1>Category Management</h1>
          <p>Organize your products into logical categories</p>
        </div>
        <button className="btn-agro btn-primary" onClick={handleAdd}>
          <Plus size={20} /> Add Category
        </button>
      </div>

      <DataTable 
        title="Categories"
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
        title={currentItem ? 'Edit Category' : 'Add New Category'}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }}>
          <FormField label="Category Name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter category name (e.g. Fertilizers)" />
          <FormField label="Description" name="description" type="textarea" value={formData.description} onChange={handleChange} placeholder="Brief description of this category" />
          <FormField label="Active Status" name="isActive" isToggle value={formData.isActive} onChange={handleChange} />
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-agro btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-agro btn-primary">
              {currentItem ? 'Update Category' : 'Save Category'}
            </button>
>>>>>>> 9f1c9438dd26883529e4fc1f585163a0c4e6f6bc
          </div>
          <button className="btn-agro btn-primary" onClick={handleActionAdd}>
            <FiPlus size={20} /> Add Category
          </button>
        </div>
        <DataTable title="Categories" columns={columns} data={data} onEdit={handleActionEdit} onDelete={handleDeleteClick} onView={handleActionView} />
        <ConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleConfirmDelete} title="Delete Category?" message={`Delete ${currentItem?.name}?`} />
      </div>
    );
  }

  if (viewMode === 'add' || viewMode === 'edit') {
    return (
      <div className="agro-container">
        <div className="page-header">
          <div className="page-title">
            <button className="btn-agro btn-outline" onClick={onBack} style={{ marginBottom: '15px', border: 'none', padding: '0', background: 'transparent' }}>
              <FiArrowLeft size={18} /> Back to Categories
            </button>
            <h1>{viewMode === 'edit' ? 'Edit Category' : 'Add Category'}</h1>
          </div>
        </div>
        <div className="agro-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <form onSubmit={handleFinalSave}>
            <FormField label="Category Name" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Fertilizers" />
            <FormField label="Description" name="description" type="textarea" value={formData.description} onChange={handleChange} placeholder="What kind of products are in this category?" />
            <div style={{ marginTop: '20px', padding: '15px', background: '#f9fafb', borderRadius: '10px' }}>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 0 }}>
                <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleChange} />
                <label htmlFor="isActive" style={{ marginBottom: 0 }}>Active Category</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '30px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-agro btn-outline" onClick={onBack}><FiX /> Cancel</button>
              <button type="submit" className="btn-agro btn-primary"><FiSave /> Save Category</button>
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
              <FiArrowLeft size={18} /> Back to Categories
            </button>
            <h1>Category Details</h1>
          </div>
          <button className="btn-agro btn-primary" onClick={onBack}>Done</button>
        </div>
        <div className="agro-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
            <div style={{ width: '80px', height: '80px', background: '#f0fdf4', color: '#16a34a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>
              <FiLayers />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ color: '#111827', marginBottom: '10px' }}>{formData.name}</h2>
              <span className={`badge ${formData.isActive ? 'badge-success' : 'badge-danger'}`}>{formData.isActive ? 'Active' : 'Inactive'}</span>
              <div style={{ marginTop: '25px', padding: '20px', background: '#f9fafb', borderRadius: '12px' }}>
                <label style={{ display: 'block', color: '#6b7280', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Description</label>
                <div style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6' }}>{formData.description || 'No description provided.'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default Categories;
