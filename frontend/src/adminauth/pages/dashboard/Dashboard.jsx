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
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
          Namaste, {user?.name}! 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
          Welcome back to Agro Seva. Here is what's happening with your center today.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px', marginBottom: '40px' }}>
        {stats.map((stat, i) => (
          <div key={i} className="agro-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '30px', transition: 'transform 0.3s' }}>
            <div style={{ 
              background: `${stat.color}15`, 
              color: stat.color, 
              width: '60px', 
              height: '60px', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: `0 8px 16px -4px ${stat.color}20`
            }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{stat.label}</p>
              <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="agro-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="agro-card-header" style={{ padding: '25px 30px', background: 'white' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>Recent Business Activity</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Latest 5 transactions from sales and purchases</p>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '700', background: 'var(--primary-soft)', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} /> Live Updates
          </span>
        </div>
        
        <div style={{ padding: '20px 30px 40px' }}>
          {recentActivity.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentActivity.map((activity, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '18px 25px', 
                  background: '#f9fafb', 
                  borderRadius: '16px', 
                  border: '1px solid #f1f5f9',
                  transition: 'all 0.2s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ 
                      background: 'white', 
                      color: activity.color, 
                      width: '45px', 
                      height: '45px', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                      {activity.icon}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>{activity.type} Entry</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Bill: {activity.billNo || 'N/A'}</span>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }}></span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{activity.billDate}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: activity.type === 'Sale' ? '#16a34a' : '#ea580c' }}>
                      {activity.type === 'Sale' ? '+' : '-'} ₹{(activity.grandTotal || 0).toLocaleString()}
                    </p>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: '700', 
                      textTransform: 'uppercase', 
                      color: 'var(--text-muted)',
                      letterSpacing: '0.5px'
                    }}>
                      {activity.paymentType}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ width: '80px', height: '80px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Clock size={32} style={{ opacity: 0.2 }} />
              </div>
              <p style={{ fontWeight: '600' }}>No recent activity to display.</p>
              <p style={{ fontSize: '13px' }}>Transactions will appear here once you start billing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
