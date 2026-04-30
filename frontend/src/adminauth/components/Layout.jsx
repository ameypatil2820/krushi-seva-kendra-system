import React, { useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const location = useLocation();
  const { user, hasPermission } = useAuth();

  // Map URL paths to modules
  const getModuleFromPath = (path) => {
    if (path.includes('/products')) return 'product';
    if (path.includes('/categories')) return 'category';
    if (path.includes('/customers')) return 'customer';
    if (path.includes('/suppliers')) return 'supplier';
    if (path.includes('/sales')) return 'sale';
    if (path.includes('/purchase')) return 'purchase';
    if (path.includes('/tax')) return 'tax';
    if (path.includes('/users')) return 'users';
    if (path.includes('/roles')) return 'roles';
    return null;
  };

  const currentModule = getModuleFromPath(location.pathname);

  // Safety redirect for view permission
  if (currentModule && !hasPermission(currentModule, 'view')) {
    if (!((currentModule === 'roles' || currentModule === 'users') && hasPermission(currentModule, 'manage'))) {
      return <Navigate to="/dashboard" />;
    }
  }

  // Generate permission classes
  const permissionClasses = currentModule ? [
    !hasPermission(currentModule, 'create') ? 'perm-no-create' : '',
    !hasPermission(currentModule, 'edit') ? 'perm-no-edit' : '',
    !hasPermission(currentModule, 'delete') ? 'perm-no-delete' : ''
  ].join(' ') : '';

  // Global Interceptor to stop clicks on disabled buttons and add tooltips
  useEffect(() => {
    const handleGlobalInteraction = (e) => {
      const target = e.target.closest('.perm-no-create .btn-primary, .perm-no-create .btn-agro.btn-primary, .perm-no-edit [title="Edit"], .perm-no-delete [title="Delete"], .perm-no-edit .btn-agro:has(svg.lucide-edit-2), .perm-no-delete .btn-agro:has(svg.lucide-trash-2)');

      if (target) {
        // Add tooltip if not already present
        if (target.getAttribute('title') !== 'Permission Required') {
          target.setAttribute('title', 'Permission Required');
        }

        if (e.type === 'click') {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    document.addEventListener('click', handleGlobalInteraction, true);
    document.addEventListener('mouseover', handleGlobalInteraction, true);

    return () => {
      document.removeEventListener('click', handleGlobalInteraction, true);
      document.removeEventListener('mouseover', handleGlobalInteraction, true);
    };
  }, [permissionClasses]);

  return (
    <div className={`layout-container ${permissionClasses}`} style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <style>
        {`
          /* Permission Enforcement - Disabled State */
          .perm-no-create .btn-agro.btn-primary, .perm-no-create .btn-primary {
            opacity: 0.5 !important;
            filter: grayscale(0.8) !important;
            cursor: not-allowed !important;
          }
          
          .perm-no-edit button[title="Edit"], .perm-no-edit .btn-agro:has(svg.lucide-edit-2),
          .perm-no-edit [title="Edit"], .perm-no-edit [aria-label="Edit"] {
            opacity: 0.4 !important;
            filter: grayscale(1) !important;
            cursor: not-allowed !important;
          }
          
          .perm-no-delete button[title="Delete"], .perm-no-delete .btn-agro:has(svg.lucide-trash-2),
          .perm-no-delete [title="Delete"], .perm-no-delete [aria-label="Delete"] {
            opacity: 0.4 !important;
            filter: grayscale(1) !important;
            cursor: not-allowed !important;
          }
        `}
      </style>
      <Sidebar />
      <main className="main-content" style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0',
        background: 'var(--background)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Top Navbar */}
        <header style={{
          height: '90px',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 60px',
          position: 'sticky',
          top: 0,
          zIndex: 90,
          boxShadow: '0 10px 30px -15px rgba(0,0,0,0.05)'
        }}>
          {/* Welcome Section */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Hello, {user?.name?.split(' ')[0] || 'Admin'} 👋
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>

          {/* Search Section */}
          <div style={{ flex: 2, display: 'flex', justifyContent: 'center', padding: '0 40px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
              <input
                type="text"
                placeholder="Search anything..."
                style={{
                  width: '100%',
                  padding: '14px 24px 14px 54px',
                  borderRadius: '99px',
                  background: '#f1f5f9',
                  border: '1px solid transparent',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: 'var(--text-main)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  outline: 'none',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                }}
              />
              <span style={{ position: 'absolute', left: '22px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px' }}>🔍</span>
              <div style={{
                position: 'absolute',
                right: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '3px 8px',
                fontSize: '11px',
                fontWeight: '800',
                color: 'var(--text-muted)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                /
              </div>
            </div>
          </div>

          {/* Actions & Profile */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '35px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>🔔</button>
              <button style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>⚙️</button>
            </div>

            <div style={{ height: '40px', width: '1px', background: 'var(--border-light)' }}></div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '8px 12px 8px 16px',
              background: 'white',
              borderRadius: '16px',
              border: '1px solid var(--border-light)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {user?.name || 'Admin'}
                  <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '11px', padding: '3px 8px', borderRadius: '6px', fontWeight: '800', border: '1px solid #dcfce7' }}>🌱 Admin</span>
                </div>
                <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', marginTop: '2px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></span>
                  Online
                </div>
              </div>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, var(--primary-soft) 0%, #dcfce7 100%)',
                border: '2px solid white',
                boxShadow: '0 8px 16px -4px rgba(22, 163, 74, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                fontWeight: '900',
                fontSize: '20px'
              }}>
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        <div style={{ padding: '40px', flex: 1 }}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
