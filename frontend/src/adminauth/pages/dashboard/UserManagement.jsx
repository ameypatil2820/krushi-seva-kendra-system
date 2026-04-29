import React, { useState, useEffect } from 'react';
import { STORAGE_KEYS, getFromStorage, setToStorage } from '../../utils/storage';
import { Users, UserPlus, Trash2, Shield } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: '' });
  const [error, setError] = useState('');

  useEffect(() => {
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
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>User Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage accounts and assign access roles</p>
        </div>
        {!isAdding && (
          <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
            <UserPlus size={18} />
            Create New User
          </button>
        )}
      </div>

      {isAdding ? (
        <div className="glass-card" style={{ padding: '30px', maxWidth: '600px' }}>
          <h3 style={{ marginBottom: '20px' }}>Create New User</h3>
          <form onSubmit={handleAddUser}>
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                className="input-field" 
                required 
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                className="input-field" 
                required 
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                className="input-field" 
                required 
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label>Assign Role</label>
              <select 
                className="input-field" 
                style={{ background: '#0f172a' }}
                required 
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                <option value="">Select a Role</option>
                {roles.filter(r => r.roleName !== 'Admin').map(role => (
                  <option key={role.id} value={role.roleName}>{role.roleName}</option>
                ))}
              </select>
            </div>

            {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '15px' }}>{error}</p>}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">
                <UserPlus size={18} />
                Create User
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAdding(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>User</th>
                <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Email</th>
                <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Role</th>
                <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '15px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {u.name.charAt(0)}
                      </div>
                      {u.name}
                    </div>
                  </td>
                  <td style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '15px 20px' }}>
                    <span className={`badge ${u.role === 'Admin' ? 'badge-warning' : 'badge-success'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                    {u.role !== 'Admin' && (
                      <button 
                        onClick={() => handleDelete(u.id)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
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
