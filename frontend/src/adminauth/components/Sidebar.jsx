import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  RotateCcw,
  ChevronDown,
  ChevronRight,
  ClipboardList
} from 'lucide-react';

import logo from '../../assets/logo.png';

const Sidebar = () => {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState({
    sales: location.pathname.startsWith('/sales'),
    purchase: location.pathname.startsWith('/purchase')
  });

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Category', icon: <Tags size={20} />, path: '/categories', module: 'category', action: 'view' },
    { name: 'Products', icon: <Package size={20} />, path: '/products', module: 'product', action: 'view' },
    { name: 'Customers', icon: <UserCheck size={20} />, path: '/customers', module: 'customer', action: 'view' },
    { name: 'Suppliers', icon: <Truck size={20} />, path: '/suppliers', module: 'supplier', action: 'view' },
    
    // Sales Group
    { 
      name: 'Sales', 
      icon: <ShoppingCart size={20} />, 
      id: 'sales',
      children: [
        { name: 'Sale Bill', icon: <ShoppingCart size={18} />, path: '/sales/entry', module: 'sale', action: 'view' },
        { name: 'Quotation', icon: <FileText size={18} />, path: '/sales/quotations', module: 'sale', action: 'view' },
        { name: 'Sale Return', icon: <RotateCcw size={18} />, path: '/sales/returns', module: 'sale', action: 'view' },
      ]
    },

    // Purchase Group
    { 
      name: 'Purchase', 
      icon: <Truck size={20} />, 
      id: 'purchase',
      children: [
        { name: 'Purchase Bill', icon: <FileText size={18} />, path: '/purchase/entry', module: 'purchase', action: 'view' },
        { name: 'Purchase Order', icon: <ClipboardList size={18} />, path: '/purchase/orders', module: 'purchase', action: 'view' },
        { name: 'Purchase Return', icon: <RotateCcw size={18} />, path: '/purchase/returns', module: 'purchase', action: 'view' },
      ]
    },

    { name: 'Tax', icon: <Percent size={20} />, path: '/tax', module: 'tax', action: 'view' },
    { name: 'Users', icon: <UserPlus size={20} />, path: '/users', module: 'users', action: 'manage' },
    { name: 'Roles', icon: <ShieldCheck size={20} />, path: '/roles', module: 'roles', action: 'manage' },
  ];

  const filterItem = (item) => {
    if (item.children) {
      const filteredChildren = item.children.filter(child => !child.module || hasPermission(child.module, child.action));
      return filteredChildren.length > 0 ? { ...item, children: filteredChildren } : null;
    }
    return !item.module || hasPermission(item.module, item.action) ? item : null;
  };

  const filteredMenu = menuItems.map(filterItem).filter(Boolean);

  return (
    <aside className="sidebar glass-card" style={{ width: '260px', height: '100vh', padding: '20px', borderRadius: '0', overflowY: 'auto' }}>
      <div className="brand" style={{ marginBottom: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src={logo} alt="Krushi Seva Logo" style={{ width: '80px', height: '80px', marginBottom: '10px', borderRadius: '12px' }} />
        <h2 style={{ color: 'var(--primary)', fontWeight: '800', letterSpacing: '1px', fontSize: '1.2rem', margin: '0' }}>KRUSHI SEVA</h2>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '0' }}>SYSTEM</p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', height: 'calc(100% - 140px)' }}>
        {filteredMenu.map((item) => (
          <div key={item.name + (item.path || '')}>
            {item.children ? (
              <>
                <div 
                  onClick={() => toggleGroup(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    color: location.pathname.startsWith(`/${item.id}`) ? 'white' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: location.pathname.startsWith(`/${item.id}`) ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {item.icon}
                    <span style={{ fontWeight: location.pathname.startsWith(`/${item.id}`) ? '600' : '400' }}>{item.name}</span>
                  </div>
                  {openGroups[item.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
                
                {openGroups[item.id] && (
                  <div style={{ paddingLeft: '20px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        style={({ isActive }) => ({
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 16px',
                          borderRadius: '8px',
                          color: isActive ? 'white' : 'var(--text-secondary)',
                          background: isActive ? 'var(--primary)' : 'transparent',
                          textDecoration: 'none',
                          transition: 'all 0.3s ease',
                          fontSize: '0.9rem',
                          fontWeight: isActive ? '600' : '400'
                        })}
                      >
                        {child.icon}
                        <span>{child.name}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
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
            )}
          </div>
        ))}

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '20px', marginBottom: '20px' }}>
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
