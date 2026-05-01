export const STORAGE_KEYS = {
  USERS: 'ksk_users',
  ROLES: 'ksk_roles',
  CURRENT_USER: 'ksk_current_user',
  SALES: 'ksk_sales',
  PURCHASES: 'ksk_purchases',
  AGRO_DATA: 'agro_erp_data'
};

export const getFromStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const setToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const initializeStorage = () => {
  let existingRoles = getFromStorage(STORAGE_KEYS.ROLES) || [];
  
  const defaultRoles = [
    {
      id: 'admin-role',
      roleName: 'Admin',
      permissions: {
        product: ['view', 'create', 'edit', 'delete'],
        category: ['view', 'create', 'edit', 'delete'],
        customer: ['view', 'create', 'edit', 'delete'],
        supplier: ['view', 'create', 'edit', 'delete'],
        sale: ['view', 'create', 'edit', 'delete'],
        purchase: ['view', 'create', 'edit', 'delete'],
        tax: ['view', 'create', 'edit', 'delete'],
        stock: ['view', 'manage'],
        billing: ['view', 'manage'],
        users: ['manage'],
        roles: ['manage']
      }
    },
    {
      id: 'user1-role',
      roleName: 'User 1',
      permissions: {
        product: ['view'],
        customer: ['view']
      }
    },
    {
      id: 'user2-role',
      roleName: 'User 2',
      permissions: {
        sale: ['view'],
        purchase: ['view']
      }
    },
    {
      id: 'user3-role',
      roleName: 'User 3',
      permissions: {
        customer: ['view']
      }
    }
  ];

  // Add missing default roles
  let updated = false;
  defaultRoles.forEach(defRole => {
    if (!existingRoles.some(r => r.roleName === defRole.roleName)) {
      existingRoles.push(defRole);
      updated = true;
    }
  });

  if (updated || existingRoles.length === 0) {
    setToStorage(STORAGE_KEYS.ROLES, existingRoles);
  }

  if (!getFromStorage(STORAGE_KEYS.USERS)) {
    setToStorage(STORAGE_KEYS.USERS, []);
  }
};
