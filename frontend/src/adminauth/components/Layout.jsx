import React, { useEffect } from 'react';
import { Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Search, UserCircle } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mainContentRef = React.useRef(null);
  const { user, hasPermission } = useAuth();

  // Reset scroll to top on route change
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  // Sidebar Menu Items for Search
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Category', path: '/categories', module: 'category', action: 'view' },
    { name: 'Products', path: '/products', module: 'product', action: 'view' },
    { name: 'Customers', path: '/customers', module: 'customer', action: 'view' },
    { name: 'Suppliers', path: '/suppliers', module: 'supplier', action: 'view' },
    { name: 'Stock', path: '/stock', module: 'stock', action: 'view' },
    { name: 'Billing', path: '/billing', module: 'billing', action: 'view' },
    { name: 'Sale Bill', path: '/sales/entry', module: 'sale', action: 'view' },
    { name: 'Quotation', path: '/sales/quotations', module: 'sale', action: 'view' },
    { name: 'Sale Return', path: '/sales/returns', module: 'sale', action: 'view' },
    { name: 'Purchase Bill', path: '/purchase/entry', module: 'purchase', action: 'view' },
    { name: 'Purchase Order', path: '/purchase/orders', module: 'purchase', action: 'view' },
    { name: 'Purchase Return', path: '/purchase/returns', module: 'purchase', action: 'view' },
    { name: 'Tax', path: '/tax', module: 'tax', action: 'view' },
    { name: 'Users', path: '/users', module: 'users', action: 'manage' },
    { name: 'Roles', path: '/roles', module: 'roles', action: 'manage' },
  ];

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const filtered = menuItems.filter(item =>
        item.name.toLowerCase().startsWith(query.toLowerCase()) &&
        (!item.module || hasPermission(item.module, item.action))
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle Suggestion Click
  const handleSuggestionClick = (path) => {
    navigate(path);
    setSearchQuery('');
    setShowSuggestions(false);
  };

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

  // Determine if current page is a create/entry page that should be fullscreen
  const isFullScreenPage = location.pathname.endsWith('/new') ||
    location.pathname.endsWith('/entry') ||
    location.pathname.includes('/view/');

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

      {!isFullScreenPage && <Sidebar />}

      <main ref={mainContentRef} className="main-content" style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0',
        background: 'var(--background)'
      }}>
        {/* Top Navbar */}
        {!isFullScreenPage && (
          <header style={{
            minHeight: '80px',
            height: 'auto',
            margin: '20px 25px 0 25px',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 30px',
            borderRadius: '16px',
            boxShadow: 'var(--shadow)',
            position: 'relative',
            zIndex: 90,
            border: '1px solid var(--border-light)'
          }}>
            {/* Search Section on the Left */}
            <div style={{ flex: 2, display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                  style={{
                    width: '100%',
                    padding: '14px 24px 14px 54px',
                    borderRadius: '12px',
                    background: 'transparent',
                    border: '1px solid #e2e8f0',
                    fontSize: '15px',
                    fontWeight: '500',
                    color: 'var(--text-main)',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                />
                
                {/* Search Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '110%',
                    left: 0,
                    right: 0,
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    zIndex: 100,
                    overflow: 'hidden',
                    padding: '8px'
                  }}>
                    {suggestions.map((item) => (
                      <div
                        key={item.path}
                        onClick={() => handleSuggestionClick(item.path)}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'var(--text-main)',
                          transition: 'background 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <span>{item.name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>Go to page →</span>
                      </div>
                    ))}
                  </div>
                )}
                {/* Close suggestions when clicking outside */}
                {showSuggestions && (
                  <div 
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }}
                    onClick={() => setShowSuggestions(false)}
                  />
                )}
                <div style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                  <Search size={20} color="var(--text-muted)" />
                </div>
              </div>
            </div>

            {/* Spacer Middle */}
            <div style={{ flex: 1 }}></div>

            {/* User Profile / Login Symbol on the Right */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <div style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                border: '2px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: 'var(--primary)',
                fontWeight: '800',
                fontSize: '18px'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </header>
        )}

        <div style={{ padding: '0', overflowX: 'hidden' }}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </div>

        {!isFullScreenPage && <Footer />}
      </main>
    </div>
  );
};

export default Layout;
