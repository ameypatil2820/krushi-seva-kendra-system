import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCRUD } from '../../hooks/useCRUD';
import DataTable from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';
import '../../styles/MasterModel.css';

const CustomerList = () => {
  const navigate = useNavigate();
  const {
    data, loading, isDeleteOpen, setIsDeleteOpen,
    currentItem, handleDeleteClick, handleConfirmDelete
  } = useCRUD('customers');

  const columns = [
    { header: 'Customer Name', accessor: 'name' },
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

  const handleAdd = () => navigate('/customers/create');
  const handleEdit = (item) => navigate(`/customers/edit/${item.id}`);
  const handleView = (item) => navigate(`/customers/view/${item.id}`);

  return (
    <div className="agro-container">
      <div className="agro-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="agro-card-header" style={{ padding: '24px 30px', marginBottom: 0 }}>
          <div>
            <h2>Customer Directory</h2>
            <p>Maintain detailed records of your farmers and customers</p>
          </div>
          <button className="btn-agro btn-primary" onClick={handleAdd}>
            <Plus size={20} /> Add Customer
          </button>
        </div>
        
        <div style={{ padding: '30px' }}>
          <DataTable 
            title="Customers"
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
        title="Delete Customer?" 
        message={`Are you sure you want to delete ${currentItem?.name}?`} 
      />
    </div>
  );
};

export default CustomerList;
