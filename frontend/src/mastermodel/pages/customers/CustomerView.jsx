import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, User, Phone, Mail, Home, Info } from 'lucide-react';
import { MockService } from '../../services/MockService';
import '../../styles/MasterModel.css';

const CustomerView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      const item = await MockService.getById('customers', id);
      if (item) {
        setFormData(item);
      } else {
        alert('Customer not found');
        navigate('/customers');
      }
      setLoading(false);
    };
    fetchItem();
  }, [id, navigate]);

  if (loading) return <div className="agro-container">Loading...</div>;
  if (!formData) return null;

  return (
    <div className="agro-container">
      <div style={{ maxWidth: '1000px', margin: '40px auto 40px' }}>
        <div className="agro-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '24px 30px', 
            borderBottom: '1px solid #f3f4f6',
            background: 'white'
          }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: 0 }}>Customer Profile</h2>
              <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '14px' }}>Complete overview of customer data and relationship status</p>
            </div>
            <button className="btn-agro btn-outline" onClick={() => navigate('/customers')} style={{ padding: '10px 25px', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <X size={18} /> Close Profile
            </button>
          </div>

          <div style={{ display: 'flex', minHeight: '500px' }}>
            <div style={{ 
              width: '320px', 
              background: '#f9fafb', 
              padding: '40px 30px', 
              borderRight: '1px solid #f3f4f6',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                background: 'white', 
                color: '#16a34a', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '48px', 
                fontWeight: '800', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                border: '4px solid #f0fdf4',
                marginBottom: '20px'
              }}>
                {formData.name.charAt(0).toUpperCase()}
              </div>
              
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0', textAlign: 'center' }}>{formData.name}</h2>
              <span className={`badge ${formData.isActive ? 'badge-success' : 'badge-danger'}`} style={{ padding: '6px 16px', fontSize: '13px', borderRadius: '20px' }}>
                {formData.isActive ? 'Active Member' : 'Inactive'}
              </span>

              <div style={{ marginTop: '40px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <Phone size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase' }}>Mobile</div>
                    <div style={{ fontSize: '15px', color: '#374151', fontWeight: '600' }}>{formData.mobile}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <Mail size={18} />
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase' }}>Email</div>
                    <div style={{ fontSize: '14px', color: '#374151', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{formData.email || 'Not provided'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <Info size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase' }}>GST Number</div>
                    <div style={{ fontSize: '15px', color: '#374151', fontWeight: '600' }}>{formData.gstNo || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, padding: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Home size={18} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: 0 }}>Residential Address</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '12px', border: '1px dashed #e5e7eb' }}>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '10px' }}>Full Address</label>
                  <div style={{ fontSize: '15px', color: '#374151', lineHeight: '1.7', fontWeight: '500' }}>
                    {formData.address || 'No detailed address recorded for this customer.'}
                  </div>
                </div>
                
                <div style={{ padding: '16px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Registered On</label>
                  <div style={{ fontSize: '16px', color: '#111827', fontWeight: '700' }}>{formData.createdAt ? new Date(formData.createdAt).toLocaleDateString() : 'N/A'}</div>
                </div>
              </div>

              <div style={{ marginTop: '60px', padding: '20px', borderRadius: '12px', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '32px' }}>💡</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>Quick Tip</div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>You can update this customer's details anytime from the main directory by clicking the edit icon.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerView;
