import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAuditLogs } from '../../store/slices/adminSlice';

const AuditLogsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auditLogs } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);

  const isSuperAdmin = user?.user?.role === 'ROLE_SUPER_ADMIN';

  useEffect(() => {
    if (!isSuperAdmin) {
      navigate('/admin/dashboard');
      return;
    }
    dispatch(fetchAuditLogs());
  }, [dispatch, isSuperAdmin, navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Audit Logs</h1>
          <p style={styles.subtitle}>
            Track all admin actions across the system
          </p>
        </div>
        <button
          style={styles.refreshBtn}
          onClick={() => dispatch(fetchAuditLogs())}
        >
          🔄 Refresh
        </button>
      </div>

      {auditLogs.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📭</div>
          <h3 style={styles.emptyTitle}>No logs yet</h3>
          <p style={styles.emptyText}>
            Admin actions will appear here as they happen.
          </p>
        </div>
      ) : (
        <div style={styles.list}>
          {auditLogs.map((log) => (
            <div key={log.id} style={styles.logCard}>
              <div style={styles.logIconWrap}>
                <span style={styles.logIcon}>{getActionIcon(log.action)}</span>
              </div>
              <div style={styles.logContent}>
                <div style={styles.logTopRow}>
                  <span style={styles.logAction}>{formatAction(log.action)}</span>
                  <span style={styles.logTime}>
                    {formatTime(log.createdAt)}
                  </span>
                </div>
                <p style={styles.logText}>
                  <strong>{log.actorEmail || 'System'}</strong>
                  {log.targetEmail && (
                    <>
                      {' '}→ <strong>{log.targetEmail}</strong>
                    </>
                  )}
                </p>
                {log.details && (
                  <p style={styles.logDetails}>{log.details}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== HELPERS ====================

const getActionIcon = (action) => {
  const icons = {
    ADMIN_CREATED: '➕',
    ADMIN_DELETED: '🗑️',
    ADMIN_DEACTIVATED: '🚫',
    ADMIN_ACTIVATED: '✅',
    PROMOTION_APPROVED: '🎓',
    PROMOTION_REJECTED: '❌',
    PASSWORD_RESET_BY_ADMIN: '🔑',
    USER_DEACTIVATED: '🚫',
    USER_ACTIVATED: '✅',
    PASSWORD_CHANGED: '🔐',
    SUPER_ADMIN_CREATED: '👑',
  };
  return icons[action] || '📌';
};

const formatAction = (action) => {
  return action
    .split('_')
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

// ==================== STYLES ====================

const styles = {
  container: {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '0 24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    gap: '16px',
    flexWrap: 'wrap',
  },
  title: {
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
  refreshBtn: {
    padding: '10px 20px',
    background: 'white',
    color: '#4f46e5',
    border: '1.5px solid #e0e7ff',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  empty: {
    textAlign: 'center',
    padding: '80px 20px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: '1px solid #f1f5f9',
  },
  emptyIcon: { fontSize: '48px', marginBottom: '16px' },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 8px 0',
  },
  emptyText: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  logCard: {
    display: 'flex',
    gap: '16px',
    padding: '18px',
    background: 'white',
    borderRadius: '14px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: '1px solid #f1f5f9',
  },
  logIconWrap: {
    flexShrink: 0,
  },
  logIcon: {
    width: '42px',
    height: '42px',
    background: '#eef2ff',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  logContent: { flex: 1, minWidth: 0 },
  logTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
    gap: '12px',
    flexWrap: 'wrap',
  },
  logAction: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#4f46e5',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    fontSize: '11px',
  },
  logTime: {
    fontSize: '12px',
    color: '#94a3b8',
    fontWeight: '500',
  },
  logText: {
    fontSize: '14px',
    color: '#334155',
    margin: '0 0 4px 0',
    wordBreak: 'break-word',
  },
  logDetails: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
    fontStyle: 'italic',
  },
};

export default AuditLogsPage;