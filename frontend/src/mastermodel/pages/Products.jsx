import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useCRUD } from '../hooks/useCRUD';
import { MockService } from '../services/MockService';
import DataTable from '../components/DataTable';
import AdminModal from '../components/AdminModal';
import FormField from '../components/FormField';
import ConfirmModal from '../components/ConfirmModal';
import ViewDetailsModal from '../components/ViewDetailsModal';
import '../styles/MasterModel.css';

const Products = () => {
  const { 
    data, loading, isModalOpen, setIsModalOpen, 
    isViewOpen, setIsViewOpen, isDeleteOpen, setIsDeleteOpen,
    currentItem, handleAdd, handleEdit, handleView, 
    handleDeleteClick, handleConfirmDelete, handleSave 
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
      try {
        const catList = await MockService.getAll('categories');
        const taxList = await MockService.getAll('taxes');
        setCategories(catList || []);
        setTaxes(taxList || []);
      } catch (err) {
        console.error("Failed to fetch options", err);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      if (currentItem) {
        setFormData({ ...currentItem });
      } else {
        setFormData({
          name: '', productCode: '', categoryId: '', brand: '', 
          companyName: '', unit: '', packing: '', purchasePrice: '', 
          salePrice: '', mrp: '', taxId: '', minStockLevel: '', 
          expiryRequired: false, isActive: true
        });
      }
    }
  }, [currentItem, isModalOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const columns = [
    { header: 'Product Name', accessor: 'name' },
    { header: 'Code', accessor: 'productCode' },
    { 
      header: 'Category', 
      render: (row) => categories.find(c => String(c.id) === String(row.categoryId))?.name || 'N/A'
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

  const productFields = [
    { label: 'Product Name', accessor: 'name' },
    { label: 'Product Code', accessor: 'productCode' },
    { 
      label: 'Category', 
      render: (row) => categories.find(c => String(c.id) === String(row.categoryId))?.name || 'N/A'
    },
    { label: 'Brand', accessor: 'brand' },
    { label: 'Company', accessor: 'companyName' },
    { label: 'Packing', accessor: 'packing' },
    { label: 'Unit', accessor: 'unit' },
    { label: 'Purchase Price', render: (row) => `₹${row.purchasePrice}` },
    { label: 'Sale Price', render: (row) => `₹${row.salePrice}` },
    { label: 'MRP', render: (row) => `₹${row.mrp}` },
    { 
      label: 'Tax', 
      render: (row) => taxes.find(t => String(t.id) === String(row.taxId))?.name || 'N/A'
    },
    { label: 'Min Stock Level', accessor: 'minStockLevel' },
    { label: 'Expiry Required', render: (row) => row.expiryRequired ? 'Yes' : 'No' },
    { label: 'Status', render: (row) => row.isActive ? 'Active' : 'Inactive' }
  ];

  return (
    <div className="agro-container" style={{ padding: '40px' }}>
      <div className="page-header" style={{ 
        background: '#ffffff', 
        padding: '24px', 
        borderRadius: '16px', 
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeft: '8px solid #16a34a'
      }}>
        <div className="page-title">
          <h1 style={{ fontSize: '28px', color: '#111827', margin: 0 }}>Product Inventory</h1>
          <p style={{ margin: '5px 0 0', color: '#6b7280' }}>Manage your stocks, pricing and categories</p>
        </div>
        <button 
          className="btn-agro btn-primary" 
          onClick={() => { console.log("Add Button Clicked"); handleAdd(); }}
          style={{ 
            padding: '14px 28px', 
            fontSize: '16px', 
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(22, 163, 74, 0.3)',
            border: '2px solid #ffffff'
          }}
        >
          <FiPlus size={24} /> Add New Product
        </button>
      </div>

      <DataTable 
        title="Products"
        columns={columns} 
        data={data} 
        onEdit={handleEdit} 
        onDelete={handleDeleteClick}
        onView={handleView}
      />

      {/* Add/Edit Modal */}
      {isModalOpen && (
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
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  name="expiryRequired" 
                  checked={formData.expiryRequired} 
                  onChange={handleChange} 
                  style={{ width: '18px', height: '18px' }}
                />
                <label style={{ marginBottom: 0 }}>Expiry Date Required?</label>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  name="isActive" 
                  checked={formData.isActive} 
                  onChange={handleChange} 
                  style={{ width: '18px', height: '18px' }}
                />
                <label style={{ marginBottom: 0 }}>Active Status</label>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-agro btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn-agro btn-primary">
                {currentItem ? 'Update Product' : 'Save Product'}
              </button>
            </div>
          </form>
        </AdminModal>
      )}

      {/* View Modal */}
      <ViewDetailsModal 
        isOpen={isViewOpen} 
        onClose={() => setIsViewOpen(false)} 
        title="Product Details" 
        data={currentItem} 
        fields={productFields} 
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={handleConfirmDelete} 
        title="Delete Product?" 
        message={`Are you sure you want to delete ${currentItem?.name}? This will remove it from the inventory.`} 
      />
    </div>
  );
};

export default Products;
