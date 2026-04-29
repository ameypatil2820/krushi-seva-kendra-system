export const STORAGE_KEYS = {
  USERS: 'ksk_users',
  ROLES: 'ksk_roles',
  CURRENT_USER: 'ksk_current_user'
};

export const getFromStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const setToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const initializeStorage = () => {
  if (!getFromStorage(STORAGE_KEYS.ROLES)) {
    const defaultRoles = [
      {
        id: 'admin-role',
        roleName: 'Admin',
        permissions: {
          product: ['view', 'create', 'edit', 'delete'],
          customer: ['view', 'create', 'edit', 'delete'],
          sale: ['view', 'create', 'edit', 'delete'],
          purchase: ['view', 'create', 'edit', 'delete'],
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
    setToStorage(STORAGE_KEYS.ROLES, defaultRoles);
  }
  if (!getFromStorage(STORAGE_KEYS.USERS)) {
    setToStorage(STORAGE_KEYS.USERS, []);
  }
};
