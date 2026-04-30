import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

const Layout = () => {
  return (
    <div className="layout-container" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <main className="main-content" style={{ flex: 1, overflowY: 'auto', padding: '40px', background: 'var(--background)' }}>
        <motion.div
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
