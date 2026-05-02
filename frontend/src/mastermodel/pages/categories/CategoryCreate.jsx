import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, Layers } from 'lucide-react';
import { useCRUD } from '../../hooks/useCRUD';
import FormField from '../../components/FormField';
import '../../styles/MasterModel.css';

const CategoryCreate = () => {
  const navigate = useNavigate();
  const { handleSave } = useCRUD('categories');
  const [formData, setFormData] = useState({ name: '', description: '', isActive: true });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFinalSave = async (e) => {
    e.preventDefault();
    await handleSave(formData);
    navigate('/categories');
  };

  return (
    <div className="agro-container">
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form onSubmit={handleFinalSave} className="agro-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="agro-card-header" style={{ padding: '30px', background: 'white' }}>
            <div>
              <h2 style={{ fontSize: '24px' }}>Create New Category</h2>
              <p>Define product groupings and classifications</p>
            </div>
            <button type="button" className="btn-agro btn-outline" onClick={() => navigate('/categories')}>
              <ArrowLeft size={18} /> Back to List
            </button>
          </div>

          <div style={{ padding: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-section-title" style={{ marginBottom: '10px' }}>
                <Layers size={18} />
                <h3 style={{ fontSize: '14px', margin: 0 }}>Category Details</h3>
              </div>
              
              <FormField label="Category Name" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Fertilizers" />
              <FormField label="Description" name="description" type="textarea" value={formData.description} onChange={handleChange} placeholder="What kind of products are in this category?" />
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
            <button type="button" className="btn-agro btn-outline" onClick={() => navigate('/categories')} style={{ minWidth: '120px' }}>
              <X size={18} /> Cancel
            </button>
            <button type="submit" className="btn-agro btn-primary" style={{ minWidth: '180px' }}>
              <Save size={18} /> Save Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryCreate;
