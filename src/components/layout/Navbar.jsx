import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const initials = user?.user
    ? `${user.user.firstName?.[0] || ''}${user.user.lastName?.[0] || ''}`
    : '?';

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <div style={styles.logoIcon}>AM</div>
          AlumniHub
        </Link>

        {isAuthenticated && (
          <div style={styles.links}>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/directory" style={styles.link}>Directory</Link>
            <Link to="/events" style={styles.link}>Events</Link>
          </div>
        )}

        <div style={styles.right}>
          {isAuthenticated ? (
            <div style={styles.avatarWrapper} ref={dropdownRef}>
              <button
                style={styles.avatarBtn}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span style={styles.avatar}>{initials}</span>
                <span style={styles.caret}>▾</span>
              </button>

              {showDropdown && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownHeader}>
                    <div style={styles.dropdownName}>
                      {user?.user?.firstName} {user?.user?.lastName}
                    </div>
                    <div style={styles.dropdownEmail}>{user?.user?.email}</div>
                  </div>

                  <div style={styles.dropdownDivider} />

                  <button
                    style={styles.dropdownItem}
                    onClick={() => {
                      navigate('/profile');
                      setShowDropdown(false);
                    }}
                  >
                    👤 View Profile
                  </button>

                  <button
                    style={styles.dropdownItem}
                    onClick={() => {
                      navigate('/profile?edit=true');
                      setShowDropdown(false);
                    }}
                  >
                    ✏️ Edit Profile
                  </button>

                  <div style={styles.dropdownDivider} />

                  <button
                    style={{ ...styles.dropdownItem, ...styles.logoutItem }}
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
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
    background: 'white',
    padding: '14px 0',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '20px',
    fontWeight: '800',
    color: '#1e293b',
    textDecoration: 'none',
  },
  logoIcon: {
    width: '34px',
    height: '34px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    color: 'white',
    borderRadius: '9px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
  },
  links: {
    display: 'flex',
    gap: '28px',
    alignItems: 'center',
  },
  link: {
    color: '#475569',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
  },
  right: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  avatarWrapper: { position: 'relative' },
  avatarBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '24px',
    transition: 'background 0.2s',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
  },
  caret: { fontSize: '11px', color: '#64748b' },
  dropdown: {
    position: 'absolute',
    top: '48px',
    right: 0,
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    border: '1px solid #f1f5f9',
    minWidth: '240px',
    padding: '8px',
    zIndex: 1000,
  },
  dropdownHeader: {
    padding: '12px 14px',
  },
  dropdownName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '2px',
  },
  dropdownEmail: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  dropdownDivider: {
    height: '1px',
    background: '#f1f5f9',
    margin: '4px 0',
  },
  dropdownItem: {
    width: '100%',
    padding: '10px 14px',
    background: 'transparent',
    border: 'none',
    textAlign: 'left',
    fontSize: '14px',
    color: '#475569',
    cursor: 'pointer',
    borderRadius: '8px',
    fontWeight: '500',
    fontFamily: 'inherit',
  },
  logoutItem: { color: '#ef4444' },
};

export default Navbar;