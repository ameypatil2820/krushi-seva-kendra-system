import React, { useState, useEffect } from 'react';
import { FiPlus, FiArrowLeft, FiSave, FiX, FiTag, FiDollarSign, FiPackage, FiLayers, FiCalendar } from 'react-icons/fi';
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
        <div className="page-header">
          <div className="page-title">
            <h1>Product Inventory</h1>
            <p>Manage your stocks, pricing and categories</p>
          </div>
          <button className="btn-agro btn-primary" onClick={handleActionAdd}>
            <FiPlus size={20} /> Add Product
          </button>
        </div>

        <DataTable title="Products" columns={columns} data={data} onEdit={handleActionEdit} onDelete={handleDeleteClick} onView={handleActionView} />

        <ConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleConfirmDelete} title="Delete Product?" message={`Are you sure you want to delete ${currentItem?.name}?`} />
      </div>
    );
  }

  if (viewMode === 'add' || viewMode === 'edit') {
    return (
      <div className="agro-container">
        <div className="page-header">
          <div className="page-title">
            <button className="btn-agro btn-outline" onClick={onBack} style={{ marginBottom: '15px', border: 'none', padding: '0', background: 'transparent' }}>
              <FiArrowLeft size={18} /> Back to Products
            </button>
            <h1>{viewMode === 'edit' ? 'Edit Product' : 'Add New Product'}</h1>
          </div>
        </div>

        <div className="agro-card" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <form onSubmit={handleFinalSave}>
            {/* Section 1: Basic Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', color: '#16a34a', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px' }}>
              <FiTag size={20} />
              <h3 style={{ margin: 0, fontSize: '18px' }}>Basic Information</h3>
            </div>
            <div className="form-grid">
              <FormField label="Product Name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter product name" />
              <FormField label="Product Code" name="code" value={formData.code} onChange={handleChange} required placeholder="e.g. PRD001" />
              
              <SearchableSelect 
                label="Category" 
                options={categories} 
                value={formData.category} 
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} 
                required 
              />

              <SearchableSelect 
                label="Tax" 
                options={taxes} 
                value={formData.tax} 
                onChange={(e) => setFormData(prev => ({ ...prev, tax: e.target.value }))} 
                required 
                placeholder="Select Tax %"
              />

              <FormField label="Brand" name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Bayer" />
              <FormField label="Company" name="company" value={formData.company} onChange={handleChange} placeholder="e.g. ABC Ltd" />
            </div>

            {/* Section 2: Unit & Packing */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', marginTop: '40px', color: '#16a34a', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px' }}>
              <FiPackage size={20} />
              <h3 style={{ margin: 0, fontSize: '18px' }}>Unit & Packing</h3>
            </div>
            <div className="form-grid">
              <SearchableSelect 
                label="Unit" 
                options={['Kg', 'Ltr', 'Ml', 'Gm', 'Pcs', 'Bag', 'Packet', 'Box', 'Bundle', 'Drum']} 
                value={formData.unit} 
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))} 
                required 
              />
              <FormField label="Packing" name="packing" value={formData.packing} onChange={handleChange} placeholder="e.g. 500ml, 1kg" />
            </div>

            {/* Section 3: Manufacturing & Expiry */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', marginTop: '40px', color: '#16a34a', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px' }}>
              <FiCalendar size={20} />
              <h3 style={{ margin: 0, fontSize: '18px' }}>Shelf Life & Dates</h3>
            </div>
            <div className="form-grid">
              <FormField label="Manufacturing Date" name="mfgDate" type="date" value={formData.mfgDate} onChange={handleChange} />
              <FormField label="Expiry Date" name="expDate" type="date" value={formData.expDate} onChange={handleChange} />
            </div>

            {/* Section 4: Pricing & Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', marginTop: '40px', color: '#16a34a', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px' }}>
              <FiDollarSign size={20} />
              <h3 style={{ margin: 0, fontSize: '18px' }}>Pricing & Stock</h3>
            </div>
            <div className="form-grid">
              <FormField label="Purchase Price" name="purchasePrice" type="number" value={formData.purchasePrice} onChange={handleChange} required />
              <FormField label="Sale Price" name="salePrice" type="number" value={formData.salePrice} onChange={handleChange} required />
              <FormField label="MRP" name="mrp" type="number" value={formData.mrp} onChange={handleChange} required />
              <FormField label="Min Stock Level" name="minStock" type="number" value={formData.minStock} onChange={handleChange} required />
            </div>

            <div style={{ display: 'flex', gap: '40px', marginTop: '30px', padding: '20px', background: '#f9fafb', borderRadius: '12px' }}>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 0 }}>
                <input type="checkbox" name="expiryRequired" id="expiryRequired" checked={formData.expiryRequired} onChange={handleChange} />
                <label htmlFor="expiryRequired" style={{ marginBottom: 0 }}>Expiry Alert Required?</label>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 0 }}>
                <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleChange} />
                <label htmlFor="isActive" style={{ marginBottom: 0 }}>Active Status</label>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '40px', justifyContent: 'flex-end', borderTop: '1px solid #f3f4f6', paddingTop: '25px' }}>
              <button type="button" className="btn-agro btn-outline" onClick={onBack} style={{ padding: '12px 25px' }}>
                <FiX size={18} /> Cancel
              </button>
              <button type="submit" className="btn-agro btn-primary" style={{ padding: '12px 35px' }}>
                <FiSave size={18} /> {viewMode === 'edit' ? 'Update Product' : 'Save Product'}
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
              <FiArrowLeft size={18} /> Back to Products
            </button>
            <h1>Product Details</h1>
          </div>
          <button className="btn-agro btn-primary" onClick={onBack}>Done</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '25px' }}>
          <div className="agro-card" style={{ textAlign: 'center' }}>
            <div style={{ width: '120px', height: '120px', background: '#f0fdf4', color: '#16a34a', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '48px', fontWeight: 'bold' }}>
              <FiPackage />
            </div>
            <h2 style={{ marginBottom: '10px', color: '#111827' }}>{formData.name}</h2>
            <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '15px' }}>Code: {formData.code}</p>
            <span className={`badge ${formData.isActive ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '14px', padding: '6px 15px' }}>
              {formData.isActive ? 'Active' : 'Inactive'}
            </span>

            <div style={{ marginTop: '30px', textAlign: 'left', borderTop: '1px solid #f3f4f6', paddingTop: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#6b7280', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>Manufacturing Date</label>
                <div style={{ fontSize: '15px', color: '#111827', fontWeight: '500' }}>{formData.mfgDate || 'N/A'}</div>
              </div>
              <div>
                <label style={{ display: 'block', color: '#6b7280', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>Expiry Date</label>
                <div style={{ fontSize: '15px', color: formData.expDate ? '#ef4444' : '#111827', fontWeight: '600' }}>{formData.expDate || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className="agro-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid #f3f4f6' }}>
              <FiLayers size={22} color="#16a34a" />
              <h3 style={{ margin: 0, color: '#111827', fontSize: '20px' }}>Specifications & Pricing</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div>
                <label style={{ display: 'block', color: '#6b7280', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Category</label>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{formData.category}</div>
              </div>
              <div>
                <label style={{ display: 'block', color: '#6b7280', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Brand / Company</label>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{formData.brand} ({formData.company})</div>
              </div>
              <div>
                <label style={{ display: 'block', color: '#6b7280', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Packing / Unit</label>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{formData.packing} {formData.unit}</div>
              </div>
              <div>
                <label style={{ display: 'block', color: '#6b7280', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>MRP</label>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>₹{formData.mrp}</div>
              </div>
              <div style={{ padding: '15px', background: '#f9fafb', borderRadius: '12px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold', textTransform: 'uppercase' }}>Purchase Price</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>₹{formData.purchasePrice}</div>
              </div>
              <div style={{ padding: '15px', background: '#f0fdf4', borderRadius: '12px' }}>
                <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 'bold', textTransform: 'uppercase' }}>Sale Price</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#16a34a' }}>₹{formData.salePrice}</div>
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
