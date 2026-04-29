// Mock Service for AgroERP
const STORAGE_KEY = 'agro_erp_data';

const getInitialData = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  
  return {
    suppliers: [],
    customers: [],
    categories: [
      { id: 1, name: 'Fertilizers', description: 'Chemical and organic fertilizers', isActive: true, createdAt: new Date().toISOString() },
      { id: 2, name: 'Pesticides', description: 'Insecticides and herbicides', isActive: true, createdAt: new Date().toISOString() }
    ],
    taxes: [
      { id: 1, name: 'GST 5%', percentage: 5, isActive: true, createdAt: new Date().toISOString() },
      { id: 2, name: 'GST 12%', percentage: 12, isActive: true, createdAt: new Date().toISOString() },
      { id: 3, name: 'GST 18%', percentage: 18, isActive: true, createdAt: new Date().toISOString() }
    ],
    products: []
  };
};

let db = getInitialData();

const saveDB = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

export const MockService = {
  getAll: (module) => Promise.resolve(db[module] || []),
  
  add: (module, item) => {
    const newItem = { 
      ...item, 
      id: Date.now(), 
      createdAt: new Date().toISOString(),
      isActive: item.isActive !== undefined ? item.isActive : true 
    };
    db[module].push(newItem);
    saveDB();
    return Promise.resolve(newItem);
  },
  
  update: (module, id, updatedItem) => {
    const index = db[module].findIndex(item => item.id === id);
    if (index !== -1) {
      db[module][index] = { ...db[module][index], ...updatedItem };
      saveDB();
      return Promise.resolve(db[module][index]);
    }
    return Promise.reject('Item not found');
  },
  
  delete: (module, id) => {
    db[module] = db[module].filter(item => item.id !== id);
    saveDB();
    return Promise.resolve(true);
  }
};
