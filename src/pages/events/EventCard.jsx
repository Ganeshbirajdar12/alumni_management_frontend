import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCategory } from '../../pages/events/EventsPage';

const EventCard = ({ event, featured = false }) => {
  const navigate = useNavigate();

  const date = new Date(event.eventDate);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const categoryColors = {
    REUNION: '#ec4899',
    WEBINAR: '#3b82f6',
    WORKSHOP: '#10b981',
    NETWORKING: '#8b5cf6',
    CONFERENCE: '#f59e0b',
    SOCIAL: '#06b6d4',
    OTHER: '#64748b',
  };

  return (
    <div
      style={{
        ...styles.card,
        ...(featured ? styles.featuredCard : {}),
      }}
      onClick={() => navigate(`/events/${event.id}`)}
    >
      {/* Cover image */}
      <div style={styles.imageWrap}>
        {event.coverImage ? (
          <img src={event.coverImage} alt={event.title} style={styles.image} />
        ) : (
          <div style={styles.imagePlaceholder}>
            <span style={styles.imageIcon}>📅</span>
          </div>
        )}
        <span
          style={{
            ...styles.categoryBadge,
            background: categoryColors[event.category] || '#64748b',
          }}
        >
          {formatCategory(event.category)}
        </span>
        {featured && <span style={styles.featuredBadge}>⭐ Featured</span>}
      </div>

      {/* Content */}
      <div style={styles.body}>
        <h3 style={styles.title}>{event.title}</h3>

        <div style={styles.infoRow}>
          <span>📅</span>
          <span>{formattedDate} • {formattedTime}</span>
        </div>

        <div style={styles.infoRow}>
          {event.isOnline ? (
            <>
              <span>🌐</span>
              <span>Online Event</span>
            </>
          ) : (
            <>
              <span>📍</span>
              <span>{event.location || 'Location TBD'}</span>
            </>
          )}
        </div>

        <div style={styles.footer}>
          <div style={styles.attendees}>
            <span>👥</span>
            <span>
              {event.registeredCount}
              {event.maxParticipants ? ` / ${event.maxParticipants}` : ''} attending
            </span>
          </div>
          {event.userRegistered && (
            <span style={styles.goingBadge}>✅ Going</span>
          )}
          {event.isFull && !event.userRegistered && (
            <span style={styles.fullBadge}>Full</span>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: '1px solid #f1f5f9',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  featuredCard: { border: '2px solid #fbbf24' },
  imageWrap: { position: 'relative', height: '180px', overflow: 'hidden' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #eef2ff 0%, #f0f9ff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIcon: { fontSize: '48px' },
  categoryBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    padding: '5px 12px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  featuredBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    padding: '5px 12px',
    borderRadius: '20px',
    background: '#fbbf24',
    color: '#78350f',
    fontSize: '11px',
    fontWeight: '700',
  },
  body: { padding: '18px' },
  title: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 12px 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    lineHeight: '1.4',
    minHeight: '44px',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '8px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '14px',
    paddingTop: '14px',
    borderTop: '1px solid #f1f5f9',
  },
  attendees: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569' },
  goingBadge: {
    padding: '3px 10px',
    background: '#dcfce7',
    color: '#166534',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
  },
  fullBadge: {
    padding: '3px 10px',
    background: '#fee2e2',
    color: '#991b1b',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
  },
};

export default EventCard;