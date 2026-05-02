import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { useCRUD } from '../../hooks/useCRUD';
import DataTable from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';
import '../../styles/MasterModel.css';

const SupplierList = () => {
  const navigate = useNavigate();
  const {
    data, loading, isDeleteOpen, setIsDeleteOpen,
    currentItem, handleDeleteClick, handleConfirmDelete
  } = useCRUD('suppliers');

  const columns = [
    { header: 'Supplier Name', accessor: 'name' },
    { header: 'Mobile', accessor: 'mobile' },
    { header: 'GST No', accessor: 'gstNo' },
    {
      header: 'Status',
      render: (row) => (
        <span className={`badge ${row.isActive ? 'badge-success' : 'badge-danger'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  const handleAdd = () => navigate('/suppliers/create');
  const handleEdit = (item) => navigate(`/suppliers/edit/${item.id}`);
  const handleView = (item) => navigate(`/suppliers/view/${item.id}`);

  return (
    <div className="agro-container">
      <div className="agro-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="agro-card-header" style={{ padding: '24px 30px', marginBottom: 0 }}>
          <div>
            <h2>Supplier Management</h2>
            <p>Manage your product suppliers and vendors</p>
          </div>
          <button className="btn-agro btn-primary" onClick={handleAdd}>
            <Plus size={20} /> Add Supplier
          </button>
        </div>
        
        <div style={{ padding: '30px' }}>
          <DataTable 
            title="Suppliers"
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
        title="Delete Supplier?" 
        message={`Are you sure you want to delete ${currentItem?.name}?`} 
      />
    </div>
  );
};

export default SupplierList;
