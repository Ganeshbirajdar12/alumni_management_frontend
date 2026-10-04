import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchEventById, fetchAttendees, markAttended } from '../../store/slices/eventSlice';
import toast from 'react-hot-toast';

const ManageAttendancePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentEvent, attendees, isLoading } = useSelector((state) => state.event);
  const { user } = useSelector((state) => state.auth);

  const [filter, setFilter] = useState('ALL');

  const isOrganizer = currentEvent?.organizerId === user?.user?.id;
  const isAdmin = user?.user?.role === 'ROLE_ADMIN' || user?.user?.role === 'ROLE_SUPER_ADMIN';
  const canManage = isOrganizer || isAdmin;

  useEffect(() => {
    dispatch(fetchEventById(id));
    dispatch(fetchAttendees(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentEvent && !canManage) {
      toast.error('You do not have permission');
      navigate(`/events/${id}`);
    }
  }, [currentEvent, canManage, navigate, id]);

  const handleMarkAttended = async (userId) => {
    const result = await dispatch(markAttended({ eventId: id, userId }));
    if (!result.error) {
      toast.success('Marked as attended ✅');
    } else {
      toast.error(result.payload);
    }
  };

  const filtered = attendees.filter((a) => filter === 'ALL' || a.status === filter);

  const counts = {
    ALL: attendees.length,
    REGISTERED: attendees.filter((a) => a.status === 'REGISTERED').length,
    ATTENDED: attendees.filter((a) => a.status === 'ATTENDED').length,
  };

  if (isLoading || !currentEvent) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <button style={styles.backBtn} onClick={() => navigate(`/events/${id}`)}>← Back to Event</button>
          <h1 style={styles.title}>Manage Attendance</h1>
          <p style={styles.subtitle}>{currentEvent.title}</p>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{counts.ALL}</div>
          <div style={styles.statLabel}>Total Registered</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{counts.ATTENDED}</div>
          <div style={styles.statLabel}>Checked In</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{counts.REGISTERED}</div>
          <div style={styles.statLabel}>Yet to Check In</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={styles.tabs}>
        {[
          { key: 'ALL', label: `All (${counts.ALL})` },
          { key: 'REGISTERED', label: `Not Checked In (${counts.REGISTERED})` },
          { key: 'ATTENDED', label: `Attended (${counts.ATTENDED})` },
        ].map((t) => (
          <button
            key={t.key}
            style={{ ...styles.tab, ...(filter === t.key ? styles.tabActive : {}) }}
            onClick={() => setFilter(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Attendees list */}
      {filtered.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>👥</div>
          <p>No attendees in this category</p>
        </div>
      ) : (
        <div style={styles.list}>
          {filtered.map((a) => (
            <div key={a.id} style={styles.item}>
              <div style={styles.avatar}>
                {a.userFullName?.split(' ').map((n) => n[0]).join('').toUpperCase() || '?'}
              </div>
              <div style={styles.info}>
                <div style={styles.name}>{a.userFullName}</div>
                <div style={styles.email}>{a.userEmail}</div>
                <div style={styles.meta}>
                  RSVP'd: {new Date(a.rsvpAt).toLocaleString()}
                </div>
              </div>
              <div style={styles.actions}>
                {a.status === 'ATTENDED' ? (
                  <span style={styles.attendedBadge}>
                    ✅ Attended {a.attendedAt ? `at ${new Date(a.attendedAt).toLocaleTimeString()}` : ''}
                  </span>
                ) : (
                  <button
                    style={styles.checkInBtn}
                    onClick={() => handleMarkAttended(a.userId)}
                  >
                    Mark as Attended
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '900px', margin: '40px auto', padding: '0 24px' },
  loading: { textAlign: 'center', padding: '100px', color: '#64748b' },
  header: { marginBottom: '28px' },
  backBtn: { background: 'none', border: 'none', color: '#64748b', fontSize: '14px', cursor: 'pointer', padding: 0, marginBottom: '12px', fontFamily: 'inherit' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0' },
  subtitle: { fontSize: '14px', color: '#64748b', margin: 0 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' },
  statCard: { background: 'white', padding: '20px', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9', textAlign: 'center' },
  statValue: { fontSize: '28px', fontWeight: '800', color: '#4f46e5', marginBottom: '4px' },
  statLabel: { fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' },
  tabs: { display: 'flex', gap: '6px', padding: '6px', background: '#f1f5f9', borderRadius: '12px', marginBottom: '20px', width: 'fit-content' },
  tab: { padding: '9px 16px', background: 'transparent', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '13px', color: '#64748b', cursor: 'pointer', fontFamily: 'inherit' },
  tabActive: { background: 'white', color: '#4f46e5', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  empty: { textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', color: '#64748b' },
  emptyIcon: { fontSize: '48px', marginBottom: '12px' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  item: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'white', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  avatar: { width: '46px', height: '46px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '700', flexShrink: 0 },
  info: { flex: 1, minWidth: 0 },
  name: { fontSize: '15px', fontWeight: '700', color: '#1e293b' },
  email: { fontSize: '13px', color: '#64748b' },
  meta: { fontSize: '11px', color: '#94a3b8', marginTop: '2px' },
  actions: { flexShrink: 0 },
  attendedBadge: { fontSize: '12px', color: '#166534', fontWeight: '700', padding: '6px 12px', background: '#dcfce7', borderRadius: '20px' },
  checkInBtn: { padding: '9px 18px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' },
};

export default ManageAttendancePage;