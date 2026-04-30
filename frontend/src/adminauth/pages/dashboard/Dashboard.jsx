import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { STORAGE_KEYS, getFromStorage } from '../../utils/storage';
import { Package, ShoppingCart, Truck, Users, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState({
    products: 0,
    salesToday: 0,
    pendingPurchases: 0,
    users: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      // Fetch Products
      const agroData = getFromStorage(STORAGE_KEYS.AGRO_DATA) || {};
      const productCount = (agroData.products || []).length;

      // Fetch Users
      const users = getFromStorage(STORAGE_KEYS.USERS) || [];
      const userCount = users.length;

      // Fetch Sales (Calculate Today's Sales)
      const sales = getFromStorage(STORAGE_KEYS.SALES) || [];
      const today = new Date().toISOString().split('T')[0];
      const todaySales = sales
        .filter(s => s.billDate === today)
        .reduce((sum, s) => sum + (parseFloat(s.grandTotal) || 0), 0);

      // Fetch Pending Purchases (Purchases with due amount > 0)
      const purchases = getFromStorage(STORAGE_KEYS.PURCHASES) || [];
      const pendingCount = purchases.filter(p => (parseFloat(p.dueAmount) || 0) > 0).length;

      setStatsData({
        products: productCount,
        salesToday: todaySales,
        pendingPurchases: pendingCount,
        users: userCount
      });

      // Combine Sales and Purchases for Recent Activity
      const allActivity = [
        ...sales.map(s => ({ ...s, type: 'Sale', icon: <ShoppingCart size={16} />, color: '#3b82f6' })),
        ...purchases.map(p => ({ ...p, type: 'Purchase', icon: <Truck size={16} />, color: '#f59e0b' }))
      ].sort((a, b) => new Date(b.billDate || b.createdAt) - new Date(a.billDate || a.createdAt))
       .slice(0, 5);

      setRecentActivity(allActivity);
    };

    fetchData();
    
    // Listen for storage changes from other tabs
    window.addEventListener('storage', fetchData);
    
    // Polling as a fallback for same-tab changes if no global state
    const interval = setInterval(fetchData, 5000);

    return () => {
      window.removeEventListener('storage', fetchData);
      clearInterval(interval);
    };
  }, []);

  const stats = [
    { label: 'Total Products', value: statsData.products, icon: <Package size={24} />, color: '#10b981' },
    { label: 'Today\'s Sales', value: `₹${statsData.salesToday.toLocaleString()}`, icon: <ShoppingCart size={24} />, color: '#3b82f6' },
    { label: 'Pending Purchases', value: statsData.pendingPurchases, icon: <Truck size={24} />, color: '#f59e0b' },
    { label: 'Active Users', value: statsData.users, icon: <Users size={24} />, color: '#8b5cf6' },
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Recent Activity</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Clock size={14} /> Updated just now
          </span>
        </div>
        
        {recentActivity.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {recentActivity.map((activity, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ background: `${activity.color}20`, color: activity.color, padding: '10px', borderRadius: '8px' }}>
                    {activity.icon}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{activity.type} Entry</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Bill: {activity.billNo || 'N/A'} • {activity.billDate}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontWeight: '700', color: activity.type === 'Sale' ? '#10b981' : '#f59e0b' }}>
                    {activity.type === 'Sale' ? '+' : '-'} ₹{(activity.grandTotal || 0).toLocaleString()}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{activity.paymentType}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            <Clock size={40} style={{ marginBottom: '15px', opacity: 0.2 }} />
            <p>No recent activity to display.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
