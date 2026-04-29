import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn } from 'lucide-react';
import { STORAGE_KEYS, getFromStorage } from '../../utils/storage';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
    
    const users = getFromStorage(STORAGE_KEYS.USERS);
    if (!users || users.length === 0) {
      navigate('/register-admin');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = login(formData.email, formData.password);
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
          <h2 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign in to manage your Krushi Seva Kendra</p>
        </div>

        <form onSubmit={handleSubmit}>
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
            <LogIn size={18} />
            Login
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <p>Only users created by Admin can login.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
