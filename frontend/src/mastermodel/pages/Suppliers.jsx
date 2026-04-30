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
        <div className="agro-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="agro-card-header" style={{ padding: '24px 30px', marginBottom: 0 }}>
            <div>
              <h2>Supplier Management</h2>
              <p>Manage your product suppliers and vendors</p>
            </div>
            <button className="btn-agro btn-primary" onClick={handleActionAdd}>
              <Plus size={20} /> Add Supplier
            </button>
          </div>
          
          <div style={{ padding: '30px' }}>
            <DataTable 
              title="Suppliers"
              columns={columns} 
              data={data} 
              onEdit={handleActionEdit} 
              onDelete={handleDeleteClick} 
              onView={handleActionView} 
            />
          </div>
        </div>

        <ConfirmModal 
          isOpen={isDeleteOpen} 
          onClose={() => setIsDeleteOpen(false)} 
          onConfirm={handleConfirmDelete} 
          title="Delete Supplier?" 
          message={`Are you sure you want to delete ${currentItem?.name}?`} 
        />
      </div>
    );
  }

  if (viewMode === 'add' || viewMode === 'edit') {
    return (
      <div className="agro-container">
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <form onSubmit={handleFinalSave} className="agro-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="agro-card-header" style={{ padding: '30px', background: 'white' }}>
              <div>
                <h2 style={{ fontSize: '24px' }}>{viewMode === 'edit' ? 'Update Supplier Profile' : 'Add New Supplier'}</h2>
                <p>Manage details for your vendor or product supplier</p>
              </div>
              <button type="button" className="btn-agro btn-outline" onClick={onBack}>
                <ArrowLeft size={18} /> Back to List
              </button>
            </div>

            <div style={{ padding: '40px' }}>
              <div className="form-section-title" style={{ marginBottom: '25px' }}>
                <User size={18} />
                <h3 style={{ fontSize: '14px', margin: 0 }}>Business Information</h3>
              </div>

              <div className="form-grid">
                <FormField label="Supplier Name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter supplier name" />
                <FormField label="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} required placeholder="Enter mobile number" />
                <FormField label="Contact Person" name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="Person to contact" />
                <FormField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="e.g. supplier@example.com" />
                <FormField label="City" name="city" value={formData.city} onChange={handleChange} required placeholder="e.g. Kolhapur" />
                <FormField label="GST Number" name="gstNo" value={formData.gstNo} onChange={handleChange} placeholder="15-digit GSTIN" />
              </div>

              <div style={{ marginTop: '25px' }}>
                <FormField label="Full Business Address" name="address" type="textarea" value={formData.address} onChange={handleChange} required placeholder="Enter complete business address" />
              </div>

              <div style={{ marginTop: '25px', padding: '20px', background: 'var(--primary-soft)', borderRadius: '15px', border: '1px solid #dcfce7' }}>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 0 }}>
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                  />
                  <label htmlFor="isActive" style={{ marginBottom: 0, cursor: 'pointer', fontWeight: '700', fontSize: '14px', textTransform: 'none', color: 'var(--primary)' }}>Set as Active Supplier</label>
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
        <div style={{ maxWidth: '1000px', margin: '40px auto 40px' }}>
          <div className="agro-card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Unified Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '24px 30px', 
              borderBottom: '1px solid #f3f4f6',
              background: 'white'
            }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: 0 }}>Supplier Profile</h2>
                <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '14px' }}>Business and contact specifications for this vendor</p>
              </div>
              <button className="btn-agro btn-outline" onClick={onBack} style={{ padding: '10px 25px', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <X size={18} /> Close Profile
              </button>
            </div>

            <div style={{ display: 'flex', minHeight: '500px' }}>
              {/* Profile Sidebar */}
              <div style={{ 
                width: '320px', 
                background: '#f9fafb', 
                padding: '40px 30px', 
                borderRight: '1px solid #f3f4f6',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{ 
                  width: '100px', 
                  height: '100px', 
                  background: 'white', 
                  color: '#16a34a', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '40px', 
                  fontWeight: '800', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                  border: '4px solid #f0fdf4',
                  marginBottom: '20px'
                }}>
                  {formData.name.charAt(0).toUpperCase()}
                </div>
                
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0', textAlign: 'center' }}>{formData.name}</h2>
                <span className={`badge ${formData.isActive ? 'badge-success' : 'badge-danger'}`} style={{ padding: '6px 16px', fontSize: '13px', borderRadius: '20px' }}>
                  {formData.isActive ? 'Active Supplier' : 'Inactive'}
                </span>

                <div style={{ marginTop: '40px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <Phone size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase' }}>Mobile</div>
                      <div style={{ fontSize: '15px', color: '#374151', fontWeight: '600' }}>{formData.mobile}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <Mail size={18} />
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase' }}>Email</div>
                      <div style={{ fontSize: '14px', color: '#374151', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{formData.email || 'Not provided'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase' }}>Location</div>
                      <div style={{ fontSize: '15px', color: '#374151', fontWeight: '600' }}>{formData.city}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Info Area */}
              <div style={{ flex: 1, padding: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={18} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: 0 }}>Business Information</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px 20px' }}>
                  <div style={{ padding: '16px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                    <label style={{ display: 'block', color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Contact Person</label>
                    <div style={{ fontSize: '16px', color: '#111827', fontWeight: '700' }}>{formData.contactPerson || 'N/A'}</div>
                  </div>
                  
                  <div style={{ padding: '16px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                    <label style={{ display: 'block', color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>GST Number</label>
                    <div style={{ fontSize: '16px', color: '#111827', fontWeight: '700' }}>{formData.gstNo || 'N/A'}</div>
                  </div>

                  <div style={{ gridColumn: 'span 2', padding: '20px', background: '#f9fafb', borderRadius: '12px', border: '1px dashed #e5e7eb' }}>
                    <label style={{ display: 'block', color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '10px' }}>Full Business Address</label>
                    <div style={{ fontSize: '15px', color: '#374151', lineHeight: '1.7', fontWeight: '500' }}>
                      {formData.address}
                    </div>
                  </div>

                  <div style={{ padding: '16px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                    <label style={{ display: 'block', color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Registered On</label>
                    <div style={{ fontSize: '16px', color: '#111827', fontWeight: '700' }}>{new Date(formData.createdAt).toLocaleDateString()}</div>
                  </div>
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

export default Suppliers;
