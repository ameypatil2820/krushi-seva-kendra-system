import React, { useState, useEffect } from 'react';
import { FiPlus, FiArrowLeft, FiSave, FiX, FiInfo, FiUser, FiPhone, FiMapPin, FiMail, FiLoader } from 'react-icons/fi';
import { useCRUD } from '../hooks/useCRUD';
import DataTable from '../components/DataTable';
import FormField from '../components/FormField';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/MasterModel.css';

const Customers = () => {
  const { 
    data, loading, isDeleteOpen, setIsDeleteOpen,
    currentItem, handleAdd, handleEdit, handleView, 
    handleDeleteClick, handleConfirmDelete, handleSave 
  } = useCRUD('customers');

  const [viewMode, setViewMode] = useState('list');
  const [isFetchingPin, setIsFetchingPin] = useState(false);
  const [formData, setFormData] = useState({
    name: '', mobile: '', email: '', pinCode: '', 
    city: '', district: '', state: '', 
    address: '', gstNo: '', isActive: true
  });

  useEffect(() => {
    if (currentItem && (viewMode === 'edit' || viewMode === 'view')) {
      setFormData(currentItem);
    } else if (viewMode === 'add') {
      setFormData({
        name: '', mobile: '', email: '', pinCode: '', 
        city: '', district: '', state: '', 
        address: '', gstNo: '', isActive: true
      });
    }
  }, [currentItem, viewMode]);

  // Pin Code Auto-fill Logic
  useEffect(() => {
    const fetchPinDetails = async () => {
      if (formData.pinCode.length === 6) {
        setIsFetchingPin(true);
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${formData.pinCode}`);
          const data = await response.json();
          
          if (data[0].Status === "Success") {
            const details = data[0].PostOffice[0];
            setFormData(prev => ({
              ...prev,
              city: details.Name,
              district: details.District,
              state: details.State
            }));
          } else {
            // If pincode is wrong, clear the auto-filled fields
            setFormData(prev => ({ ...prev, city: '', district: '', state: '' }));
          }
        } catch (error) {
          console.error("Pin code fetch failed", error);
        } finally {
          setIsFetchingPin(false);
        }
      } else if (formData.pinCode.length > 0 && formData.pinCode.length < 6) {
        // Clear fields while user is typing a new pincode
        setFormData(prev => ({ ...prev, city: '', district: '', state: '' }));
      }
    };

    fetchPinDetails();
  }, [formData.pinCode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
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
    { header: 'Customer Name', accessor: 'name' },
    { header: 'Mobile', accessor: 'mobile' },
    { header: 'City', accessor: 'city' },
    { header: 'District', accessor: 'district' },
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
            <h1>Customer Management</h1>
            <p>Maintain your customer records and information</p>
          </div>
          <button className="btn-agro btn-primary" onClick={handleActionAdd}>
            <FiPlus size={20} /> Add Customer
          </button>
        </div>

        <DataTable title="Customers" columns={columns} data={data} onEdit={handleActionEdit} onDelete={handleDeleteClick} onView={handleActionView} />

        <ConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleConfirmDelete} title="Delete Customer?" message={`Are you sure you want to delete ${currentItem?.name}?`} />
      </div>
    );
  }

  if (viewMode === 'add' || viewMode === 'edit') {
    return (
      <div className="agro-container">
        <div className="page-header">
          <div className="page-title">
            <button className="btn-agro btn-outline" onClick={onBack} style={{ marginBottom: '15px', border: 'none', padding: '0', background: 'transparent' }}>
              <FiArrowLeft size={18} /> Back to Customers
            </button>
            <h1>{viewMode === 'edit' ? 'Edit Customer' : 'Add New Customer'}</h1>
          </div>
        </div>

        <div className="agro-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <form onSubmit={handleFinalSave}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', color: '#16a34a' }}>
              <FiInfo size={20} />
              <h3 style={{ margin: 0, fontSize: '18px' }}>Customer Information</h3>
            </div>
            
            <div className="form-grid">
              <FormField label="Full Name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter customer name" />
              <FormField label="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} required placeholder="Enter mobile number" />
              <FormField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Optional" />
              
              <div style={{ position: 'relative' }}>
                <FormField label="Pin Code" name="pinCode" value={formData.pinCode} onChange={handleChange} required placeholder="e.g. 415408" />
                {isFetchingPin && (
                  <div style={{ position: 'absolute', right: '10px', top: '40px', color: '#16a34a' }}>
                    <FiLoader className="animate-spin" />
                  </div>
                )}
              </div>

              <FormField label="Village / City" name="city" value={formData.city} onChange={handleChange} required placeholder="Auto-filled from Pin" />
              <FormField label="District" name="district" value={formData.district} onChange={handleChange} required placeholder="Auto-filled from Pin" />
              <FormField label="State" name="state" value={formData.state} onChange={handleChange} required placeholder="Auto-filled from Pin" />
              <FormField label="GST Number" name="gstNo" value={formData.gstNo} onChange={handleChange} placeholder="Optional" />
            </div>

            <div style={{ marginTop: '20px' }}>
              <FormField label="Full Address" name="address" type="textarea" value={formData.address} onChange={handleChange} placeholder="Optional" />
            </div>

            <div style={{ display: 'flex', gap: '24px', marginTop: '20px', padding: '20px', background: '#f9fafb', borderRadius: '12px' }}>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 0 }}>
                <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleChange} />
                <label htmlFor="isActive" style={{ marginBottom: 0 }}>Active Customer</label>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '40px', justifyContent: 'flex-end', borderTop: '1px solid #f3f4f6', paddingTop: '25px' }}>
              <button type="button" className="btn-agro btn-outline" onClick={onBack}><FiX size={18} /> Cancel</button>
              <button type="submit" className="btn-agro btn-primary" style={{ padding: '12px 35px' }}>
                <FiSave size={18} /> {viewMode === 'edit' ? 'Update Customer' : 'Save Customer'}
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
        <div className="page-header">
          <div className="page-title">
            <button className="btn-agro btn-outline" onClick={onBack} style={{ marginBottom: '15px', border: 'none', padding: '0', background: 'transparent' }}>
              <FiArrowLeft size={18} /> Back to Customers
            </button>
            <h1>Customer Profile</h1>
          </div>
          <button className="btn-agro btn-primary" onClick={onBack}>Done</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px' }}>
          <div className="agro-card" style={{ textAlign: 'center' }}>
            <div style={{ width: '100px', height: '100px', background: '#f0fdf4', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '40px', fontWeight: 'bold' }}>
              {formData.name.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ color: '#111827' }}>{formData.name}</h2>
            <div style={{ margin: '15px 0' }}>
              <span className={`badge ${formData.isActive ? 'badge-success' : 'badge-danger'}`}>{formData.isActive ? 'Active' : 'Inactive'}</span>
            </div>
            <div style={{ marginTop: '20px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: '#374151' }}>
                <FiPhone color="#16a34a" /> <span>{formData.mobile}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: '#374151' }}>
                <FiMail color="#16a34a" /> <span>{formData.email || 'No email'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#374151' }}>
                <FiMapPin color="#16a34a" /> <span>{formData.city}, {formData.district}</span>
              </div>
            </div>
          </div>

          <div className="agro-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #f3f4f6' }}>
              <FiUser size={22} color="#16a34a" />
              <h3 style={{ margin: 0, color: '#111827' }}>Personal Details</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
              <div><label style={{ color: '#6b7280', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Pin Code</label><div style={{ color: '#111827', fontWeight: '600' }}>{formData.pinCode}</div></div>
              <div><label style={{ color: '#6b7280', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Village / City</label><div style={{ color: '#111827', fontWeight: '600' }}>{formData.city}</div></div>
              <div><label style={{ color: '#6b7280', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>District</label><div style={{ color: '#111827', fontWeight: '600' }}>{formData.district}</div></div>
              <div><label style={{ color: '#6b7280', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>State</label><div style={{ color: '#111827', fontWeight: '600' }}>{formData.state}</div></div>
              <div style={{ gridColumn: 'span 2' }}><label style={{ color: '#6b7280', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>GST Number</label><div style={{ color: '#111827', fontWeight: '600' }}>{formData.gstNo || 'N/A'}</div></div>
              <div style={{ gridColumn: 'span 2' }}><label style={{ color: '#6b7280', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Full Address</label><div style={{ color: '#374151', padding: '10px', background: '#f9fafb', borderRadius: '8px' }}>{formData.address || 'N/A'}</div></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Customers;
