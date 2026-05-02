import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, User, MapPin } from 'lucide-react';
import { MockService } from '../../services/MockService';
import FormField from '../../components/FormField';
import '../../styles/MasterModel.css';

const CustomerEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '', mobile: '', email: '', address: '', 
    gstNo: '', isActive: true
  });

  useEffect(() => {
    const fetchItem = async () => {
      const item = await MockService.getById('customers', id);
      if (item) {
        setFormData(item);
      } else {
        alert('Customer not found');
        navigate('/customers');
      }
      setLoading(false);
    };
    fetchItem();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFinalSave = async (e) => {
    e.preventDefault();
    await MockService.update('customers', Number(id), formData);
    navigate('/customers');
  };

  if (loading) return <div className="agro-container">Loading...</div>;

  return (
    <div className="agro-container">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <form onSubmit={handleFinalSave} className="agro-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="agro-card-header" style={{ padding: '30px', background: 'white' }}>
            <div>
              <h2 style={{ fontSize: '24px' }}>Update Customer Profile</h2>
              <p>Update details for the selected customer record</p>
            </div>
            <button type="button" className="btn-agro btn-outline" onClick={() => navigate('/customers')}>
              <ArrowLeft size={18} /> Back to List
            </button>
          </div>

          <div style={{ padding: '40px' }}>
            <div className="form-grid">
              {/* Column 1: Personal Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-section-title" style={{ marginBottom: '10px' }}>
                  <User size={18} />
                  <h3 style={{ fontSize: '14px', margin: 0 }}>Personal Information</h3>
                </div>
                
                <FormField label="Full Name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter customer name" />
                <FormField label="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} required placeholder="10 digit number" />
                <FormField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Optional" />
                <FormField label="GST Number" name="gstNo" value={formData.gstNo} onChange={handleChange} placeholder="Optional GSTIN" />
                

              </div>

              {/* Column 2: Address Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-section-title" style={{ marginBottom: '10px' }}>
                  <MapPin size={18} />
                  <h3 style={{ fontSize: '14px', margin: 0 }}>Residential Address</h3>
                </div>
                
                <FormField label="Full Address" name="address" type="textarea" value={formData.address} onChange={handleChange} required placeholder="Enter detailed address" />
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
            <button type="button" className="btn-agro btn-outline" onClick={() => navigate('/customers')} style={{ minWidth: '120px' }}>
              <X size={18} /> Cancel
            </button>
            <button type="submit" className="btn-agro btn-primary" style={{ minWidth: '180px' }}>
              <Save size={18} /> Update Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerEdit;
