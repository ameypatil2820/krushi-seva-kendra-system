import React, { useState, useEffect } from 'react';
import { Plus as FiPlus, ArrowLeft as FiArrowLeft, Save as FiSave, X as FiX, User as FiUser, Phone as FiPhone, MapPin as FiMapPin, Mail as FiMail, Loader as FiLoader, CheckCircle as FiCheckCircle, Info as FiInfo, Home as FiHome } from 'lucide-react';
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
  const [pinSuccess, setPinSuccess] = useState(false);
  const [villageList, setVillageList] = useState([]);
  const [formData, setFormData] = useState({
    name: '', mobile: '', email: '', pinCode: '', 
    city: '', district: '', state: '', 
    address: '', gstNo: '', isActive: true
  });

  useEffect(() => {
    if (currentItem && (viewMode === 'edit' || viewMode === 'view')) {
      setFormData(currentItem);
      setPinSuccess(true);
    } else if (viewMode === 'add') {
      resetForm();
    }
  }, [currentItem, viewMode]);

  const resetForm = () => {
    setFormData({
      name: '', mobile: '', email: '', pinCode: '', 
      city: '', district: '', state: '', 
      address: '', gstNo: '', isActive: true
    });
    setVillageList([]);
    setPinSuccess(false);
    setIsFetchingPin(false);
  };

  // Improved Pin Code Logic: Instant clear and update
  useEffect(() => {
    const fetchPinDetails = async () => {
      const pin = formData.pinCode;
      
      if (pin.length === 6) {
        setIsFetchingPin(true);
        setPinSuccess(false);
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
          const data = await response.json();
          
          if (data[0].Status === "Success") {
            const offices = data[0].PostOffice;
            setVillageList(offices.map(o => o.Name));
            
            const details = offices[0];
            setFormData(prev => ({
              ...prev,
              city: details.Name,
              district: details.District,
              state: details.State
            }));
            setPinSuccess(true);
          } else {
            clearLocationFields();
          }
        } catch (error) {
          console.error("Pin code fetch failed", error);
          clearLocationFields();
        } finally {
          setIsFetchingPin(false);
        }
      } else {
        if (pin.length > 0) clearLocationFields();
      }
    };

    fetchPinDetails();
  }, [formData.pinCode]);

  const clearLocationFields = () => {
    setVillageList([]);
    setPinSuccess(false);
    setFormData(prev => ({ ...prev, city: '', district: '', state: '' }));
  };

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
          <div className="page-title-area">
            <div className="page-title">
              <h1>Customer Directory</h1>
              <p>Maintain detailed records of your farmers and customers</p>
            </div>
            <button className="btn-agro btn-primary" onClick={handleActionAdd}>
              <FiPlus size={20} /> Add Customer
            </button>
          </div>
        </div>

        <DataTable title="Customers" columns={columns} data={data} onEdit={handleActionEdit} onDelete={handleDeleteClick} onView={handleActionView} />

        <ConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleConfirmDelete} title="Delete Customer?" message={`Are you sure you want to delete ${currentItem?.name}?`} />
      </div>
    );
  }

  if (viewMode === 'add' || viewMode === 'edit') {
    return (
      <div className="agro-container">
        <div style={{ maxWidth: '1000px', margin: '40px auto 0' }}>
          <form onSubmit={handleFinalSave} className="agro-card">
            <div className="agro-card-header">
              <h2>{viewMode === 'edit' ? 'Update Customer Profile' : 'New Customer Registration'}</h2>
              <p>Fill in the details to {viewMode === 'edit' ? 'update' : 'register'} a customer record in your directory</p>
            </div>
            <div className="form-grid">
              {/* Column 1: Personal Info */}
              <div>
                <div className="form-section-title">
                  <FiUser size={18} />
                  <h3>Personal Information</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <FormField label="Full Name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter customer name" />
                  <FormField label="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} required placeholder="10 digit number" />
                  <FormField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Optional" />
                  <FormField label="GST Number" name="gstNo" value={formData.gstNo} onChange={handleChange} placeholder="Optional GSTIN" />
                  
                  <div style={{ marginTop: '8px', padding: '12px 16px', background: '#f9fafb', borderRadius: '10px', border: '1px solid #f3f4f6' }}>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 0 }}>
                      <input 
                        type="checkbox" 
                        name="isActive" 
                        id="isActive" 
                        checked={formData.isActive} 
                        onChange={handleChange} 
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#16a34a' }}
                      />
                      <label htmlFor="isActive" style={{ marginBottom: 0, fontWeight: '600', fontSize: '13px', cursor: 'pointer', textTransform: 'none' }}>Active Customer Status</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: Location Details */}
              <div>
                <div className="form-section-title">
                  <FiMapPin size={18} />
                  <h3>Location Details</h3>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ position: 'relative' }}>
                    <FormField label="Pin Code" name="pinCode" value={formData.pinCode} onChange={handleChange} required placeholder="6 digit code" />
                    <div style={{ position: 'absolute', right: '12px', top: '32px', display: 'flex', alignItems: 'center' }}>
                      {isFetchingPin && <FiLoader className="animate-spin" color="#16a34a" />}
                      {pinSuccess && <FiCheckCircle color="#16a34a" size={18} />}
                    </div>
                  </div>

                  {villageList.length > 1 ? (
                    <FormField 
                      label="Village / City" 
                      name="city" 
                      type="select" 
                      options={villageList} 
                      value={formData.city} 
                      onChange={handleChange} 
                      required 
                    />
                  ) : (
                    <FormField label="Village / City" name="city" value={formData.city} onChange={handleChange} required placeholder="Auto-filled" />
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <FormField label="District" name="district" value={formData.district} onChange={handleChange} required placeholder="District" />
                    <FormField label="State" name="state" value={formData.state} onChange={handleChange} required placeholder="State" />
                  </div>

                  <FormField label="Full Address / Landmark" name="address" type="textarea" value={formData.address} onChange={handleChange} placeholder="Optional address" />
                </div>
              </div>
            </div>

            <div className="form-footer">
              <button type="button" className="btn-agro btn-outline" onClick={onBack} style={{ padding: '10px 25px' }}>
                <FiX size={18} /> Cancel
              </button>
              <button type="submit" className="btn-agro btn-primary" style={{ padding: '10px 40px', fontWeight: '600' }}>
                <FiSave size={18} /> {viewMode === 'edit' ? 'Update Record' : 'Save Customer'}
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
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: 0 }}>Customer Profile</h2>
                <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '14px' }}>Complete overview of customer data and relationship status</p>
              </div>
              <button className="btn-agro btn-outline" onClick={onBack} style={{ padding: '10px 25px', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiX size={18} /> Close Profile
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
                  width: '120px', 
                  height: '120px', 
                  background: 'white', 
                  color: '#16a34a', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '48px', 
                  fontWeight: '800', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                  border: '4px solid #f0fdf4',
                  marginBottom: '20px'
                }}>
                  {formData.name.charAt(0).toUpperCase()}
                </div>
                
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0', textAlign: 'center' }}>{formData.name}</h2>
                <span className={`badge ${formData.isActive ? 'badge-success' : 'badge-danger'}`} style={{ padding: '6px 16px', fontSize: '13px', borderRadius: '20px' }}>
                  {formData.isActive ? 'Active Member' : 'Inactive'}
                </span>

                <div style={{ marginTop: '40px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <FiPhone size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase' }}>Mobile</div>
                      <div style={{ fontSize: '15px', color: '#374151', fontWeight: '600' }}>{formData.mobile}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <FiMail size={18} />
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase' }}>Email</div>
                      <div style={{ fontSize: '14px', color: '#374151', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{formData.email || 'Not provided'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <FiInfo size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase' }}>GST Number</div>
                      <div style={{ fontSize: '15px', color: '#374151', fontWeight: '600' }}>{formData.gstNo || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Info Area */}
              <div style={{ flex: 1, padding: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiHome size={18} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: 0 }}>Address & Location Details</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px 20px' }}>
                  <div style={{ padding: '16px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                    <label style={{ display: 'block', color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Village / City</label>
                    <div style={{ fontSize: '16px', color: '#111827', fontWeight: '700' }}>{formData.city}</div>
                  </div>
                  
                  <div style={{ padding: '16px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                    <label style={{ display: 'block', color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Pin Code</label>
                    <div style={{ fontSize: '16px', color: '#111827', fontWeight: '700' }}>{formData.pinCode}</div>
                  </div>

                  <div style={{ padding: '16px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                    <label style={{ display: 'block', color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>District</label>
                    <div style={{ fontSize: '16px', color: '#111827', fontWeight: '700' }}>{formData.district}</div>
                  </div>

                  <div style={{ padding: '16px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                    <label style={{ display: 'block', color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>State</label>
                    <div style={{ fontSize: '16px', color: '#111827', fontWeight: '700' }}>{formData.state}</div>
                  </div>

                  <div style={{ gridColumn: 'span 2', padding: '20px', background: '#f9fafb', borderRadius: '12px', border: '1px dashed #e5e7eb' }}>
                    <label style={{ display: 'block', color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '10px' }}>Full Residential Address</label>
                    <div style={{ fontSize: '15px', color: '#374151', lineHeight: '1.7', fontWeight: '500' }}>
                      {formData.address || 'No detailed address recorded for this customer.'}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '60px', padding: '20px', borderRadius: '12px', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ fontSize: '32px' }}>💡</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>Quick Tip</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>You can update this customer's details anytime from the main directory by clicking the edit icon.</div>
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

export default Customers;
