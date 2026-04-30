import React, { useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const location = useLocation();
  const { hasPermission } = useAuth();

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
    if (!( (currentModule === 'roles' || currentModule === 'users') && hasPermission(currentModule, 'manage') )) {
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
      <main className="main-content" style={{ flex: 1, overflowY: 'auto', padding: '40px', background: 'var(--background)' }}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
