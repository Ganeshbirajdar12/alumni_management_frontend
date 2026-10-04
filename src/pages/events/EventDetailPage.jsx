import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';
import {
  fetchEventById,
  fetchAttendees,
  rsvpEvent,
  cancelRsvp,
  deleteEvent,
  clearError,
} from '../../store/slices/eventSlice';
import { formatCategory } from './EventsPage';
import toast from 'react-hot-toast';

const EventDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentEvent, attendees, isLoading, error } = useSelector((state) => state.event);
  const { user } = useSelector((state) => state.auth);

  const [showAttendees, setShowAttendees] = useState(false);
  const [isRsvpLoading, setIsRsvpLoading] = useState(false);

  const isOrganizer = currentEvent?.organizerId === user?.user?.id;
  const isAdmin = user?.user?.role === 'ROLE_ADMIN' || user?.user?.role === 'ROLE_SUPER_ADMIN';
  const canManage = isOrganizer || isAdmin;

  useEffect(() => {
    dispatch(fetchEventById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleRsvp = async () => {
    setIsRsvpLoading(true);
    const result = await dispatch(rsvpEvent(id));
    setIsRsvpLoading(false);
    if (!result.error) {
      toast.success("You're going! 🎉");
      dispatch(fetchEventById(id));
    } else {
      toast.error(result.payload);
    }
  };

  const handleCancelRsvp = async () => {
    if (!window.confirm('Cancel your RSVP?')) return;
    setIsRsvpLoading(true);
    const result = await dispatch(cancelRsvp(id));
    setIsRsvpLoading(false);
    if (!result.error) {
      toast.success('RSVP cancelled');
      dispatch(fetchEventById(id));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this event? This cannot be undone.')) return;
    const result = await dispatch(deleteEvent(id));
    if (!result.error) {
      toast.success('Event deleted');
      navigate('/events');
    }
  };

  const handleShowAttendees = async () => {
    if (!showAttendees) {
      dispatch(fetchAttendees(id));
    }
    setShowAttendees(!showAttendees);
  };

  if (isLoading || !currentEvent) {
    return <div style={styles.loading}>Loading event...</div>;
  }

  const e = currentEvent;
  const date = new Date(e.eventDate);
  const endDate = e.endDate ? new Date(e.endDate) : null;

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div style={styles.container}>
      {/* Hero */}
      <div style={styles.hero}>
        
        {e.coverImage ? (
          <img src={e.coverImage} alt={e.title} style={styles.heroImage} />
        ) : (
          <div style={styles.heroPlaceholder}>
            <span style={{ fontSize: '64px' }}>📅</span>
          </div>
        )}
        <div style={styles.heroOverlay}>
          <span style={styles.category}>{formatCategory(e.category)}</span>
          {e.isFeatured && <span style={styles.featuredTag}>⭐ Featured</span>}
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.main}>
          <h1 style={styles.title}>{e.title}</h1>

          <div style={styles.meta}>
            <div style={styles.metaItem}>
              <span style={styles.metaIcon}>📅</span>
              <div>
                <div style={styles.metaLabel}>Date & Time</div>
                <div style={styles.metaValue}>{formattedDate}</div>
                <div style={styles.metaSub}>
                  {formattedTime}
                  {endDate && ` - ${endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`}
                </div>
              </div>
            </div>

            <div style={styles.metaItem}>
              <span style={styles.metaIcon}>{e.isOnline ? '🌐' : '📍'}</span>
              <div>
                <div style={styles.metaLabel}>{e.isOnline ? 'Online Event' : 'Location'}</div>
                <div style={styles.metaValue}>
                  {e.isOnline ? 'Virtual' : e.location || 'TBD'}
                </div>
                {e.isOnline && e.meetingLink && (e.userRegistered || canManage) && (
                  <a
                    href={e.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.meetingLink}
                  >
                    Join Meeting →
                  </a>
                )}
              </div>
            </div>

            <div style={styles.metaItem}>
              <span style={styles.metaIcon}>👤</span>
              <div>
                <div style={styles.metaLabel}>Organizer</div>
                <div style={styles.metaValue}>{e.organizerName || 'Unknown'}</div>
                <div style={styles.metaSub}>{e.organizerEmail}</div>
              </div>
            </div>

            <div style={styles.metaItem}>
              <span style={styles.metaIcon}>👥</span>
              <div>
                <div style={styles.metaLabel}>Attendees</div>
                <div style={styles.metaValue}>
                  {e.registeredCount}
                  {e.maxParticipants ? ` / ${e.maxParticipants}` : ''}
                </div>
                {e.registrationDeadline && (
                  <div style={styles.metaSub}>
                    Registration closes {new Date(e.registrationDeadline).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {e.description && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>About this event</h3>
              <p style={styles.description}>{e.description}</p>
            </div>
          )}

          {/* Attendees */}
          <div style={styles.section}>
            <div style={styles.attendeesHeader}>
              <h3 style={styles.sectionTitle}>Attendees ({e.registeredCount})</h3>
              {(e.userRegistered || canManage) && e.registeredCount > 0 && (
                <button style={styles.linkBtn} onClick={handleShowAttendees}>
                  {showAttendees ? 'Hide' : 'Show list'}
                </button>
              )}
            </div>

            {showAttendees && (
              <div style={styles.attendeesList}>
                {attendees.length === 0 ? (
                  <p style={styles.noAttendees}>No attendees yet</p>
                ) : (
                  attendees.map((a) => (
                    <div key={a.id} style={styles.attendeeItem}>
                      <div style={styles.attendeeAvatar}>
                        {a.userFullName?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div style={styles.attendeeName}>{a.userFullName}</div>
                        <div style={styles.attendeeEmail}>{a.userEmail}</div>
                      </div>
                      {a.status === 'ATTENDED' && (
                        <span style={styles.attendedBadge}>✅ Attended</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            <BackButton to="/events" label="Back to Events" />
          </div>
        </div>

        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.actionCard}>
            {!e.userRegistered && e.registrationOpen && (
              <button
                style={styles.rsvpBtn}
                onClick={handleRsvp}
                disabled={isRsvpLoading}
              >
                {isRsvpLoading ? 'Processing...' : '✅ RSVP to Event'}
              </button>
            )}

            {e.userRegistered && (
              <>
                <div style={styles.registeredInfo}>
                  <div style={styles.registeredIcon}>✅</div>
                  <div>
                    <div style={styles.registeredText}>You're registered</div>
                    <div style={styles.registeredSub}>
                      Status: {e.userStatus}
                    </div>
                  </div>
                </div>
                {!isOrganizer && !isAdmin && (
                  <button
                    style={styles.cancelBtn}
                    onClick={handleCancelRsvp}
                    disabled={isRsvpLoading}
                  >
                    Cancel RSVP
                  </button>
                )}
              </>
            )}

            {!e.userRegistered && !e.registrationOpen && (
              <div style={styles.closedBox}>
                {e.isFull
                  ? '😔 Event is full'
                  : '⏰ Registration closed'}
              </div>
            )}

            {canManage && (
              <div style={styles.manageSection}>
                <div style={styles.divider} />
                <h4 style={styles.manageTitle}>Manage</h4>
                <button
                  style={styles.manageBtn}
                  onClick={() => navigate(`/events/${id}/edit`)}
                >
                  ✏️ Edit Event
                </button>
                <button
                  style={styles.manageBtn}
                  onClick={() => navigate(`/events/${id}/attendance`)}
                >
                  ✅ Manage Attendance
                </button>
                <button
                  style={{ ...styles.manageBtn, ...styles.dangerBtn }}
                  onClick={handleDelete}
                >
                  🗑️ Delete Event
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' },
  loading: { textAlign: 'center', padding: '100px', color: '#64748b' },
  hero: { position: 'relative', height: '320px', overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%', objectFit: 'cover' },
  heroPlaceholder: {
    width: '100%', height: '100%',
    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  heroOverlay: { position: 'absolute', bottom: '24px', left: '24px', display: 'flex', gap: '8px' },
  category: {
    padding: '6px 14px', background: 'white', color: '#4f46e5',
    borderRadius: '20px', fontSize: '12px', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  featuredTag: {
    padding: '6px 14px', background: '#fbbf24', color: '#78350f',
    borderRadius: '20px', fontSize: '12px', fontWeight: '700',
  },
  content: {
    display: 'grid', gridTemplateColumns: '1fr 340px',
    gap: '32px', padding: '32px 24px',
  },
  main: {},
  title: { fontSize: '32px', fontWeight: '800', color: '#1e293b', margin: '0 0 24px 0' },
  meta: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: '20px', marginBottom: '32px',
  },
  metaItem: { display: 'flex', gap: '12px', alignItems: 'flex-start' },
  metaIcon: { fontSize: '24px', flexShrink: 0 },
  metaLabel: { fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' },
  metaValue: { fontSize: '15px', color: '#1e293b', fontWeight: '600' },
  metaSub: { fontSize: '13px', color: '#64748b', marginTop: '2px' },
  meetingLink: { fontSize: '13px', color: '#4f46e5', fontWeight: '600', textDecoration: 'none', marginTop: '4px', display: 'inline-block' },
  section: { marginBottom: '32px' },
  sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 12px 0' },
  description: { fontSize: '15px', color: '#475569', lineHeight: '1.7', whiteSpace: 'pre-wrap' },
  attendeesHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  linkBtn: { background: 'none', border: 'none', color: '#4f46e5', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
  attendeesList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  attendeeItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: '#f8fafc', borderRadius: '10px' },
  attendeeAvatar: {
    width: '38px', height: '38px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', fontWeight: '700',
  },
  attendeeName: { fontSize: '14px', fontWeight: '600', color: '#1e293b' },
  attendeeEmail: { fontSize: '12px', color: '#64748b' },
  attendedBadge: { marginLeft: 'auto', fontSize: '11px', color: '#166534', fontWeight: '700' },
  noAttendees: { color: '#94a3b8', fontSize: '14px' },
  sidebar: { position: 'relative' },
  actionCard: {
    position: 'sticky', top: '100px', background: 'white',
    borderRadius: '16px', padding: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9',
  },
  rsvpBtn: {
    width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    color: 'white', border: 'none', borderRadius: '12px',
    fontSize: '15px', fontWeight: '700', cursor: 'pointer',
    fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
  },
  registeredInfo: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' },
  registeredIcon: {
    width: '44px', height: '44px', borderRadius: '12px',
    background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '20px',
  },
  registeredText: { fontSize: '15px', fontWeight: '700', color: '#166534' },
  registeredSub: { fontSize: '12px', color: '#64748b', marginTop: '2px' },
  cancelBtn: {
    width: '100%', padding: '11px', background: 'white',
    color: '#ef4444', border: '1.5px solid #fecaca',
    borderRadius: '10px', fontWeight: '600', fontSize: '14px',
    cursor: 'pointer', fontFamily: 'inherit',
  },
  closedBox: {
    padding: '16px', background: '#fef3c7', color: '#92400e',
    borderRadius: '12px', fontWeight: '600', fontSize: '14px', textAlign: 'center',
  },
  manageSection: { marginTop: '20px' },
  divider: { height: '1px', background: '#f1f5f9', marginBottom: '16px' },
  manageTitle: { fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' },
  manageBtn: {
    width: '100%', padding: '10px', background: '#f8fafc',
    color: '#475569', border: 'none', borderRadius: '8px',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer',
    fontFamily: 'inherit', marginBottom: '8px', textAlign: 'left',
  },
  dangerBtn: { color: '#ef4444' },
};

export default EventDetailPage;