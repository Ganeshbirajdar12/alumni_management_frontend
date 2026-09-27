import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const QuickActions = () => {
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.profile);
  const isAlumni = profile?.role === 'ROLE_ALUMNI';

  const actions = [
    { icon: '🔍', label: 'Browse Alumni', path: '/directory' },
    { icon: '✏️', label: 'Edit Profile', path: '/profile?edit=true' },
    { icon: '📅', label: 'View Events', path: '/events' },
    { icon: '🎓', label: 'View Profile', path: '/profile' },
  ];

  // Add admin option if alumni (future feature)
  if (isAlumni) {
    actions.push({ icon: '💼', label: 'Post a Job', path: '/jobs' });
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>⚡ Quick Actions</h3>
      <div style={styles.list}>
        {actions.map((action, index) => (
          <button
            key={index}
            style={styles.item}
            onClick={() => navigate(action.path)}
          >
            <span style={styles.icon}>{action.icon}</span>
            <span style={styles.label}>{action.label}</span>
            <span style={styles.arrow}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: '1px solid #f1f5f9',
  },
  title: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 16px 0',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 14px',
    background: 'transparent',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#475569',
    textAlign: 'left',
    fontWeight: '500',
    fontFamily: 'inherit',
    transition: 'background 0.2s',
  },
  icon: { fontSize: '16px' },
  label: { flex: 1 },
  arrow: {
    color: '#94a3b8',
    fontSize: '14px',
  },
};

export default QuickActions;