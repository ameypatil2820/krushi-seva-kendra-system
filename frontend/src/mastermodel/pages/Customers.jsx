import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useCRUD } from '../hooks/useCRUD';
import DataTable from '../components/DataTable';
import AdminModal from '../components/AdminModal';
import FormField from '../components/FormField';
import '../styles/MasterModel.css';

const Customers = () => {
  const { 
    data, loading, isModalOpen, setIsModalOpen, 
    currentItem, handleAdd, handleEdit, handleDelete, handleSave 
  } = useCRUD('customers');

  const [formData, setFormData] = useState({
    name: '', mobile: '', alternateMobile: '', 
    village: '', city: '', address: '', isActive: true
  });

  useEffect(() => {
    if (currentItem) {
      setFormData(currentItem);
    } else {
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
        onDelete={(item) => handleDelete(item.id)}
        onView={(item) => alert(JSON.stringify(item, null, 2))}
      />

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
            <button type="submit" className="btn-agro btn-primary">Save Customer</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default Customers;
