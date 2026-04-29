import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useCRUD } from '../hooks/useCRUD';
import { MockService } from '../services/MockService';
import DataTable from '../components/DataTable';
import AdminModal from '../components/AdminModal';
import FormField from '../components/FormField';
import '../styles/MasterModel.css';

const Products = () => {
  const { 
    data, loading, isModalOpen, setIsModalOpen, 
    currentItem, handleAdd, handleEdit, handleDelete, handleSave 
  } = useCRUD('products');

  const [categories, setCategories] = useState([]);
  const [taxes, setTaxes] = useState([]);

  const [formData, setFormData] = useState({
    name: '', productCode: '', categoryId: '', brand: '', 
    companyName: '', unit: '', packing: '', purchasePrice: '', 
    salePrice: '', mrp: '', taxId: '', minStockLevel: '', 
    expiryRequired: false, isActive: true
  });

  useEffect(() => {
    const fetchOptions = async () => {
      const catList = await MockService.getAll('categories');
      const taxList = await MockService.getAll('taxes');
      setCategories(catList);
      setTaxes(taxList);
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    if (currentItem) {
      setFormData(currentItem);
    } else {
      setFormData({
        name: '', productCode: '', categoryId: '', brand: '', 
        companyName: '', unit: '', packing: '', purchasePrice: '', 
        salePrice: '', mrp: '', taxId: '', minStockLevel: '', 
        expiryRequired: false, isActive: true
      });
    }
  }, [currentItem, isModalOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const columns = [
    { header: 'Product Name', accessor: 'name' },
    { header: 'Code', accessor: 'productCode' },
    { 
      header: 'Category', 
      render: (row) => categories.find(c => c.id == row.categoryId)?.name || 'N/A'
    },
    { header: 'MRP', render: (row) => `₹${row.mrp}` },
    { header: 'Stock', accessor: 'minStockLevel' },
    { 
      header: 'Status', 
      render: (row) => (
        <span className={`badge ${row.isActive ? 'badge-success' : 'badge-danger'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ) 
    }
  ];

  return (
    <div className="agro-container">
      <div className="page-header">
        <div className="page-title">
          <h1>Product Inventory</h1>
          <p>Manage your stocks, pricing and categories</p>
        </div>
        <button className="btn-agro btn-primary" onClick={handleAdd}>
          <FiPlus size={20} /> Add Product
        </button>
      </div>

      <DataTable 
        title="Products"
        columns={columns} 
        data={data} 
        onEdit={handleEdit} 
        onDelete={(item) => handleDelete(item.id)}
        onView={(item) => alert(JSON.stringify(item, null, 2))}
      />

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={currentItem ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }}>
          <div className="form-grid">
            <FormField label="Product Name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter product name" />
            <FormField label="Product Code" name="productCode" value={formData.productCode} onChange={handleChange} required placeholder="e.g. PRD001" />
            
            <FormField label="Category" name="categoryId" type="select" options={categories} value={formData.categoryId} onChange={handleChange} required />
            <FormField label="Tax (%)" name="taxId" type="select" options={taxes} value={formData.taxId} onChange={handleChange} required />
            
            <FormField label="Brand" name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Bayer" />
            <FormField label="Company" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="e.g. ABC Ltd" />
            
            <FormField label="Unit" name="unit" value={formData.unit} onChange={handleChange} placeholder="e.g. Kg, Ltr, Pcs" />
            <FormField label="Packing" name="packing" value={formData.packing} onChange={handleChange} placeholder="e.g. 500ml, 1kg" />
            
            <FormField label="Purchase Price" name="purchasePrice" type="number" value={formData.purchasePrice} onChange={handleChange} required />
            <FormField label="Sale Price" name="salePrice" type="number" value={formData.salePrice} onChange={handleChange} required />
            
            <FormField label="MRP" name="mrp" type="number" value={formData.mrp} onChange={handleChange} required />
            <FormField label="Min Stock Level" name="minStockLevel" type="number" value={formData.minStockLevel} onChange={handleChange} required />
          </div>

          <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
            <FormField label="Expiry Date Required?" name="expiryRequired" isToggle value={formData.expiryRequired} onChange={handleChange} />
            <FormField label="Active Status" name="isActive" isToggle value={formData.isActive} onChange={handleChange} />
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-agro btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-agro btn-primary">Save Product</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default Products;
