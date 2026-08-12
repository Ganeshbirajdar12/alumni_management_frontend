import React from 'react';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div style={styles.container}>
      <h1>Welcome, {user?.user?.firstName}!</h1>
      <div style={styles.card}>
        <h3>Your Profile</h3>
        <p><strong>Email:</strong> {user?.user?.email}</p>
        <p><strong>Role:</strong> {user?.user?.role}</p>
        <p><strong>Department:</strong> {user?.user?.department || 'N/A'}</p>
        <p><strong>Graduation Year:</strong> {user?.user?.graduationYear || 'N/A'}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '0 20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginTop: '20px',
  },
};

export default Dashboard;