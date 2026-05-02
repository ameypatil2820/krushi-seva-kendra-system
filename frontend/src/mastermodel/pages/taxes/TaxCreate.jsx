import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, Percent } from 'lucide-react';
import { useCRUD } from '../../hooks/useCRUD';
import FormField from '../../components/FormField';
import '../../styles/MasterModel.css';

const TaxCreate = () => {
  const navigate = useNavigate();
  const { handleSave } = useCRUD('taxes');
  const [formData, setFormData] = useState({ name: '', rate: '', isActive: true });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFinalSave = async (e) => {
    e.preventDefault();
    await handleSave(formData);
    navigate('/taxes');
  };

  return (
    <div className="agro-container">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleFinalSave} className="agro-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="agro-card-header" style={{ padding: '30px', background: 'white' }}>
            <div>
              <h2 style={{ fontSize: '24px' }}>Register New Tax Rate</h2>
              <p>Configure GST and other tax rates</p>
            </div>
            <button type="button" className="btn-agro btn-outline" onClick={() => navigate('/taxes')}>
              <ArrowLeft size={18} /> Back to List
            </button>
          </div>

          <div style={{ padding: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-section-title" style={{ marginBottom: '10px' }}>
                <Percent size={18} />
                <h3 style={{ fontSize: '14px', margin: 0 }}>Tax Details</h3>
              </div>
              
              <FormField label="Tax Name" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. GST" />
              <FormField label="Rate (%)" name="rate" type="number" value={formData.rate} onChange={handleChange} required placeholder="e.g. 18" />
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
            <button type="button" className="btn-agro btn-outline" onClick={() => navigate('/taxes')} style={{ minWidth: '120px' }}>
              <X size={18} /> Cancel
            </button>
            <button type="submit" className="btn-agro btn-primary" style={{ minWidth: '180px' }}>
              <Save size={18} /> Save Tax
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaxCreate;
