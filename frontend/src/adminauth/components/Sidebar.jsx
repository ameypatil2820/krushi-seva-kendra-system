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
  ClipboardList,
  Box,
  Clock,
  AlertCircle
} from 'lucide-react';

import logo from '../../assets/logo.png';

const Sidebar = () => {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState({
    sales: location.pathname.startsWith('/sales'),
    purchase: location.pathname.startsWith('/purchase'),
    stock: location.pathname.startsWith('/stock')
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
    
    // Stock Group
    { 
      name: 'Stock', 
      icon: <Box size={20} />, 
      id: 'stock',
      children: [
        { name: 'Stock Master', icon: <Package size={18} />, path: '/stock/master', module: 'stock', action: 'view' },
        { name: 'Stock Child', icon: <Box size={18} />, path: '/stock/child', module: 'stock', action: 'view' },
        { name: 'Expiry Tracking', icon: <Clock size={18} />, path: '/stock/expiry', module: 'stock', action: 'view' }
      ]
    },
    
    // Sales Group
    { 
      name: 'Sales', 
      icon: <ShoppingCart size={20} />, 
      id: 'sales',
      children: [
        { name: 'Sale Bill', icon: <ShoppingCart size={18} />, path: '/sales/bills', module: 'sale', action: 'view' },
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
        { name: 'Purchase Bill', icon: <FileText size={18} />, path: '/purchase/bills', module: 'purchase', action: 'view' },
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
    <aside className="sidebar" style={{ 
      width: '280px', 
      height: '100vh', 
      background: 'linear-gradient(180deg, #064e3b 0%, #065f46 100%)', 
      padding: '30px 20px', 
      display: 'flex', 
      flexDirection: 'column',
      color: 'white',
      boxShadow: '4px 0 24px rgba(0,0,0,0.1)',
      zIndex: 100,
      position: 'relative'
    }}>
      <div className="brand" style={{ marginBottom: '50px', textAlign: 'left', padding: '0 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
            <img src={logo} alt="Logo" style={{ width: '35px', height: '35px' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '0.5px', margin: 0 }}>AGRO SEVA</h2>
            <p style={{ fontSize: '10px', color: '#34d399', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Management System</p>
          </div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
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
                    padding: '14px 16px',
                    borderRadius: '12px',
                    color: location.pathname.startsWith(`/${item.id}`) ? 'white' : 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    background: location.pathname.startsWith(`/${item.id}`) ? 'rgba(255,255,255,0.1)' : 'transparent'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.background = location.pathname.startsWith(`/${item.id}`) ? 'rgba(255,255,255,0.1)' : 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {item.icon}
                    <span style={{ fontWeight: '600', fontSize: '15px' }}>{item.name}</span>
                  </div>
                  {openGroups[item.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
                
                {openGroups[item.id] && (
                  <div style={{ paddingLeft: '20px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        style={({ isActive }) => ({
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                          background: isActive ? '#10b981' : 'transparent',
                          textDecoration: 'none',
                          transition: 'all 0.3s',
                          fontSize: '14px',
                          fontWeight: isActive ? '700' : '500'
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
                  gap: '15px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                  background: isActive ? '#10b981' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '15px'
                })}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ padding: '0 15px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px' }}>
            {user?.name?.charAt(0)}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontWeight: '700', fontSize: '14px', margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name}</p>
            <p style={{ fontSize: '11px', color: '#34d399', margin: 0, fontWeight: '600' }}>{user?.role?.toUpperCase()}</p>
          </div>
        </div>
        <button
          onClick={logout}
          style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: '10px', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            color: '#fca5a5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            cursor: 'pointer',
            fontWeight: '700',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#fca5a5'; }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
