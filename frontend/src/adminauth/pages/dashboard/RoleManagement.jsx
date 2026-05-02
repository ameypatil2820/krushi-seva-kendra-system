import React, { useState, useEffect } from 'react';
import { STORAGE_KEYS, getFromStorage, setToStorage } from '../../utils/storage';
import { ShieldCheck, Plus, Trash2, Edit3, Save, X } from 'lucide-react';

import '../../../mastermodel/styles/MasterModel.css';

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
    <div className="agro-container" style={{ padding: '0 25px' }}>
      <div className="agro-unified-card" style={{ 
        background: 'white', 
        borderRadius: '16px', 
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--border-light)',
        marginTop: '5px',
        overflow: 'hidden'
      }}>
        <div className="agro-header-compact" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '12px 20px',
          borderBottom: '1px solid var(--border-light)',
          background: 'white'
        }}>
          <div>
            <h2 style={{ fontSize: '18px', marginBottom: '1px' }}>Role Management</h2>
            <p style={{ fontSize: '12px', margin: 0 }}>Define access control levels and permissions</p>
          </div>
          {!isEditing && (
            <button className="btn-agro btn-primary" onClick={handleAddRole} style={{ height: '34px', padding: '0 12px', fontSize: '12px' }}>
              <Plus size={16} /> Create Role
            </button>
          )}
        </div>

        <div style={{ padding: '20px' }}>
          {isEditing ? (
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--primary)' }}>
                <ShieldCheck size={20} />
                <h3 style={{ fontSize: '16px', margin: 0, fontWeight: '700' }}>{currentRole.id ? 'Edit System Role' : 'Create System Role'}</h3>
              </div>
              <div className="form-group" style={{ maxWidth: '400px' }}>
                <label style={{ fontSize: '12px', marginBottom: '4px' }}>Role Name</label>
                <input type="text" className="form-control" style={{ height: '36px', fontSize: '13px' }} placeholder="e.g. Sales Manager" value={currentRole.roleName} onChange={(e) => setCurrentRole({ ...currentRole, roleName: e.target.value })} />
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '15px', display: 'block', color: 'var(--text-dark)' }}>Module-wise Permissions</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                  {AVAILABLE_MODULES.map((module) => {
                    const modulePerms = currentRole.permissions[module.id] || [];
                    const isAll = modulePerms.length === 4;
                    return (
                      <div key={module.id} style={{ background: 'white', padding: '15px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                          <span style={{ fontWeight: '700', fontSize: '13px', color: 'var(--primary)' }}>{module.name}</span>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', cursor: 'pointer', color: '#64748b' }}>
                            <input type="checkbox" checked={isAll} onChange={() => toggleAllModuleActions(module.id)} /> All
                          </label>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          {[
                            { id: 'view', label: 'View' },
                            { id: 'create', label: 'Add' },
                            { id: 'edit', label: 'Edit' },
                            { id: 'delete', label: 'Delete' }
                          ].map((action) => (
                            <label key={action.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: '#334155' }}>
                              <input type="checkbox" checked={modulePerms.includes(action.id)} onChange={() => toggleAction(module.id, action.id)} style={{ accentColor: 'var(--primary)' }} />
                              {action.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {error && <p style={{ color: '#ef4444', fontSize: '12px', margin: '15px 0' }}>{error}</p>}

              <div style={{ display: 'flex', gap: '10px', marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                <button className="btn-agro btn-primary" onClick={handleSave} style={{ height: '38px', padding: '0 25px' }}><Save size={16} /> Save Changes</button>
                <button className="btn-agro btn-outline" onClick={() => setIsEditing(false)} style={{ height: '38px', padding: '0 25px' }}><X size={16} /> Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {roles.map((role) => (
                <div
                  key={role.id}
                  style={{
                    background: 'white',
                    padding: '18px',
                    borderRadius: '14px',
                    border: '1px solid var(--border-light)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    cursor: role.roleName !== 'Admin' ? 'pointer' : 'default',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => role.roleName !== 'Admin' && handleEditRole(role)}
                  onMouseEnter={(e) => role.roleName !== 'Admin' && (e.currentTarget.style.borderColor = 'var(--primary)', e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)')}
                  onMouseLeave={(e) => role.roleName !== 'Admin' && (e.currentTarget.style.borderColor = 'var(--border-light)', e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldCheck size={20} color="var(--primary)" />
                      </div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>{role.roleName}</h4>
                    </div>
                    {role.roleName !== 'Admin' && (
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(role.id); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px' }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Permissions</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {Object.entries(role.permissions).map(([module, actions]) => (
                        <div key={module} style={{ background: '#f8fafc', padding: '4px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          <span style={{ fontWeight: '800', fontSize: '10px', color: 'var(--primary)', textTransform: 'capitalize' }}>{module}:</span>
                          <span style={{ fontSize: '10px', color: '#334155', marginLeft: '4px' }}>{actions.join(', ')}</span>
                        </div>
                      ))}
                      {Object.keys(role.permissions).length === 0 && <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No permissions assigned</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
