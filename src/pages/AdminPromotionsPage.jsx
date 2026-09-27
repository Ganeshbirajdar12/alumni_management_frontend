import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPendingPromotions,
  approvePromotion,
  rejectPromotion,
} from '../store/slices/adminSlice';
import toast from 'react-hot-toast';

const AdminPromotionsPage = () => {
  const dispatch = useDispatch();
  const { pendingPromotions, isLoading, error } = useSelector((state) => state.admin);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    dispatch(fetchPendingPromotions());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleApprove = async (id) => {
    const result = await dispatch(approvePromotion({ id, remarks: 'Approved' }));
    if (!result.error) toast.success('Student promoted to Alumni! 🎉');
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason');
      return;
    }
    const result = await dispatch(rejectPromotion({ id: rejectingId, reason: rejectReason }));
    if (!result.error) {
      toast.success('Request rejected');
      setRejectingId(null);
      setRejectReason('');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Pending Promotions</h1>
      <p style={styles.subtitle}>
        Review and approve students requesting alumni status
      </p>

      {isLoading ? (
        <div style={styles.loading}>Loading...</div>
      ) : pendingPromotions.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>🎉</div>
          <h3>All caught up!</h3>
          <p>No pending promotion requests</p>
        </div>
      ) : (
        <div style={styles.list}>
          {pendingPromotions.map((req) => (
            <div key={req.id} style={styles.card}>
              <div style={styles.cardLeft}>
                <div style={styles.avatar}>
                  {req.fullName?.split(' ').map((n) => n[0]).join('') || '?'}
                </div>
              </div>
              <div style={styles.cardMiddle}>
                <h3 style={styles.name}>{req.fullName}</h3>
                <p style={styles.email}>{req.email}</p>
                <p style={styles.details}>
                  {req.department && `📚 ${req.department}`}
                  {req.graduationYear && ` • Class of ${req.graduationYear}`}
                </p>
                <p style={styles.time}>
                  Requested {new Date(req.requestedAt).toLocaleString()}
                </p>
              </div>
              <div style={styles.cardRight}>
                <button
                  style={styles.approveBtn}
                  onClick={() => handleApprove(req.id)}
                >
                  ✓ Approve
                </button>
                <button
                  style={styles.rejectBtn}
                  onClick={() => setRejectingId(req.id)}
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectingId && (
        <div style={styles.overlay} onClick={() => setRejectingId(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Reject Promotion</h3>
            <p style={styles.modalText}>Please provide a reason:</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Graduation year not yet passed"
              style={styles.textarea}
              rows={3}
            />
            <div style={styles.modalButtons}>
              <button style={styles.cancelBtn} onClick={() => setRejectingId(null)}>
                Cancel
              </button>
              <button style={styles.confirmRejectBtn} onClick={handleReject}>
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '900px', margin: '40px auto', padding: '0 20px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' },
  subtitle: { fontSize: '15px', color: '#64748b', marginBottom: '32px' },
  loading: { textAlign: 'center', padding: '60px', color: '#64748b' },
  empty: {
    textAlign: 'center',
    padding: '80px 20px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  emptyIcon: { fontSize: '48px', marginBottom: '16px' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '24px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: '1px solid #f1f5f9',
  },
  cardLeft: { flexShrink: 0 },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '700',
  },
  cardMiddle: { flex: 1 },
  name: { fontSize: '17px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' },
  email: { fontSize: '14px', color: '#4f46e5', margin: '0 0 6px 0' },
  details: { fontSize: '13px', color: '#64748b', margin: '0 0 4px 0' },
  time: { fontSize: '12px', color: '#94a3b8', margin: 0 },
  cardRight: { display: 'flex', gap: '8px', flexShrink: 0 },
  approveBtn: {
    padding: '10px 20px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
  },
  rejectBtn: {
    padding: '10px 20px',
    background: 'white',
    color: '#ef4444',
    border: '1.5px solid #fecaca',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15,23,42,0.6)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '20px',
  },
  modal: {
    background: 'white',
    padding: '32px',
    borderRadius: '16px',
    maxWidth: '450px',
    width: '100%',
  },
  modalTitle: { fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' },
  modalText: { fontSize: '14px', color: '#64748b', marginBottom: '16px' },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'vertical',
    marginBottom: '20px',
    boxSizing: 'border-box',
  },
  modalButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  cancelBtn: {
    padding: '10px 20px',
    background: '#f1f5f9',
    color: '#475569',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  confirmRejectBtn: {
    padding: '10px 20px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer',
  },
};

export default AdminPromotionsPage;