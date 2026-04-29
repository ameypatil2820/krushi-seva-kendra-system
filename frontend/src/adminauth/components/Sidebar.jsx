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
  LogOut,
  Tags,
  UserCheck,
  Percent,
  UserPlus,
  FileText,
  RotateCcw
} from 'lucide-react';

import logo from '../../assets/logo.png';

const Sidebar = () => {
  const { user, logout, hasPermission } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Category', icon: <Tags size={20} />, path: '/categories', module: 'category', action: 'view' },
    { name: 'Products', icon: <Package size={20} />, path: '/products', module: 'product', action: 'view' },
    { name: 'Customers', icon: <UserCheck size={20} />, path: '/customers', module: 'customer', action: 'view' },
    { name: 'Suppliers', icon: <Truck size={20} />, path: '/suppliers', module: 'supplier', action: 'view' },
    { name: 'Sales', icon: <ShoppingCart size={20} />, path: '/sales', module: 'sale', action: 'view' },
    { name: 'Purchase Bill', icon: <FileText size={20} />, path: '/purchase/entry', module: 'purchase', action: 'view' },
    { name: 'Purchase Order', icon: <ShoppingCart size={20} />, path: '/purchase/orders', module: 'purchase', action: 'view' },
    { name: 'Purchase Return', icon: <RotateCcw size={20} />, path: '/purchase/returns', module: 'purchase', action: 'view' },
    { name: 'Tax', icon: <Percent size={20} />, path: '/tax', module: 'tax', action: 'view' },
    { name: 'Users', icon: <UserPlus size={20} />, path: '/users', module: 'users', action: 'manage' },
    { name: 'Roles', icon: <ShieldCheck size={20} />, path: '/roles', module: 'roles', action: 'manage' },
  ];

  const filteredMenu = menuItems.filter(item => {
    if (!item.module) return true;
    return hasPermission(item.module, item.action);
  });

  return (
    <aside className="sidebar glass-card" style={{ width: '260px', height: '100vh', padding: '20px', borderRadius: '0' }}>
      <div className="brand" style={{ marginBottom: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src={logo} alt="Krushi Seva Logo" style={{ width: '80px', height: '80px', marginBottom: '10px', borderRadius: '12px' }} />
        <h2 style={{ color: 'var(--primary)', fontWeight: '800', letterSpacing: '1px', fontSize: '1.2rem', margin: '0' }}>KRUSHI SEVA</h2>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '0' }}>SYSTEM</p>
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
