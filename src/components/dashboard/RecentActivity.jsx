import React from 'react';

const RecentActivity = ({ profile }) => {
  // Placeholder activity data (Q2: Option A)
  const activities = [
    {
      icon: '👤',
      text: 'Profile updated',
      time: '2 hours ago',
    },
    {
      icon: '🔐',
      text: 'Logged in successfully',
      time: '5 hours ago',
    },
    {
      icon: '👋',
      text: 'Welcome to AlumniHub',
      time: '3 days ago',
    },
  ];

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>🔔 Recent Activity</h3>
      <div style={styles.list}>
        {activities.map((activity, index) => (
          <div key={index} style={styles.item}>
            <div style={styles.icon}>{activity.icon}</div>
            <div style={styles.content}>
              <p style={styles.text}>{activity.text}</p>
              <p style={styles.time}>{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      <p style={styles.note}>
        📌 Real activity tracking coming soon
      </p>
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
    display: 'flex',
    flexDirection: 'column',
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
    gap: '16px',
  },
  item: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  icon: {
    width: '36px',
    height: '36px',
    background: '#eef2ff',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0,
  },
  content: { flex: 1 },
  text: {
    fontSize: '14px',
    color: '#1e293b',
    margin: '0 0 2px 0',
    fontWeight: '500',
  },
  time: {
    fontSize: '12px',
    color: '#94a3b8',
    margin: 0,
  },
  note: {
    fontSize: '11px',
    color: '#94a3b8',
    margin: '20px 0 0 0',
    paddingTop: '12px',
    borderTop: '1px solid #f1f5f9',
    textAlign: 'center',
  },
};

export default RecentActivity;