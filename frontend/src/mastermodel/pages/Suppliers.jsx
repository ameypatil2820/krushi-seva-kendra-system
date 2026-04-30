import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useCRUD } from '../hooks/useCRUD';
import DataTable from '../components/DataTable';
import AdminModal from '../components/AdminModal';
import FormField from '../components/FormField';
import ConfirmModal from '../components/ConfirmModal';
import ViewDetailsModal from '../components/ViewDetailsModal';
import '../styles/MasterModel.css';

const Suppliers = () => {
  const { 
    data, loading, isModalOpen, setIsModalOpen, 
    isViewOpen, setIsViewOpen, isDeleteOpen, setIsDeleteOpen,
    currentItem, handleAdd, handleEdit, handleView, 
    handleDeleteClick, handleConfirmDelete, handleSave 
  } = useCRUD('suppliers');

  const [formData, setFormData] = useState({
    name: '', mobile: '', contactPerson: '', email: '', 
    city: '', address: '', gstNo: '', isActive: true
  });

  useEffect(() => {
    if (currentItem && isModalOpen) {
      setFormData(currentItem);
    } else if (!isModalOpen) {
      setFormData({
        name: '', mobile: '', contactPerson: '', email: '', 
        city: '', address: '', gstNo: '', isActive: true
      });
    }
  }, [currentItem, isModalOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const columns = [
    { header: 'Supplier Name', accessor: 'name' },
    { header: 'Mobile', accessor: 'mobile' },
    { header: 'City', accessor: 'city' },
    { header: 'GST No', accessor: 'gstNo' },
    { 
      header: 'Status', 
      render: (row) => (
        <span className={`badge ${row.isActive ? 'badge-success' : 'badge-danger'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ) 
    }
  ];

  const supplierFields = [
    { label: 'Supplier Name', accessor: 'name' },
    { label: 'Mobile Number', accessor: 'mobile' },
    { label: 'Contact Person', accessor: 'contactPerson' },
    { label: 'Email', accessor: 'email' },
    { label: 'GST Number', accessor: 'gstNo' },
    { label: 'City', accessor: 'city' },
    { label: 'Address', accessor: 'address' },
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
          <h1>Supplier Management</h1>
          <p>Manage your product suppliers and vendors</p>
        </div>
        <button className="btn-agro btn-primary" onClick={handleAdd}>
          <Plus size={20} /> Add Supplier
        </button>
      </div>

      <DataTable 
        title="Suppliers"
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
        title={currentItem ? 'Edit Supplier' : 'Add New Supplier'}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }}>
          <div className="form-grid">
            <FormField label="Supplier Name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter supplier name" />
            <FormField label="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} required placeholder="Enter mobile number" />
            <FormField label="Contact Person" name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="Optional" />
            <FormField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Optional" />
            <FormField label="City" name="city" value={formData.city} onChange={handleChange} required placeholder="Enter city" />
            <FormField label="GST Number" name="gstNo" value={formData.gstNo} onChange={handleChange} placeholder="Enter GSTIN" />
          </div>
          <FormField label="Full Address" name="address" type="textarea" value={formData.address} onChange={handleChange} required placeholder="Enter full address" />
          <FormField label="Active Status" name="isActive" isToggle value={formData.isActive} onChange={handleChange} />
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-agro btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-agro btn-primary">
              {currentItem ? 'Update Supplier' : 'Save Supplier'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* View Modal */}
      <ViewDetailsModal 
        isOpen={isViewOpen} 
        onClose={() => setIsViewOpen(false)} 
        title="Supplier Details" 
        data={currentItem} 
        fields={supplierFields} 
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={handleConfirmDelete} 
        title="Delete Supplier?" 
        message={`Are you sure you want to delete ${currentItem?.name}? This action cannot be undone.`} 
      />
    </div>
  );
};

export default Suppliers;
