import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Package, Layers, DollarSign, Calendar } from 'lucide-react';
import { MockService } from '../../services/MockService';
import '../../styles/MasterModel.css';

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      const item = await MockService.getById('products', id);
      if (item) {
        setFormData(item);
      } else {
        alert('Product not found');
        navigate('/products');
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
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: 0 }}>Product Details</h2>
              <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '14px' }}>Full technical and commercial specifications of the product</p>
            </div>
            <button className="btn-agro btn-outline" onClick={() => navigate('/products')} style={{ padding: '10px 25px', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowLeft size={18} /> Close Details
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
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                border: '4px solid #f0fdf4',
                marginBottom: '20px'
              }}>
                <Package size={48} />
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0', textAlign: 'center' }}>{formData.name}</h2>
              <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '15px' }}>Code: {formData.code}</div>
              <span className={`badge ${formData.isActive ? 'badge-success' : 'badge-danger'}`} style={{ padding: '6px 16px', fontSize: '13px', borderRadius: '20px' }}>
                {formData.isActive ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div style={{ flex: 1, padding: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Layers size={18} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: 0 }}>General Specifications</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                <div style={{ padding: '16px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Category</label>
                  <div style={{ fontSize: '16px', color: '#111827', fontWeight: '700' }}>{formData.category}</div>
                </div>

                <div style={{ padding: '16px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Company</label>
                  <div style={{ fontSize: '16px', color: '#111827', fontWeight: '700' }}>{formData.company || 'N/A'}</div>
                </div>

                <div style={{ padding: '16px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Unit Conversion</label>
                  <div style={{ fontSize: '15px', color: '#111827', fontWeight: '700' }}>
                    1 {formData.primaryUnit} = {formData.conversionFactor} {formData.secondaryUnit}
                  </div>
                </div>

                <div style={{ padding: '16px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Available Quantity</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ fontSize: '24px', color: Number(formData.currentStock) <= Number(formData.minStock) ? '#ef4444' : '#16a34a', fontWeight: '800' }}>
                      {formData.currentStock || 0} {formData.secondaryUnit}
                    </div>
                    {Number(formData.currentStock) <= Number(formData.minStock) && (
                      <span className="badge badge-danger" style={{ padding: '4px 12px' }}>⚠️ Low Stock Warning</span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>Minimum Level: {formData.minStock} {formData.secondaryUnit}</div>
                </div>

                <div style={{ padding: '16px', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Registered On</label>
                  <div style={{ fontSize: '16px', color: '#111827', fontWeight: '700' }}>{formData.createdAt ? new Date(formData.createdAt).toLocaleDateString() : 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
