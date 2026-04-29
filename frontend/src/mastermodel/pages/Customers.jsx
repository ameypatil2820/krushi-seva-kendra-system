import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useCRUD } from '../hooks/useCRUD';
import DataTable from '../components/DataTable';
import AdminModal from '../components/AdminModal';
import FormField from '../components/FormField';
import ConfirmModal from '../components/ConfirmModal';
import ViewDetailsModal from '../components/ViewDetailsModal';
import '../styles/MasterModel.css';

const Customers = () => {
  const { 
    data, loading, isModalOpen, setIsModalOpen, 
    isViewOpen, setIsViewOpen, isDeleteOpen, setIsDeleteOpen,
    currentItem, handleAdd, handleEdit, handleView, 
    handleDeleteClick, handleConfirmDelete, handleSave 
  } = useCRUD('customers');

  const [formData, setFormData] = useState({
    name: '', mobile: '', alternateMobile: '', 
    village: '', city: '', address: '', isActive: true
  });

  useEffect(() => {
    if (currentItem && isModalOpen) {
      setFormData(currentItem);
    } else if (!isModalOpen) {
      setFormData({
        name: '', mobile: '', alternateMobile: '', 
        village: '', city: '', address: '', isActive: true
      });
    }
  }, [currentItem, isModalOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const columns = [
    { header: 'Customer Name', accessor: 'name' },
    { header: 'Mobile', accessor: 'mobile' },
    { header: 'Village', accessor: 'village' },
    { header: 'City', accessor: 'city' },
    { 
      header: 'Status', 
      render: (row) => (
        <span className={`badge ${row.isActive ? 'badge-success' : 'badge-danger'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ) 
    }
  ];

  const customerFields = [
    { label: 'Customer Name', accessor: 'name' },
    { label: 'Mobile Number', accessor: 'mobile' },
    { label: 'Alternate Mobile', accessor: 'alternateMobile' },
    { label: 'Village', accessor: 'village' },
    { label: 'City', accessor: 'city' },
    { label: 'Address', accessor: 'address' },
    { 
      label: 'Status', 
      render: (row) => row.isActive ? 'Active' : 'Inactive' 
    },
    { 
      label: 'Member Since', 
      render: (row) => new Date(row.createdAt).toLocaleDateString() 
    }
  ];

  return (
    <div className="agro-container">
      <div className="page-header">
        <div className="page-title">
          <h1>Customer Management</h1>
          <p>Maintain your customer records and information</p>
        </div>
        <button className="btn-agro btn-primary" onClick={handleAdd}>
          <FiPlus size={20} /> Add Customer
        </button>
      </div>

      <DataTable 
        title="Customers"
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
        title={currentItem ? 'Edit Customer' : 'Add New Customer'}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }}>
          <div className="form-grid">
            <FormField label="Customer Name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter customer name" />
            <FormField label="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} required placeholder="Enter mobile number" />
            <FormField label="Alt Mobile" name="alternateMobile" value={formData.alternateMobile} onChange={handleChange} placeholder="Optional" />
            <FormField label="Village" name="village" value={formData.village} onChange={handleChange} required placeholder="Enter village" />
            <FormField label="City" name="city" value={formData.city} onChange={handleChange} required placeholder="Enter city" />
          </div>
          <FormField label="Full Address" name="address" type="textarea" value={formData.address} onChange={handleChange} required placeholder="Enter full address" />
          <FormField label="Active Status" name="isActive" isToggle value={formData.isActive} onChange={handleChange} />
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-agro btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-agro btn-primary">
              {currentItem ? 'Update Customer' : 'Save Customer'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* View Modal */}
      <ViewDetailsModal 
        isOpen={isViewOpen} 
        onClose={() => setIsViewOpen(false)} 
        title="Customer Details" 
        data={currentItem} 
        fields={customerFields} 
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={handleConfirmDelete} 
        title="Delete Customer?" 
        message={`Are you sure you want to delete ${currentItem?.name}? All records for this customer will be removed.`} 
      />
    </div>
  );
};

export default Customers;
