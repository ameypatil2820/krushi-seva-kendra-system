import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCRUD } from '../../hooks/useCRUD';
import DataTable from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';
import '../../styles/MasterModel.css';

const TaxList = () => {
  const navigate = useNavigate();
  const {
    data, loading, isDeleteOpen, setIsDeleteOpen,
    currentItem, handleDeleteClick, handleConfirmDelete
  } = useCRUD('taxes');

  const columns = [
    { header: 'Tax Name', accessor: 'name' },
    { header: 'Rate (%)', render: (row) => `${row.rate}%` },
    {
      header: 'Status',
      render: (row) => (
        <span className={`badge ${row.isActive ? 'badge-success' : 'badge-danger'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  const handleAdd = () => navigate('/taxes/create');
  const handleEdit = (item) => navigate(`/taxes/edit/${item.id}`);

  return (
    <div className="agro-container">
      <div className="agro-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="agro-card-header" style={{ padding: '24px 30px', marginBottom: 0 }}>
          <div>
            <h2>Tax Management</h2>
            <p>Configure GST rates and other taxes</p>
          </div>
          <button className="btn-agro btn-primary" onClick={handleAdd}>
            <Plus size={20} /> Add Tax
          </button>
        </div>
        
        <div style={{ padding: '30px' }}>
          <DataTable 
            title="Taxes" 
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
        title="Delete Tax?" 
        message={`Are you sure you want to delete ${currentItem?.name}?`} 
      />
    </div>
  );
};

export default TaxList;
