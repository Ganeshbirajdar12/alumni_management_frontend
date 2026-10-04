import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyOrganized, fetchMyRsvps } from '../../store/slices/eventSlice';
import EventCard from './EventCard';

const MyEventsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myOrganized, myRsvps, isLoading } = useSelector((state) => state.event);
  const { user } = useSelector((state) => state.auth);

  const [tab, setTab] = useState('organized');

  const canCreate =
    user?.user?.role === 'ROLE_ALUMNI' ||
    user?.user?.role === 'ROLE_ADMIN' ||
    user?.user?.role === 'ROLE_SUPER_ADMIN';

  useEffect(() => {
    dispatch(fetchMyOrganized());
    dispatch(fetchMyRsvps());
  }, [dispatch]);

  const list = tab === 'organized' ? myOrganized : myRsvps;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Events</h1>
          <p style={styles.subtitle}>Events you organized or are attending</p>
        </div>
        {canCreate && (
          <button style={styles.createBtn} onClick={() => navigate('/events/create')}>
            + Create Event
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(tab === 'organized' ? styles.tabActive : {}) }}
          onClick={() => setTab('organized')}
        >
          🎯 Organized ({myOrganized.length})
        </button>
        <button
          style={{ ...styles.tab, ...(tab === 'rsvps' ? styles.tabActive : {}) }}
          onClick={() => setTab('rsvps')}
        >
          ✅ Attending ({myRsvps.length})
        </button>
      </div>

      {isLoading ? (
        <div style={styles.loading}>Loading...</div>
      ) : list.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>{tab === 'organized' ? '📭' : '🎟️'}</div>
          <h3 style={styles.emptyTitle}>
            {tab === 'organized' ? "You haven't organized any events" : "You're not attending any events"}
          </h3>
          <p style={styles.emptyText}>
            {tab === 'organized'
              ? 'Create your first event to bring alumni together!'
              : 'Browse upcoming events and RSVP to join.'}
          </p>
          <button
            style={styles.emptyBtn}
            onClick={() => (tab === 'organized' ? navigate('/events/create') : navigate('/events'))}
          >
            {tab === 'organized' ? '+ Create Event' : 'Browse Events'}
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {list.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '40px auto', padding: '0 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0' },
  subtitle: { fontSize: '14px', color: '#64748b', margin: 0 },
  createBtn: { padding: '12px 22px', background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(79,70,229,0.25)' },
  tabs: { display: 'flex', gap: '8px', padding: '6px', background: '#f1f5f9', borderRadius: '12px', marginBottom: '28px', width: 'fit-content' },
  tab: { padding: '10px 20px', background: 'transparent', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', color: '#64748b', cursor: 'pointer', fontFamily: 'inherit' },
  tabActive: { background: 'white', color: '#4f46e5', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  loading: { textAlign: 'center', padding: '80px', color: '#64748b' },
  empty: { textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9' },
  emptyIcon: { fontSize: '48px', marginBottom: '16px' },
  emptyTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' },
  emptyText: { fontSize: '14px', color: '#64748b', marginBottom: '24px' },
  emptyBtn: { padding: '12px 24px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' },
};

export default MyEventsPage;