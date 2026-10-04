import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProfile, fetchPromotionStatus } from '../store/slices/profileSlice';
import { fetchMyRsvps, fetchMyOrganized } from '../store/slices/eventSlice';
import { logout } from '../store/slices/authSlice';
import ProfileCard from '../components/dashboard/ProfileCard';
import PromotionCard from '../components/dashboard/PromotionCard';
import QuickActions from '../components/dashboard/QuickActions';
import RecentActivity from '../components/dashboard/RecentActivity';
import EventCard from './events/EventCard';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, promotionStatus, isLoading } = useSelector((state) => state.profile);
  const { myRsvps, myOrganized } = useSelector((state) => state.event);
  const { user } = useSelector((state) => state.auth);

  const isAlumni = user?.user?.role === 'ROLE_ALUMNI';

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchPromotionStatus());
    dispatch(fetchMyRsvps());
    if (isAlumni) dispatch(fetchMyOrganized());
  }, [dispatch, isAlumni]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (isLoading || !profile) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  // Upcoming events the user is attending (limit to 3)
  const upcomingEvents = myRsvps
    .filter((e) => new Date(e.eventDate) > new Date())
    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
    .slice(0, 3);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.welcome}>
            Welcome back, {profile.firstName}! 👋
          </h1>
          <p style={styles.subtitle}>
            Here's what's happening with your account
          </p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.browseBtn} onClick={() => navigate('/events')}>
            📅 Browse Events
          </button>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Row 1: Profile + Promotion */}
      <div className="dashboard-row">
        <ProfileCard profile={profile} />
        <PromotionCard profile={profile} promotionStatus={promotionStatus} />
      </div>

      {/* Row 2: Upcoming Events (if any) */}
      {upcomingEvents.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>📅 Your Upcoming Events</h2>
            <button style={styles.viewAllBtn} onClick={() => navigate('/my-events')}>
              View All →
            </button>
          </div>
          <div style={styles.eventsGrid}>
            {upcomingEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </div>
      )}

      {/* Empty events state */}
      {upcomingEvents.length === 0 && (
        <div style={styles.emptyEvents}>
          <div style={styles.emptyIcon}>🎟️</div>
          <div style={styles.emptyContent}>
            <h3 style={styles.emptyTitle}>No upcoming events</h3>
            <p style={styles.emptyText}>
              Browse and RSVP to events to see them here.
            </p>
          </div>
          <button style={styles.emptyBtn} onClick={() => navigate('/events')}>
            Browse Events
          </button>
        </div>
      )}

      {/* Row 3: Quick Actions + Recent Activity */}
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
  headerActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  browseBtn: {
    padding: '11px 22px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 4px 12px rgba(79,70,229,0.25)',
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
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
  },
  section: {
    marginBottom: '24px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  viewAllBtn: {
    background: 'none',
    border: 'none',
    color: '#4f46e5',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  eventsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  emptyEvents: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '24px',
    background: 'linear-gradient(135deg, #eef2ff 0%, #f0f9ff 100%)',
    border: '1px solid #c7d2fe',
    borderRadius: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  emptyIcon: { fontSize: '40px' },
  emptyContent: { flex: 1 },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 4px 0',
  },
  emptyText: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
  },
  emptyBtn: {
    padding: '10px 20px',
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  loading: {
    textAlign: 'center',
    padding: '100px 20px',
    fontSize: '16px',
    color: '#64748b',
  },
};

export default Dashboard;