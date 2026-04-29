import { useState, useEffect } from 'react';
import { MockService } from '../services/MockService';

export const useCRUD = (module) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const refreshData = async () => {
    setLoading(true);
    const result = await MockService.getAll(module);
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, [module]);

  const handleAdd = () => {
    setCurrentItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await MockService.delete(module, id);
      refreshData();
    }
  };

  const handleSave = async (formData) => {
    if (currentItem) {
      await MockService.update(module, currentItem.id, formData);
    } else {
      await MockService.add(module, formData);
    }
    setIsModalOpen(false);
    refreshData();
  };

  return {
    data,
    loading,
    isModalOpen,
    setIsModalOpen,
    currentItem,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave
  };
};
