import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus } from 'lucide-react';
import { STORAGE_KEYS, getFromStorage } from '../../utils/storage';

const AdminRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { registerAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const users = getFromStorage(STORAGE_KEYS.USERS) || [];
    if (users.some(u => u.role === 'Admin')) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = registerAdmin(formData);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="flex-center" style={{ height: '100vh', padding: '20px' }}>
      <div className="glass-card animate-fade" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Admin Registration</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Setup your main administrative account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              className="input-field" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input-field" 
              required 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '15px' }}>{error}</p>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            <UserPlus size={18} />
            Initialize System
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;
