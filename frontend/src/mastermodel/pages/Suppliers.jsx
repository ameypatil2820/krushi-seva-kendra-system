import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useCRUD } from '../hooks/useCRUD';
import DataTable from '../components/DataTable';
import AdminModal from '../components/AdminModal';
import FormField from '../components/FormField';
import '../styles/MasterModel.css';

const Suppliers = () => {
  const { 
    data, loading, isModalOpen, setIsModalOpen, 
    currentItem, handleAdd, handleEdit, handleDelete, handleSave 
  } = useCRUD('suppliers');

  const [formData, setFormData] = useState({
    name: '', mobile: '', contactPerson: '', email: '', 
    city: '', address: '', gstNo: '', isActive: true
  });

  useEffect(() => {
    if (currentItem) {
      setFormData(currentItem);
    } else {
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

  return (
    <div className="agro-container">
      <div className="page-header">
        <div className="page-title">
          <h1>Supplier Management</h1>
          <p>Manage your product suppliers and vendors</p>
        </div>
        <button className="btn-agro btn-primary" onClick={handleAdd}>
          <FiPlus size={20} /> Add Supplier
        </button>
      </div>

      <DataTable 
        title="Suppliers"
        columns={columns} 
        data={data} 
        onEdit={handleEdit} 
        onDelete={(item) => handleDelete(item.id)}
        onView={(item) => alert(JSON.stringify(item, null, 2))}
      />

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
            <button type="submit" className="btn-agro btn-primary">Save Supplier</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default Suppliers;
