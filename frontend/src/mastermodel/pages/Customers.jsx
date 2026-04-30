import React, { useState, useEffect } from 'react';
import { FiPlus, FiArrowLeft, FiSave, FiX, FiUser, FiPhone, FiMapPin, FiMail, FiLoader, FiCheckCircle, FiInfo, FiHome } from 'react-icons/fi';
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
          <div className="page-title">
            <h1>Customer Directory</h1>
            <p>Maintain detailed records of your farmers and customers</p>
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
              <FiArrowLeft size={18} /> Back to Directory
            </button>
            <h1>{viewMode === 'edit' ? 'Update Profile' : 'New Customer Registration'}</h1>
          </div>
        </div>

        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <form onSubmit={handleFinalSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              <div className="agro-card" style={{ height: 'fit-content' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', color: '#16a34a', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>
                  <FiUser size={18} />
                  <h3 style={{ margin: 0, fontSize: '16px' }}>Personal Information</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <FormField label="Full Name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter customer name" />
                  <FormField label="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} required placeholder="10 digit number" />
                  <FormField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Optional" />
                  <FormField label="GST Number" name="gstNo" value={formData.gstNo} onChange={handleChange} placeholder="Optional GSTIN" />
                  
                  <div style={{ marginTop: '5px', padding: '10px 15px', background: '#f9fafb', borderRadius: '10px' }}>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 0 }}>
                      <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleChange} />
                      <label htmlFor="isActive" style={{ marginBottom: 0, fontWeight: '600', fontSize: '13px' }}>Active Customer</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="agro-card" style={{ height: 'fit-content' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', color: '#16a34a', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>
                  <FiMapPin size={18} />
                  <h3 style={{ margin: 0, fontSize: '16px' }}>Location Details</h3>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ position: 'relative' }}>
                    <FormField label="Pin Code" name="pinCode" value={formData.pinCode} onChange={handleChange} required placeholder="6 digit code" />
                    <div style={{ position: 'absolute', right: '12px', top: '35px', display: 'flex', alignItems: 'center' }}>
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

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <FormField label="District" name="district" value={formData.district} onChange={handleChange} required placeholder="District" />
                    <FormField label="State" name="state" value={formData.state} onChange={handleChange} required placeholder="State" />
                  </div>

                  <FormField label="Full Address / Landmark" name="address" type="textarea" value={formData.address} onChange={handleChange} placeholder="Optional address" />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '25px', justifyContent: 'flex-end', paddingBottom: '30px' }}>
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
        <div className="page-header">
          <div className="page-title">
            <button className="btn-agro btn-outline" onClick={onBack} style={{ marginBottom: '15px', border: 'none', padding: '0', background: 'transparent' }}>
              <FiArrowLeft size={18} /> Back to Directory
            </button>
            <h1>Customer Profile</h1>
          </div>
          <button className="btn-agro btn-primary" onClick={onBack}>Done</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          <div className="agro-card" style={{ textAlign: 'center' }}>
            <div style={{ width: '120px', height: '120px', background: '#f0fdf4', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '48px', fontWeight: 'bold', border: '4px solid white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              {formData.name.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ color: '#111827', marginBottom: '8px' }}>{formData.name}</h2>
            <div style={{ marginBottom: '25px' }}>
              <span className={`badge ${formData.isActive ? 'badge-success' : 'badge-danger'}`} style={{ padding: '6px 16px', fontSize: '14px' }}>
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div style={{ textAlign: 'left', background: '#f9fafb', padding: '20px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', color: '#374151' }}>
                <FiPhone size={18} color="#16a34a" /> <strong>{formData.mobile}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', color: '#374151' }}>
                <FiMail size={18} color="#16a34a" /> <span>{formData.email || 'Not provided'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#374151' }}>
                <FiInfo size={18} color="#16a34a" /> <span>GST: {formData.gstNo || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="agro-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid #f3f4f6' }}>
              <FiHome size={22} color="#16a34a" />
              <h3 style={{ margin: 0, color: '#111827', fontSize: '20px' }}>Address & Location</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div>
                <label style={{ display: 'block', color: '#6b7280', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Pin Code</label>
                <div style={{ color: '#111827', fontWeight: '600', fontSize: '16px' }}>{formData.pinCode}</div>
              </div>
              <div>
                <label style={{ display: 'block', color: '#6b7280', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Village / City</label>
                <div style={{ color: '#111827', fontWeight: '600', fontSize: '16px' }}>{formData.city}</div>
              </div>
              <div>
                <label style={{ display: 'block', color: '#6b7280', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>District</label>
                <div style={{ color: '#111827', fontWeight: '600', fontSize: '16px' }}>{formData.district}</div>
              </div>
              <div>
                <label style={{ display: 'block', color: '#6b7280', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>State</label>
                <div style={{ color: '#111827', fontWeight: '600', fontSize: '16px' }}>{formData.state}</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', color: '#6b7280', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px' }}>Full Address Details</label>
                <div style={{ color: '#374151', padding: '15px', background: '#f9fafb', borderRadius: '10px', border: '1px solid #f3f4f6', lineHeight: '1.6' }}>
                  {formData.address || 'No detailed address provided.'}
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
