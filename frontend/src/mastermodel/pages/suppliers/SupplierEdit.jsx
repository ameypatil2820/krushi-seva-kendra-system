import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, User } from 'lucide-react';
import { MockService } from '../../services/MockService';
import FormField from '../../components/FormField';
import '../../styles/MasterModel.css';

const SupplierEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '', mobile: '', altMobileNo: '', email: '',
    address: '', gstNo: '', isActive: true
  });

  useEffect(() => {
    const fetchItem = async () => {
      const item = await MockService.getById('suppliers', id);
      if (item) {
        setFormData(item);
      } else {
        alert('Supplier not found');
        navigate('/suppliers');
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
    await MockService.update('suppliers', Number(id), formData);
    navigate('/suppliers');
  };

  if (loading) return <div className="agro-container">Loading...</div>;

  return (
    <div className="agro-container">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <form onSubmit={handleFinalSave} className="agro-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="agro-card-header" style={{ padding: '30px', background: 'white' }}>
            <div>
              <h2 style={{ fontSize: '24px' }}>Edit Supplier Profile</h2>
              <p>Update details for your vendor or product supplier</p>
            </div>
            <button type="button" className="btn-agro btn-outline" onClick={() => navigate('/suppliers')}>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <FormField label="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} required placeholder="Primary mobile" />
                <FormField label="Alt Mobile No (Optional)" name="altMobileNo" value={formData.altMobileNo} onChange={handleChange} placeholder="Alternative number" />
              </div>
              <FormField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="e.g. supplier@example.com" />
              <FormField label="GST Number" name="gstNo" value={formData.gstNo} onChange={handleChange} placeholder="15-digit GSTIN" />
            </div>

            <div style={{ marginTop: '25px' }}>
              <FormField label="Full Business Address" name="address" type="textarea" value={formData.address} onChange={handleChange} required placeholder="Enter complete business address" />
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
            <button type="button" className="btn-agro btn-outline" onClick={() => navigate('/suppliers')} style={{ minWidth: '120px' }}>
              <X size={18} /> Cancel
            </button>
            <button type="submit" className="btn-agro btn-primary" style={{ minWidth: '180px' }}>
              <Save size={18} /> Update Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierEdit;
