import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>Alumni Portal</Link>
        <div style={styles.links}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={styles.link}>Dashboard</Link>
              <Link to="/profile" style={styles.link}>Profile</Link>
              <span style={styles.userName}>
                {user?.user?.firstName} {user?.user?.lastName}
              </span>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.link}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#1a73e8',
    padding: '15px 0',
    color: 'white',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  logo: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
  },
  userName: {
    color: 'white',
    fontSize: '14px',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '5px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Navbar;