import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      padding: '25px',
      background: 'transparent',
      borderTop: '1px solid #f4f4f5',
      marginTop: 'auto',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        fontSize: '13px',
        color: '#71717a', // Zinc-500
        textAlign: 'center',
        fontWeight: '500',
        letterSpacing: '0.01em'
      }}>
        Copyright © 2026 <strong style={{ color: '#18181b', fontWeight: '700' }}>Krushi Seva Kendra</strong>. Designed with <span style={{ color: '#ef4444' }}>❤️</span> by <a href="#" style={{ color: '#3b82f6', fontWeight: '700', textDecoration: 'none' }}>Cloud Regex</a> All rights reserved
      </div>
    </footer>
  );
};

export default Footer;

