import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Truck, 
  Users, 
  ShieldCheck, 
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout, hasPermission } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Users', icon: <Users size={20} />, path: '/users', module: 'users', action: 'manage' },
    { name: 'Products', icon: <Package size={20} />, path: '/products', module: 'product', action: 'view' },
    { name: 'Customers', icon: <Users size={20} />, path: '/customers', module: 'customer', action: 'view' },
    { name: 'Sales', icon: <ShoppingCart size={20} />, path: '/sales', module: 'sale', action: 'view' },
    { name: 'Purchases', icon: <Truck size={20} />, path: '/purchases', module: 'purchase', action: 'view' },
    { name: 'Roles', icon: <ShieldCheck size={20} />, path: '/roles', module: 'roles', action: 'manage' },
  ];

  const filteredMenu = menuItems.filter(item => {
    if (!item.module) return true;
    return hasPermission(item.module, item.action);
  });

  return (
    <aside className="sidebar glass-card" style={{ width: '260px', height: '100vh', padding: '20px', borderRadius: '0' }}>
      <div className="brand" style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--primary)', fontWeight: '800', letterSpacing: '1px' }}>KRUSHI SEVA</h2>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>SYSTEM</p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: 'calc(100% - 140px)' }}>
        {filteredMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              color: isActive ? 'white' : 'var(--text-secondary)',
              background: isActive ? 'var(--primary)' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              fontWeight: isActive ? '600' : '400'
            })}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <div style={{ marginBottom: '15px', padding: '0 10px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Logged in as:</p>
            <p style={{ fontWeight: '600' }}>{user?.name}</p>
            <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>{user?.role}</span>
          </div>
          <button 
            onClick={logout}
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'flex-start', border: 'none', color: '#ef4444' }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
