import React, { useState, useEffect } from 'react';
import { STORAGE_KEYS, getFromStorage, setToStorage, initializeStorage } from '../../utils/storage';
import { Users, UserPlus, Trash2, Shield } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    initializeStorage();
    setUsers(getFromStorage(STORAGE_KEYS.USERS) || []);
    setRoles(getFromStorage(STORAGE_KEYS.ROLES) || []);
  }, []);

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.role) {
      setError('Please select a role');
      return;
    }

    const currentUsers = getFromStorage(STORAGE_KEYS.USERS) || [];
    if (currentUsers.some(u => u.email === newUser.email)) {
      setError('Email already exists');
      return;
    }

    const userToAdd = { ...newUser, id: Date.now().toString() };
    const updatedUsers = [...currentUsers, userToAdd];

    setUsers(updatedUsers);
    setToStorage(STORAGE_KEYS.USERS, updatedUsers);
    setIsAdding(false);
    setNewUser({ name: '', email: '', password: '', role: '' });
    setError('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const currentUsers = getFromStorage(STORAGE_KEYS.USERS) || [];
      const userToDelete = currentUsers.find(u => u.id === id);

      if (userToDelete?.role === 'Admin') {
        alert('Cannot delete Admin account');
        return;
      }

      const updatedUsers = currentUsers.filter(u => u.id !== id);
      setUsers(updatedUsers);
      setToStorage(STORAGE_KEYS.USERS, updatedUsers);
    }
  };

  return (
    <div className="agro-container">
      <div className="agro-card-header">
        <div>
          <h2 style={{ color: 'var(--primary)' }}>User Management</h2>
          <p>Manage accounts and assign access roles</p>
        </div>
        {!isAdding && (
          <button className="btn-agro btn-primary" onClick={() => setIsAdding(true)}>
            <UserPlus size={18} />
            Create New User
          </button>
        )}
      </div>

      {isAdding ? (
        <div className="agro-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="agro-card-header">
            <h3>Create New User</h3>
          </div>
          <form onSubmit={handleAddUser}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter full name"
                required
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email address"
                required
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Set a secure password"
                required
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Assign Role</label>
              <select
                className="form-control"
                style={{ appearance: 'none', background: 'var(--background)' }}
                required
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="" style={{ background: 'var(--surface)' }}>Select a Role</option>
                {roles.filter(r => r.roleName !== 'Admin').map(role => (
                  <option key={role.id} value={role.roleName} style={{ background: 'var(--surface)' }}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>

            {error && <p style={{ color: 'var(--danger)', fontSize: '13px', marginBottom: '15px', fontWeight: '600' }}>{error}</p>}

            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              <button type="submit" className="btn-agro btn-primary" style={{ flex: 1 }}>
                <UserPlus size={18} />
                Create User
              </button>
              <button type="button" className="btn-agro btn-outline" style={{ flex: 1 }} onClick={() => setIsAdding(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="agro-table-container">
          <table className="agro-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Email Address</th>
                <th>Access Role</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ 
                        width: '38px', 
                        height: '38px', 
                        borderRadius: '12px', 
                        background: 'var(--primary-soft)', 
                        color: 'var(--primary)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontWeight: '800',
                        fontSize: '16px'
                      }}>
                        {u.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: '600' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{u.email}</td>
                  <td>
                    <span style={{ 
                      padding: '6px 12px', 
                      borderRadius: '8px', 
                      fontSize: '12px', 
                      fontWeight: '800',
                      background: u.role === 'Admin' ? 'rgba(251, 191, 36, 0.1)' : 'var(--primary-soft)',
                      color: u.role === 'Admin' ? '#fbbf24' : 'var(--primary)',
                      border: `1px solid ${u.role === 'Admin' ? 'rgba(251, 191, 36, 0.2)' : 'var(--primary-soft)'}`
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <div className="action-icons">
                      {u.role !== 'Admin' && (
                        <button
                          className="action-btn btn-delete"
                          onClick={() => handleDelete(u.id)}
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
