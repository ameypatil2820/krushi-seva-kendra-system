import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package } from 'lucide-react';
import { useCRUD } from '../../hooks/useCRUD';
import { MockService } from '../../services/MockService';
import DataTable from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';
import '../../styles/MasterModel.css';

const CategoryList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const {
    data, loading, isDeleteOpen, setIsDeleteOpen,
    currentItem, handleDeleteClick, handleConfirmDelete
  } = useCRUD('categories');

  useEffect(() => {
    MockService.getAll('products').then(setProducts);
  }, []);

  const getProductCount = (categoryName) => {
    return products.filter(p => p.category === categoryName).length;
  };

  const columns = [
    { header: 'Category Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    {
      header: 'Products',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Package size={16} color="#16a34a" />
          <span style={{ fontWeight: 'bold', color: '#16a34a' }}>{getProductCount(row.name)}</span>
        </div>
      )
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

  const handleAdd = () => navigate('/categories/create');
  const handleEdit = (item) => navigate(`/categories/edit/${item.id}`);

  return (
    <div className="agro-container">
      <div className="agro-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="agro-card-header" style={{ padding: '24px 30px', marginBottom: 0 }}>
          <div>
            <h2>Product Categories</h2>
            <p>Manage product groupings and classifications</p>
          </div>
          <button className="btn-agro btn-primary" onClick={handleAdd}>
            <Plus size={20} /> Add Category
          </button>
        </div>
        
        <div style={{ padding: '30px' }}>
          <DataTable 
            title="Categories" 
            columns={columns} 
            data={data} 
            onEdit={handleEdit} 
            onDelete={handleDeleteClick} 
          />
        </div>
      </div>

      <ConfirmModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={handleConfirmDelete} 
        title="Delete Category?" 
        message={`Are you sure you want to delete ${currentItem?.name}?`} 
      />
    </div>
  );
};

export default CategoryList;
