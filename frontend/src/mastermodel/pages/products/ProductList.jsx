import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCRUD } from '../../hooks/useCRUD';
import DataTable from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';
import '../../styles/MasterModel.css';

const ProductList = () => {
  const navigate = useNavigate();
  const {
    data, loading, isDeleteOpen, setIsDeleteOpen,
    currentItem, handleDeleteClick, handleConfirmDelete
  } = useCRUD('products');

  const columns = [
    { header: 'Product Name', accessor: 'name' },
    { header: 'Code', accessor: 'code' },
    { header: 'Category', accessor: 'category' },
    { 
      header: 'Packing', 
      render: (row) => row.primaryUnit ? `1 ${row.primaryUnit} = ${row.conversionFactor} ${row.secondaryUnit}` : 'N/A'
    },
    {
      header: 'Current Stock',
      render: (row) => {
        const isLowStock = Number(row.currentStock) <= Number(row.minStock);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '700', color: isLowStock ? '#ef4444' : '#16a34a' }}>
              {row.currentStock || 0} {row.secondaryUnit}
            </span>
            {isLowStock && (
              <span className="badge badge-danger" style={{ fontSize: '10px', padding: '2px 8px' }}>
                Low Stock
              </span>
            )}
          </div>
        );
      }
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

  const handleAdd = () => navigate('/products/create');
  const handleEdit = (item) => navigate(`/products/edit/${item.id}`);
  const handleView = (item) => navigate(`/products/view/${item.id}`);

  return (
    <div className="agro-container">
      <div className="agro-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="agro-card-header" style={{ padding: '24px 30px', marginBottom: 0 }}>
          <div>
            <h2>Product Inventory</h2>
            <p>Manage your stocks, pricing and categories</p>
          </div>
          <button className="btn-agro btn-primary" onClick={handleAdd}>
            <Plus size={20} /> Add Product
          </button>
        </div>

        <div style={{ padding: '30px' }}>
          <DataTable
            title="Products"
            columns={columns}
            data={data}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onView={handleView}
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
};

export default ProductList;
