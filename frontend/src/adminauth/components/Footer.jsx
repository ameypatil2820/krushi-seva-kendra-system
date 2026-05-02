import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      padding: '30px 25px',
      background: 'white',
      borderTop: '1px solid var(--border-light)',
      marginTop: 'auto',
      width: '100%'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px'
      }}>
        {/* Brand Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              background: 'var(--primary)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '800',
              fontSize: '18px'
            }}>
              S
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Shetkari Krushi Seva Kendra
            </h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
            Leading the way in agricultural excellence. Providing the best quality fertilizers, seeds, and pesticides to empower our farmers.
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '15px' }}>Contact Info</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '13px' }}>
              <MapPin size={14} color="var(--primary)" />
              Main Market Road, District Center
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '13px' }}>
              <Phone size={14} color="var(--primary)" />
              +91 98765 43210
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '14px' }}>
              <Mail size={14} color="var(--primary)" />
              contact@shetkarikrushi.com
            </li>
          </ul>
        </div>

        {/* Quick Links / Services */}
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '15px' }}>Our Services</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li style={{ color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer' }}>Quality Fertilizers</li>
            <li style={{ color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer' }}>Hybrid Seeds</li>
            <li style={{ color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer' }}>Crop Consultation</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
