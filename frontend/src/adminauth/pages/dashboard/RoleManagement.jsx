import React, { useState, useEffect } from 'react';
import { STORAGE_KEYS, getFromStorage, setToStorage } from '../../utils/storage';
import { ShieldCheck, Plus, Trash2, Edit3, Save, X } from 'lucide-react';

const AVAILABLE_MODULES = [
  { id: 'product', name: 'Product' },
  { id: 'category', name: 'Category' },
  { id: 'customer', name: 'Customer' },
  { id: 'supplier', name: 'Supplier' },
  { id: 'sale', name: 'Sale' },
  { id: 'purchase', name: 'Purchase' },
  { id: 'tax', name: 'Tax' },
  { id: 'users', name: 'Users' },
  { id: 'roles', name: 'Roles' }
];

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRole, setCurrentRole] = useState({ roleName: '', permissions: {} });
  const [error, setError] = useState('');

  useEffect(() => {
    const savedRoles = getFromStorage(STORAGE_KEYS.ROLES) || [];
    setRoles(savedRoles);
  }, []);

  const handleAddRole = () => {
    setIsEditing(true);
    setCurrentRole({ roleName: '', permissions: {} });
    setError('');
  };

  const handleEditRole = (role) => {
    setIsEditing(true);
    setCurrentRole(role);
    setError('');
  };

  const toggleAction = (moduleId, action) => {
    const perms = { ...currentRole.permissions };
    const currentActions = perms[moduleId] || [];
    
    if (currentActions.includes(action)) {
      perms[moduleId] = currentActions.filter(a => a !== action);
      if (perms[moduleId].length === 0) delete perms[moduleId];
    } else {
      perms[moduleId] = [...currentActions, action];
    }
    setCurrentRole({ ...currentRole, permissions: perms });
  };

  const toggleAllModuleActions = (moduleId) => {
    const perms = { ...currentRole.permissions };
    const allActions = ['view', 'create', 'edit', 'delete'];
    const currentActions = perms[moduleId] || [];

    if (currentActions.length === allActions.length) {
      delete perms[moduleId];
    } else {
      perms[moduleId] = allActions;
    }
    setCurrentRole({ ...currentRole, permissions: perms });
  };

  const handleSave = () => {
    if (!currentRole.roleName) {
      setError('Role name is required');
      return;
    }

    let updatedRoles;
    if (currentRole.id) {
      updatedRoles = roles.map(r => r.id === currentRole.id ? currentRole : r);
    } else {
      const newRole = { ...currentRole, id: Date.now().toString() };
      updatedRoles = [...roles, newRole];
    }

    setRoles(updatedRoles);
    setToStorage(STORAGE_KEYS.ROLES, updatedRoles);
    setIsEditing(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      const updatedRoles = roles.filter(r => r.id !== id);
      setRoles(updatedRoles);
      setToStorage(STORAGE_KEYS.ROLES, updatedRoles);
    }
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>Role Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Define access control levels and permissions</p>
        </div>
        {!isEditing && (
          <button className="btn btn-primary" onClick={handleAddRole}>
            <Plus size={18} />
            Create New Role
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="glass-card" style={{ padding: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>{currentRole.id ? 'Edit Role' : 'New Role'}</h3>
          <div className="input-group">
            <label>Role Name</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Sales Manager"
              value={currentRole.roleName}
              onChange={(e) => setCurrentRole({...currentRole, roleName: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label style={{ display: 'block', marginBottom: '15px', fontWeight: 'bold', fontSize: '1rem' }}>Module Permissions</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {AVAILABLE_MODULES.map((module) => {
                const modulePerms = currentRole.permissions[module.id] || [];
                const isAll = modulePerms.length === 4;
                
                return (
                  <div key={module.id} className="glass-card" style={{ padding: '20px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                      <h4 style={{ color: 'var(--primary)' }}>{module.name}</h4>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={isAll}
                          onChange={() => toggleAllModuleActions(module.id)}
                          style={{ accentColor: 'var(--primary)' }}
                        />
                        Select All
                      </label>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {[
                        { id: 'view', label: 'View' },
                        { id: 'create', label: 'Add' },
                        { id: 'edit', label: 'Edit' },
                        { id: 'delete', label: 'Delete' }
                      ].map((action) => (
                        <label key={action.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                          <input 
                            type="checkbox" 
                            checked={modulePerms.includes(action.id)}
                            onChange={() => toggleAction(module.id, action.id)}
                            style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                          />
                          {module.name} {action.label}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '15px' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary" onClick={handleSave}>
              <Save size={18} />
              Save Role
            </button>
            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {roles.map((role) => (
            <div key={role.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={24} color="var(--primary)" />
                  <h4 style={{ fontSize: '1.2rem' }}>{role.roleName}</h4>
                </div>
                {role.roleName !== 'Admin' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleEditRole(role)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(role.id)}
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
              
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>Permissions:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {Object.entries(role.permissions).map(([module, actions]) => (
                    <div key={module} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>
                      <span style={{ fontWeight: '600', fontSize: '0.7rem' }}>{module.toUpperCase()}:</span>
                      <span style={{ fontSize: '0.7rem' }}>{actions.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
