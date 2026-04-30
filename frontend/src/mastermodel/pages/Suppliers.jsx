import React, { useState, useEffect } from 'react';
import { Plus, ArrowLeft, Save, X, Info, User, Phone, MapPin, Mail } from 'lucide-react';
import { useCRUD } from '../hooks/useCRUD';
import DataTable from '../components/DataTable';
import FormField from '../components/FormField';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/MasterModel.css';

const Suppliers = () => {
  const { 
    data, loading, isDeleteOpen, setIsDeleteOpen,
    currentItem, handleAdd, handleEdit, handleView, 
    handleDeleteClick, handleConfirmDelete, handleSave 
  } = useCRUD('suppliers');

  const [viewMode, setViewMode] = useState('list'); // 'list', 'add', 'edit', 'view'
  const [formData, setFormData] = useState({
    name: '', mobile: '', contactPerson: '', email: '', 
    city: '', address: '', gstNo: '', isActive: true
  });

  // Sync formData when editing or adding
  useEffect(() => {
    if (currentItem && (viewMode === 'edit' || viewMode === 'view')) {
      setFormData(currentItem);
    } else if (viewMode === 'add') {
      setFormData({
        name: '', mobile: '', contactPerson: '', email: '', 
        city: '', address: '', gstNo: '', isActive: true
      });
    }
  }, [currentItem, viewMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const onBack = () => setViewMode('list');

  const handleActionAdd = () => {
    handleAdd();
    setViewMode('add');
  };

  const handleActionEdit = (item) => {
    handleEdit(item);
    setViewMode('edit');
  };

  const handleActionView = (item) => {
    handleView(item);
    setViewMode('view');
  };

  const handleFinalSave = async (e) => {
    e.preventDefault();
    await handleSave(formData);
    setViewMode('list');
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

  // --- RENDERING LIST VIEW ---
  if (viewMode === 'list') {
    return (
      <div className="agro-container">
        <div className="page-header">
          <div className="page-title">
            <h1>Supplier Management</h1>
            <p>Manage your product suppliers and vendors</p>
          </div>
          <button className="btn-agro btn-primary" onClick={handleActionAdd}>
            <Plus size={20} /> Add Supplier
          </button>
        </div>

        <DataTable 
          title="Suppliers"
          columns={columns} 
          data={data} 
          onEdit={handleActionEdit} 
          onDelete={handleDeleteClick}
          onView={handleActionView}
        />

        <ConfirmModal 
          isOpen={isDeleteOpen} 
          onClose={() => setIsDeleteOpen(false)} 
          onConfirm={handleConfirmDelete} 
          title="Delete Supplier?" 
          message={`Are you sure you want to delete ${currentItem?.name}? This action cannot be undone.`} 
        />
      </div>
    );
  }

  // --- RENDERING ADD/EDIT FORM ---
  if (viewMode === 'add' || viewMode === 'edit') {
    return (
      <div className="agro-container">
        <div className="page-header">
          <div className="page-title">
            <button className="btn-agro btn-outline" onClick={onBack} style={{ marginBottom: '15px', border: 'none', padding: '0', background: 'transparent' }}>
              <ArrowLeft size={18} /> Back to Suppliers
            </button>
            <h1>{viewMode === 'edit' ? 'Edit Supplier' : 'Add New Supplier'}</h1>
          </div>
        </div>

        <div className="agro-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <form onSubmit={handleFinalSave}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', color: '#16a34a' }}>
              <Info size={20} />
              <h3 style={{ margin: 0, fontSize: '18px' }}>Supplier Basic Information</h3>
            </div>
            
            <div className="form-grid">
              <FormField label="Supplier Name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter supplier name" />
              <FormField label="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} required placeholder="Enter mobile number" />
              <FormField label="Contact Person" name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="Person to contact" />
              <FormField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="e.g. supplier@example.com" />
              <FormField label="City" name="city" value={formData.city} onChange={handleChange} required placeholder="e.g. Kolhapur" />
              <FormField label="GST Number" name="gstNo" value={formData.gstNo} onChange={handleChange} placeholder="15-digit GSTIN" />
            </div>

            <div style={{ marginTop: '20px' }}>
              <FormField label="Full Address" name="address" type="textarea" value={formData.address} onChange={handleChange} required placeholder="Enter complete business address" />
            </div>

            <div style={{ display: 'flex', gap: '24px', marginTop: '20px', padding: '20px', background: '#f9fafb', borderRadius: '12px' }}>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 0 }}>
                <input 
                  type="checkbox" 
                  name="isActive" 
                  id="isActive"
                  checked={formData.isActive} 
                  onChange={handleChange} 
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <label htmlFor="isActive" style={{ marginBottom: 0, cursor: 'pointer' }}>Set as Active Supplier</label>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '40px', justifyContent: 'flex-end', borderTop: '1px solid #f3f4f6', paddingTop: '25px' }}>
              <button type="button" className="btn-agro btn-outline" onClick={onBack} style={{ padding: '12px 25px' }}>
                <X size={18} /> Cancel
              </button>
              <button type="submit" className="btn-agro btn-primary" style={{ padding: '12px 35px' }}>
                <Save size={18} /> {viewMode === 'edit' ? 'Update Supplier' : 'Save Supplier'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDERING VIEW DETAILS ---
  if (viewMode === 'view') {
    return (
      <div className="agro-container">
        <div className="page-header">
          <div className="page-title">
            <button className="btn-agro btn-outline" onClick={onBack} style={{ marginBottom: '15px', border: 'none', padding: '0', background: 'transparent' }}>
              <ArrowLeft size={18} /> Back to Suppliers
            </button>
            <h1>Supplier Profile</h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-agro btn-primary" onClick={onBack}>
              Done
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px' }}>
          {/* Sidebar Info */}
          <div className="agro-card" style={{ textAlign: 'center' }}>
            <div style={{ width: '100px', height: '100px', background: '#f0fdf4', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '40px', fontWeight: 'bold' }}>
              {formData.name.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ marginBottom: '5px', color: '#111827' }}>{formData.name}</h2>
            <div style={{ marginBottom: '20px' }}>
              <span className={`badge ${formData.isActive ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '14px', padding: '6px 15px' }}>
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div style={{ marginTop: '30px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', color: '#374151' }}>
                <Phone size={18} color="#16a34a" />
                <span style={{ fontSize: '15px', fontWeight: '500' }}>{formData.mobile}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', color: '#374151' }}>
                <Mail size={18} color="#16a34a" />
                <span style={{ fontSize: '15px', fontWeight: '500' }}>{formData.email || 'No email provided'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#374151' }}>
                <MapPin size={18} color="#16a34a" />
                <span style={{ fontSize: '15px', fontWeight: '500' }}>{formData.city}</span>
              </div>
            </div>
          </div>

          {/* Main Details */}
          <div className="agro-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #f3f4f6' }}>
              <User size={22} color="#16a34a" />
              <h3 style={{ margin: 0, color: '#111827', fontSize: '20px' }}>Business Information</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div>
                <label style={{ display: 'block', color: '#6b7280', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Contact Person</label>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{formData.contactPerson || 'N/A'}</div>
              </div>
              <div>
                <label style={{ display: 'block', color: '#6b7280', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>GST Number</label>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{formData.gstNo || 'N/A'}</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', color: '#6b7280', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Full Address</label>
                <div style={{ fontSize: '16px', fontWeight: '500', color: '#374151', lineHeight: '1.6', background: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>{formData.address}</div>
              </div>
              <div>
                <label style={{ display: 'block', color: '#6b7280', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Registered On</label>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{new Date(formData.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Suppliers;
