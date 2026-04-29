import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useCRUD } from '../hooks/useCRUD';
import DataTable from '../components/DataTable';
import AdminModal from '../components/AdminModal';
import FormField from '../components/FormField';
import ConfirmModal from '../components/ConfirmModal';
import ViewDetailsModal from '../components/ViewDetailsModal';
import '../styles/MasterModel.css';

const Categories = () => {
  const { 
    data, loading, isModalOpen, setIsModalOpen, 
    isViewOpen, setIsViewOpen, isDeleteOpen, setIsDeleteOpen,
    currentItem, handleAdd, handleEdit, handleView, 
    handleDeleteClick, handleConfirmDelete, handleSave 
  } = useCRUD('categories');

  const [formData, setFormData] = useState({
    name: '', description: '', isActive: true
  });

  useEffect(() => {
    if (currentItem && isModalOpen) {
      setFormData(currentItem);
    } else if (!isModalOpen) {
      setFormData({
        name: '', description: '', isActive: true
      });
    }
  }, [currentItem, isModalOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          <FiPlus size={20} /> Add Category
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
          </div>
        </form>
      </AdminModal>

      {/* View Modal */}
      <ViewDetailsModal 
        isOpen={isViewOpen} 
        onClose={() => setIsViewOpen(false)} 
        title="Category Details" 
        data={currentItem} 
        fields={categoryFields} 
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={handleConfirmDelete} 
        title="Delete Category?" 
        message={`Are you sure you want to delete the ${currentItem?.name} category? This may affect products linked to it.`} 
      />
    </div>
  );
};

export default Categories;
