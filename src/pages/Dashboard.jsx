import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProfile, fetchPromotionStatus } from '../store/slices/profileSlice';
import { logout } from '../store/slices/authSlice';
import ProfileCard from '../components/dashboard/ProfileCard';
import PromotionCard from '../components/dashboard/PromotionCard';
import QuickActions from '../components/dashboard/QuickActions';
import RecentActivity from '../components/dashboard/RecentActivity';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, promotionStatus, isLoading } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchPromotionStatus());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (isLoading || !profile) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Welcome header with logout button */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.welcome}>
            Welcome back, {profile.firstName}! 👋
          </h1>
          <p style={styles.subtitle}>
            Here's what's happening with your account
          </p>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {/* Row 1: Profile + Promotion */}
      <div className="dashboard-row">
        <ProfileCard profile={profile} />
        <PromotionCard profile={profile} promotionStatus={promotionStatus} />
      </div>

      {/* Row 2: Quick Actions + Recent Activity */}
      <div className="dashboard-row">
        <QuickActions />
        <RecentActivity profile={profile} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
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
    fontSize: '28px',
    fontWeight: '800',
    color: '#1e293b',
    margin: '0 0 6px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '15px',
    color: '#64748b',
    margin: 0,
  },
  logoutBtn: {
    padding: '11px 22px',
    background: 'white',
    color: '#ef4444',
    border: '1.5px solid #fecaca',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
  },
  loading: {
    textAlign: 'center',
    padding: '100px 20px',
    fontSize: '16px',
    color: '#64748b',
  },
};

export default Dashboard;