import React, { useState, useEffect } from 'react';
import { Plus, ArrowLeft, Save, X, Tag, DollarSign, Package, Layers, Calendar } from 'lucide-react';
import { useCRUD } from '../hooks/useCRUD';
import DataTable from '../components/DataTable';
import FormField from '../components/FormField';
import ConfirmModal from '../components/ConfirmModal';
import SearchableSelect from '../components/SearchableSelect';
import '../styles/MasterModel.css';

import { MockService } from '../services/MockService';

const Products = () => {
  const {
    data, loading, isDeleteOpen, setIsDeleteOpen,
    currentItem, handleAdd, handleEdit, handleView,
    handleDeleteClick, handleConfirmDelete, handleSave
  } = useCRUD('products');

  const [viewMode, setViewMode] = useState('list');
  const [categories, setCategories] = useState([]);
  const [taxes, setTaxes] = useState([]);

  const [formData, setFormData] = useState({
    name: '', code: '', category: '', tax: '', brand: '',
    company: '', unit: '', packing: '', purchasePrice: '',
    salePrice: '', mrp: '', minStock: '',
    mfgDate: '', expDate: '',
    expiryRequired: false, isActive: true
  });

  // Fetch Categories and Taxes for Dropdowns using MockService
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [catData, taxData] = await Promise.all([
          MockService.getAll('categories'),
          MockService.getAll('taxes')
        ]);

        setCategories(catData.filter(c => c.isActive).map(c => c.name));
        setTaxes(taxData.filter(t => t.isActive).map(t => t.rate.toString()));
      } catch (error) {
        console.error("Master data fetch failed", error);
      }
    };
    fetchMasterData();
  }, []);

  useEffect(() => {
    if (currentItem && (viewMode === 'edit' || viewMode === 'view')) {
      setFormData(currentItem);
    } else if (viewMode === 'add') {
      setFormData({
        name: '', code: '', category: '', tax: '', brand: '',
        company: '', unit: '', packing: '', purchasePrice: '',
        salePrice: '', mrp: '', minStock: '',
        mfgDate: '', expDate: '',
        expiryRequired: false, isActive: true
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

  const handleActionAdd = () => { handleAdd(); setViewMode('add'); };
  const handleActionEdit = (item) => { handleEdit(item); setViewMode('edit'); };
  const handleActionView = (item) => { handleView(item); setViewMode('view'); };

  const handleFinalSave = async (e) => {
    e.preventDefault();
    await handleSave(formData);
    setViewMode('list');
  };

  const columns = [
    { header: 'Product Name', accessor: 'name' },
    { header: 'Code', accessor: 'code' },
    { header: 'Category', accessor: 'category' },
    {
      header: 'Sale Price',
      render: (row) => `₹${row.salePrice}`
    },
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
        <div className="agro-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="agro-card-header" style={{ padding: '24px 30px', marginBottom: 0 }}>
            <div>
              <h2>Product Inventory</h2>
              <p>Manage your stocks, pricing and categories</p>
            </div>
            <button className="btn-agro btn-primary" onClick={handleActionAdd}>
              <Plus size={20} /> Add Product
            </button>
          </div>
          
          <div style={{ padding: '30px' }}>
            <DataTable 
              title="Products" 
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
          title="Delete Product?" 
          message={`Are you sure you want to delete ${currentItem?.name}?`} 
        />
      </div>
    );
  }

  if (viewMode === 'add' || viewMode === 'edit') {
    return (
      <div className="agro-container">
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <form onSubmit={handleFinalSave} className="agro-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="agro-card-header" style={{ padding: '30px', background: 'white' }}>
              <div>
                <h2 style={{ fontSize: '24px' }}>{viewMode === 'edit' ? 'Edit Product Details' : 'Register New Product'}</h2>
                <p>Manage your stocks, pricing and categories for the inventory</p>
              </div>
              <button type="button" className="btn-agro btn-outline" onClick={onBack}>
                <ArrowLeft size={18} /> Back to List
              </button>
            </div>

            <div style={{ padding: '40px' }}>
              <div className="form-grid" style={{ gap: '40px' }}>
                {/* Column 1: Basic & Unit */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
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
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <FormField label="Brand" name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Bayer" />
                        <FormField label="Company" name="company" value={formData.company} onChange={handleChange} placeholder="e.g. ABC Ltd" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="form-section-title" style={{ marginBottom: '15px' }}>
                      <Package size={18} />
                      <h3 style={{ fontSize: '14px', margin: 0 }}>Unit & Packing</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <SearchableSelect label="Unit" options={['Kg', 'Ltr', 'Ml', 'Gm', 'Pcs', 'Bag', 'Packet', 'Box', 'Bundle', 'Drum']} value={formData.unit} onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))} required />
                      <FormField label="Packing" name="packing" value={formData.packing} onChange={handleChange} placeholder="e.g. 500ml, 1kg" />
                    </div>
                  </div>
                </div>

                {/* Column 2: Pricing & Stock */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <div>
                    <div className="form-section-title" style={{ marginBottom: '15px' }}>
                      <DollarSign size={18} />
                      <h3 style={{ fontSize: '14px', margin: 0 }}>Pricing & Stock</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <FormField label="Purchase Price" name="purchasePrice" type="number" value={formData.purchasePrice} onChange={handleChange} required />
                      <FormField label="Sale Price" name="salePrice" type="number" value={formData.salePrice} onChange={handleChange} required />
                      <FormField label="MRP" name="mrp" type="number" value={formData.mrp} onChange={handleChange} required />
                      <FormField label="Min Stock Level" name="minStock" type="number" value={formData.minStock} onChange={handleChange} required />
                    </div>
                  </div>

                  <div>
                    <div className="form-section-title" style={{ marginBottom: '15px' }}>
                      <Calendar size={18} />
                      <h3 style={{ fontSize: '14px', margin: 0 }}>Shelf Life & Status</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <FormField label="Manufacturing Date" name="mfgDate" type="date" value={formData.mfgDate} onChange={handleChange} />
                      <FormField label="Expiry Date" name="expDate" type="date" value={formData.expDate} onChange={handleChange} />
                    </div>

                    <div style={{ marginTop: '20px', padding: '20px', background: 'var(--primary-soft)', borderRadius: '15px', border: '1px solid #dcfce7', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
              <button type="button" className="btn-agro btn-outline" onClick={onBack} style={{ minWidth: '120px' }}>
                <X size={18} /> Cancel
              </button>
              <button type="submit" className="btn-agro btn-primary" style={{ minWidth: '180px' }}>
                <Save size={18} /> {viewMode === 'edit' ? 'Update Product' : 'Save Product'}
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
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: 0 }}>Product Details</h2>
                <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '14px' }}>Full technical and commercial specifications of the product</p>
              </div>
              <button className="btn-agro btn-outline" onClick={onBack} style={{ padding: '10px 25px', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowLeft size={18} /> Close Details
              </button>
            </div>

            <div style={{ display: 'flex', minHeight: '500px' }}>
              {/* Product Sidebar */}
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
                  borderRadius: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '48px', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                  border: '4px solid #f0fdf4',
                  marginBottom: '20px'
                }}>
                  <Package size={48} />
                </div>
                
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0', textAlign: 'center' }}>{formData.name}</h2>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '15px' }}>Code: {formData.code}</div>
                <span className={`badge ${formData.isActive ? 'badge-success' : 'badge-danger'}`} style={{ padding: '6px 16px', fontSize: '13px', borderRadius: '20px' }}>
                  {formData.isActive ? 'In Stock' : 'Out of Stock'}
                </span>

                <div style={{ marginTop: '40px', width: '100%', padding: '20px', background: 'white', borderRadius: '15px', border: '1px solid #f3f4f6' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase', marginBottom: '5px' }}>Manufacturing Date</div>
                    <div style={{ fontSize: '15px', color: '#374151', fontWeight: '600' }}>{formData.mfgDate || 'N/A'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: '700', textTransform: 'uppercase', marginBottom: '5px' }}>Expiry Date</div>
                    <div style={{ fontSize: '15px', color: '#ef4444', fontWeight: '800' }}>{formData.expDate || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Main Specs Area */}
              <div style={{ flex: 1, padding: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Layers size={18} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: 0 }}>Specifications & Pricing</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px 20px' }}>
                  <div style={{ padding: '16px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                    <label style={{ display: 'block', color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Category</label>
                    <div style={{ fontSize: '16px', color: '#111827', fontWeight: '700' }}>{formData.category}</div>
                  </div>
                  
                  <div style={{ padding: '16px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                    <label style={{ display: 'block', color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Brand / Company</label>
                    <div style={{ fontSize: '16px', color: '#111827', fontWeight: '700' }}>{formData.brand} ({formData.company})</div>
                  </div>

                  <div style={{ padding: '16px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                    <label style={{ display: 'block', color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Packing / Unit</label>
                    <div style={{ fontSize: '16px', color: '#111827', fontWeight: '700' }}>{formData.packing} {formData.unit}</div>
                  </div>

                  <div style={{ padding: '16px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                    <label style={{ display: 'block', color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>MRP (Maximum Retail Price)</label>
                    <div style={{ fontSize: '16px', color: '#111827', fontWeight: '700' }}>₹{formData.mrp}</div>
                  </div>

                  <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <label style={{ display: 'block', color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '10px' }}>Purchase Price</label>
                    <div style={{ fontSize: '24px', color: '#111827', fontWeight: '800' }}>₹{formData.purchasePrice}</div>
                  </div>

                  <div style={{ padding: '20px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                    <label style={{ display: 'block', color: '#16a34a', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '10px' }}>Selling Price</label>
                    <div style={{ fontSize: '24px', color: '#16a34a', fontWeight: '800' }}>₹{formData.salePrice}</div>
                  </div>
                </div>

                <div style={{ marginTop: '40px', padding: '20px', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fef3c7', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ fontSize: '24px' }}>📈</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#92400e' }}>Profit Margin</div>
                    <div style={{ fontSize: '13px', color: '#b45309' }}>Your profit margin on this product is approximately ₹{formData.salePrice - formData.purchasePrice} per unit.</div>
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

export default Products;
