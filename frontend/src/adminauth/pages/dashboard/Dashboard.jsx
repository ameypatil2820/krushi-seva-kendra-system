import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Package, ShoppingCart, Truck, Users } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Products', value: '124', icon: <Package size={24} />, color: '#10b981' },
    { label: 'Today\'s Sales', value: '₹12,450', icon: <ShoppingCart size={24} />, color: '#3b82f6' },
    { label: 'Pending Purchases', value: '8', icon: <Truck size={24} />, color: '#f59e0b' },
    { label: 'Active Users', value: '5', icon: <Users size={24} />, color: '#8b5cf6' },
  ];

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>Welcome, {user?.name}!</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Here's an overview of your Krushi Seva Kendra today.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: `${stat.color}20`, color: stat.color, padding: '15px', borderRadius: '12px' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: '30px', minHeight: '300px' }}>
        <h3 style={{ marginBottom: '20px' }}>Recent Activity</h3>
        <p style={{ color: 'var(--text-secondary)' }}>No recent activity to display.</p>
      </div>
    </div>
  );
};

export default Dashboard;
