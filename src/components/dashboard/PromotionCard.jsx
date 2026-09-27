import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PromotionModal from '../profile/PromotionModal';

const PromotionCard = ({ profile, promotionStatus }) => {
  const [showModal, setShowModal] = useState(false);

  if (!profile) return null;

  const isAlumni = profile.role === 'ROLE_ALUMNI';

  // Already alumni
  if (isAlumni) {
    return (
      <div style={{ ...styles.card, ...styles.alumniCard }}>
        <div style={styles.icon}>✅</div>
        <h3 style={styles.title}>You're an Alumni!</h3>
        <p style={styles.text}>
          Enjoy full access to work info, job posting, mentorship, and more.
        </p>
      </div>
    );
  }

  // Pending approval
  if (promotionStatus?.status === 'PENDING_APPROVAL') {
    return (
      <div style={{ ...styles.card, ...styles.pendingCard }}>
        <div style={styles.icon}>⏳</div>
        <h3 style={styles.title}>Under Review</h3>
        <p style={styles.text}>
          Your promotion request is being reviewed by our admin team.
        </p>
        <p style={styles.small}>
          Requested: {new Date(promotionStatus.requestedAt).toLocaleString()}
        </p>
      </div>
    );
  }

  // Rejected
  if (promotionStatus?.status === 'REJECTED') {
    return (
      <div style={{ ...styles.card, ...styles.rejectedCard }}>
        <div style={styles.icon}>❌</div>
        <h3 style={styles.title}>Request Rejected</h3>
        <p style={styles.text}>
          Reason: {promotionStatus.adminRemarks || 'Not specified'}
        </p>
        <p style={styles.small}>You can request again after 24 hours.</p>
      </div>
    );
  }

  // No request / expired
  return (
    <>
      <div style={{ ...styles.card, ...styles.readyCard }}>
        <div style={styles.icon}>🎓</div>
        <h3 style={styles.title}>Ready to Graduate?</h3>
        <p style={styles.text}>
          Upgrade to Alumni status to unlock:
        </p>
        <ul style={styles.list}>
          <li>✓ Work information</li>
          <li>✓ Job posting</li>
          <li>✓ Mentorship features</li>
        </ul>
        <button
          style={styles.ctaBtn}
          onClick={() => setShowModal(true)}
        >
          Request Promotion
        </button>
      </div>

      {showModal && (
        <PromotionModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

const styles = {
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '28px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: '1px solid #f1f5f9',
    display: 'flex',
    flexDirection: 'column',
  },
  readyCard: {
    background: 'linear-gradient(135deg, #eef2ff 0%, #f0f9ff 100%)',
    borderColor: '#c7d2fe',
  },
  pendingCard: {
    background: '#dbeafe',
    borderColor: '#93c5fd',
  },
  rejectedCard: {
    background: '#fee2e2',
    borderColor: '#fca5a5',
  },
  alumniCard: {
    background: '#dcfce7',
    borderColor: '#86efac',
  },
  icon: {
    fontSize: '36px',
    marginBottom: '12px',
  },
  title: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 8px 0',
  },
  text: {
    fontSize: '14px',
    color: '#475569',
    margin: '0 0 12px 0',
    lineHeight: '1.5',
  },
  small: {
    fontSize: '12px',
    color: '#64748b',
    margin: '0 0 4px 0',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 20px 0',
    fontSize: '13px',
    color: '#475569',
    lineHeight: '1.8',
  },
  ctaBtn: {
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: 'auto',
    fontFamily: 'inherit',
  },
};

export default PromotionCard;