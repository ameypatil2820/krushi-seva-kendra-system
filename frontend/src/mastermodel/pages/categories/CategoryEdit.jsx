import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Layers } from 'lucide-react';
import { MockService } from '../../services/MockService';
import FormField from '../../components/FormField';
import '../../styles/MasterModel.css';

const CategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', description: '', isActive: true });

  useEffect(() => {
    const fetchItem = async () => {
      const item = await MockService.getById('categories', id);
      if (item) {
        setFormData(item);
      } else {
        alert('Category not found');
        navigate('/categories');
      }
      setLoading(false);
    };
    fetchItem();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFinalSave = async (e) => {
    e.preventDefault();
    await MockService.update('categories', Number(id), formData);
    navigate('/categories');
  };

  if (loading) return <div className="agro-container">Loading...</div>;

  return (
    <div className="agro-container">
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form onSubmit={handleFinalSave} className="agro-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="agro-card-header" style={{ padding: '30px', background: 'white' }}>
            <div>
              <h2 style={{ fontSize: '24px' }}>Edit Category</h2>
              <p>Update product groupings and classifications</p>
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
              <Save size={18} /> Update Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryEdit;
