import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Lock } from 'lucide-react';

const ModulePage = ({ title, module }) => {
  const { hasPermission } = useAuth();

  const canCreate = hasPermission(module, 'create');
  const canView = hasPermission(module, 'view');

  if (!canView) {
    return (
      <div className="flex-center" style={{ height: '60vh', flexDirection: 'column', gap: '20px' }}>
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '30px', borderRadius: '50%' }}>
          <Lock size={48} />
        </div>
        <h2 style={{ color: '#ef4444' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)' }}>You don't have permission to view this module.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>{title}</h1>
        {canCreate && (
          <button className="btn btn-primary">
            <Plus size={18} />
            Create New
          </button>
        )}
      </div>

      <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          This is the {title} module. Only users with <strong>{module}:view</strong> permission can see this, 
          and only those with <strong>{module}:create</strong> can see the button above.
        </p>
      </div>
    </div>
  );
};

export default ModulePage;
