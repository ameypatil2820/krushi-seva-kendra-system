import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, ArrowLeft, Save, X, Tag, DollarSign, Package, Layers, Calendar } from 'lucide-react';
import { MockService } from '../../services/MockService';
import FormField from '../../components/FormField';
import SearchableSelect from '../../components/SearchableSelect';
import '../../styles/MasterModel.css';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [taxes, setTaxes] = useState([]);

  const [formData, setFormData] = useState({
    name: '', code: '', category: '', tax: '',
    company: '', primaryUnit: '', secondaryUnit: '', conversionFactor: '', 
    minStock: '', currentStock: '',
    expiryRequired: false, isActive: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [item, catData, taxData] = await Promise.all([
          MockService.getById('products', id),
          MockService.getAll('categories'),
          MockService.getAll('taxes')
        ]);

        if (item) {
          setFormData(item);
        } else {
          alert('Product not found');
          navigate('/products');
        }

        setCategories(catData.filter(c => c.isActive).map(c => c.name));
        setTaxes(taxData.filter(t => t.isActive).map(t => t.rate.toString()));
      } catch (error) {
        console.error("Fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
    await MockService.update('products', Number(id), formData);
    navigate('/products');
  };

  if (loading) return <div className="agro-container">Loading...</div>;

  return (
    <div className="agro-container">
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <form onSubmit={handleFinalSave} className="agro-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="agro-card-header" style={{ padding: '30px', background: 'white' }}>
            <div>
              <h2 style={{ fontSize: '24px' }}>Edit Product Details</h2>
              <p>Manage your stocks, pricing and categories for the inventory</p>
            </div>
            <button type="button" className="btn-agro btn-outline" onClick={() => navigate('/products')}>
              <ArrowLeft size={18} /> Back to List
            </button>
          </div>

          <div style={{ padding: '40px' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div>
                <div className="form-section-title" style={{ marginBottom: '15px' }}>
                  <Tag size={18} />
                  <h3 style={{ fontSize: '14px', margin: 0 }}>Basic Information</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <FormField label="Product Name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter product name" />
                  <FormField label="Product Code" name="code" value={formData.code} onChange={handleChange} required placeholder="e.g. PRD001" />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <SearchableSelect label="Category" options={categories} value={formData.category} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} required />
                    <SearchableSelect label="Tax" options={taxes} value={formData.tax} onChange={(e) => setFormData(prev => ({ ...prev, tax: e.target.value }))} required placeholder="Select Tax %" />
                  </div>

                  <FormField label="Company" name="company" value={formData.company} onChange={handleChange} placeholder="e.g. ABC Ltd" />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                    <SearchableSelect label="Purchase Unit" options={['Box', 'Bag', 'Case', 'Crate', 'Drum', 'Nos']} value={formData.primaryUnit} onChange={(e) => setFormData(prev => ({ ...prev, primaryUnit: e.target.value }))} required />
                    <SearchableSelect label="Sale Unit" options={['Nos', 'Kg', 'Ltr', 'Pcs', 'Gm', 'Ml', 'Packet']} value={formData.secondaryUnit} onChange={(e) => setFormData(prev => ({ ...prev, secondaryUnit: e.target.value }))} required />
                    <FormField 
                      label={formData.primaryUnit && formData.secondaryUnit ? `1 ${formData.primaryUnit} = ${formData.conversionFactor || '?'} ${formData.secondaryUnit}` : "Qty in 1 Unit"} 
                      name="conversionFactor" 
                      type="number" 
                      value={formData.conversionFactor} 
                      onChange={handleChange} 
                      required 
                      placeholder="e.g. 10" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="form-section-title" style={{ marginBottom: '15px' }}>
                  <Package size={18} />
                  <h3 style={{ fontSize: '14px', margin: 0 }}>Stock & Status</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <FormField label="Current Stock" name="currentStock" type="number" value={formData.currentStock} onChange={handleChange} required placeholder="0" />
                    <FormField label="Low Stock Alert" name="minStock" type="number" value={formData.minStock} onChange={handleChange} required placeholder="5" />
                  </div>

                  <div style={{ marginTop: '10px', padding: '20px', background: 'var(--primary-soft)', borderRadius: '15px', border: '1px solid #dcfce7', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 0 }}>
                      <input type="checkbox" name="expiryRequired" id="expiryRequired" checked={formData.expiryRequired} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }} />
                      <label htmlFor="expiryRequired" style={{ marginBottom: 0, cursor: 'pointer', textTransform: 'none', fontWeight: '700', fontSize: '13px', color: 'var(--primary)' }}>Enable Expiry Alerts</label>
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 0 }}>
                      <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }} />
                      <label htmlFor="isActive" style={{ marginBottom: 0, cursor: 'pointer', textTransform: 'none', fontWeight: '700', fontSize: '13px', color: 'var(--primary)' }}>Active Inventory Status</label>
                    </div>
                  </div>
                </div>
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
            <button type="button" className="btn-agro btn-outline" onClick={() => navigate('/products')} style={{ minWidth: '120px' }}>
              <X size={18} /> Cancel
            </button>
            <button type="submit" className="btn-agro btn-primary" style={{ minWidth: '180px' }}>
              <Save size={18} /> Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;
