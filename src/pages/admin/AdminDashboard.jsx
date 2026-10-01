import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { fetchPendingPromotions } from '../../store/slices/adminSlice';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { pendingPromotions } = useSelector((state) => state.admin);

  const isSuperAdmin = user?.user?.role === 'ROLE_SUPER_ADMIN';

  useEffect(() => {
    dispatch(fetchPendingPromotions());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.welcome}>
            Welcome, {user?.user?.firstName}! {isSuperAdmin ? '👑' : '🧑‍💼'}
          </h1>
          <p style={styles.subtitle}>
            {isSuperAdmin ? 'Super Admin Dashboard' : 'Admin Dashboard'}
          </p>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <StatCard icon="⏳" label="Pending Promotions" value={pendingPromotions.length} />
        <StatCard icon="👥" label="Total Users" value="—" />
        <StatCard icon="🎓" label="Alumni" value="—" />
        <StatCard icon="📅" label="Events" value="—" />
      </div>

      {/* Super Admin Actions */}
      {isSuperAdmin && (
        <>
          <h2 style={styles.sectionTitle}>👑 Super Admin Actions</h2>
          <div style={styles.actionRow}>
            <ActionCard
              icon="👥"
              title="Manage Admins"
              description="Create, deactivate, or delete admin accounts"
              onClick={() => navigate('/admin/team')}
            />
            <ActionCard
              icon="📜"
              title="Audit Logs"
              description="See who did what and when"
              onClick={() => navigate('/admin/audit-logs')}
            />
          </div>
        </>
      )}

      {/* Regular Admin Actions */}
      <h2 style={styles.sectionTitle}>🧑‍💼 Admin Actions</h2>
      <div style={styles.actionRow}>
        <ActionCard
          icon="⏳"
          title="Pending Promotions"
          description={`${pendingPromotions.length} request(s) awaiting approval`}
          onClick={() => navigate('/admin/promotions')}
        />
        <ActionCard
          icon="👥"
          title="Manage Users"
          description="View and manage students and alumni"
          onClick={() => navigate('/admin/users')}
        />
      </div>
    </div>
  );
};

// ==================== SMALL COMPONENTS ====================

const StatCard = ({ icon, label, value }) => (
  <div style={styles.statCard}>
    <div style={styles.statIcon}>{icon}</div>
    <div style={styles.statValue}>{value}</div>
    <div style={styles.statLabel}>{label}</div>
  </div>
);

const ActionCard = ({ icon, title, description, onClick }) => (
  <button style={styles.actionCard} onClick={onClick}>
    <div style={styles.actionIcon}>{icon}</div>
    <div style={styles.actionContent}>
      <h3 style={styles.actionTitle}>{title}</h3>
      <p style={styles.actionDesc}>{description}</p>
    </div>
    <div style={styles.actionArrow}>→</div>
  </button>
);

// ==================== STYLES ====================

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '40px auto',
    padding: '0 24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    gap: '16px',
    flexWrap: 'wrap',
  },
  welcome: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#1e293b',
    margin: '0 0 4px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  logoutBtn: {
    padding: '10px 20px',
    background: 'white',
    color: '#ef4444',
    border: '1.5px solid #fecaca',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '36px',
  },
  statCard: {
    background: 'white',
    borderRadius: '14px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: '1px solid #f1f5f9',
  },
  statIcon: { fontSize: '24px', marginBottom: '8px' },
  statValue: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '2px',
  },
  statLabel: { fontSize: '12px', color: '#64748b', fontWeight: '600' },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#334155',
    margin: '0 0 16px 0',
  },
  actionRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  actionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    background: 'white',
    border: '1.5px solid #f1f5f9',
    borderRadius: '14px',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  },
  actionIcon: {
    width: '48px',
    height: '48px',
    background: '#eef2ff',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    flexShrink: 0,
  },
  actionContent: { flex: 1 },
  actionTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 4px 0',
  },
  actionDesc: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
  },
  actionArrow: { color: '#94a3b8', fontSize: '18px' },
};

export default AdminDashboard;