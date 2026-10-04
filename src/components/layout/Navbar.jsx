import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef(null);

  const role = user?.user?.role;
  const isAlumni = role === 'ROLE_ALUMNI';
  const isAdmin = role === 'ROLE_ADMIN' || role === 'ROLE_SUPER_ADMIN';
  const isSuperAdmin = role === 'ROLE_SUPER_ADMIN';

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

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
    setShowDropdown(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const initials = user?.user
    ? `${user.user.firstName?.[0] || ''}${user.user.lastName?.[0] || ''}`
    : '?';

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  // Determine home path based on role
  const dashboardPath = isAdmin ? '/admin/dashboard' : '/dashboard';

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* Logo */}
        <Link to={isAuthenticated ? dashboardPath : '/'} style={styles.logo}>
          <div style={styles.logoIcon}>AM</div>
          AlumniHub
        </Link>

        {/* Desktop Links */}
        {isAuthenticated && (
          <div style={styles.links}>
            {isAdmin ? (
              <>
                <NavLink to="/admin/dashboard" isActive={isActive('/admin/dashboard')}>
                  Dashboard
                </NavLink>
                <NavLink to="/admin/promotions" isActive={isActive('/admin/promotions')}>
                  Promotions
                </NavLink>
                <NavLink to="/events" isActive={isActive('/events')}>
                  Events
                </NavLink>
                {isSuperAdmin && (
                  <>
                    <NavLink to="/admin/team" isActive={isActive('/admin/team')}>
                      Admins
                    </NavLink>
                    <NavLink to="/admin/audit-logs" isActive={isActive('/admin/audit-logs')}>
                      Audit Logs
                    </NavLink>
                  </>
                )}
              </>
            ) : (
              <>
                <NavLink to="/dashboard" isActive={isActive('/dashboard')}>
                  Dashboard
                </NavLink>
                <NavLink to="/events" isActive={isActive('/events')}>
                  Events
                </NavLink>
                <NavLink to="/my-events" isActive={isActive('/my-events')}>
                  My Events
                </NavLink>
                <NavLink to="/directory" isActive={isActive('/directory')}>
                  Directory
                </NavLink>
              </>
            )}
          </div>
        )}

        {/* Right Side */}
        <div style={styles.right}>
          {isAuthenticated ? (
            <>
              {/* Mobile menu toggle */}
              <button
                style={styles.mobileToggle}
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                aria-label="Menu"
              >
                ☰
              </button>

              {/* Avatar Dropdown */}
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
                      <div style={styles.roleBadge}>{formatRole(role)}</div>
                    </div>

                    <div style={styles.dropdownDivider} />

                    {!isAdmin && (
                      <>
                        <DropdownItem
                          icon="👤"
                          label="View Profile"
                          onClick={() => navigate('/profile')}
                        />
                        <DropdownItem
                          icon="✏️"
                          label="Edit Profile"
                          onClick={() => navigate('/profile?edit=true')}
                        />
                        <DropdownItem
                          icon="📅"
                          label="My Events"
                          onClick={() => navigate('/my-events')}
                        />
                      </>
                    )}

                    {isAdmin && (
                      <>
                        <DropdownItem
                          icon="👤"
                          label="My Profile"
                          onClick={() => navigate('/profile')}
                        />
                        <DropdownItem
                          icon="📅"
                          label="Events"
                          onClick={() => navigate('/events')}
                        />
                      </>
                    )}

                    <div style={styles.dropdownDivider} />

                    <DropdownItem
                      icon="🚪"
                      label="Logout"
                      onClick={handleLogout}
                      danger
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.link}>Register</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isAuthenticated && showMobileMenu && (
        <div style={styles.mobileMenu}>
          {isAdmin ? (
            <>
              <MobileLink to="/admin/dashboard">Dashboard</MobileLink>
              <MobileLink to="/admin/promotions">Promotions</MobileLink>
              <MobileLink to="/events">Events</MobileLink>
              {isSuperAdmin && (
                <>
                  <MobileLink to="/admin/team">Admins</MobileLink>
                  <MobileLink to="/admin/audit-logs">Audit Logs</MobileLink>
                </>
              )}
            </>
          ) : (
            <>
              <MobileLink to="/dashboard">Dashboard</MobileLink>
              <MobileLink to="/events">Events</MobileLink>
              <MobileLink to="/my-events">My Events</MobileLink>
              <MobileLink to="/directory">Directory</MobileLink>
              <MobileLink to="/profile">Profile</MobileLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

// ==================== SUB-COMPONENTS ====================

const NavLink = ({ to, children, isActive }) => (
  <Link to={to} style={{ ...styles.link, ...(isActive ? styles.linkActive : {}) }}>
    {children}
  </Link>
);

const MobileLink = ({ to, children }) => (
  <Link to={to} style={styles.mobileLink}>
    {children}
  </Link>
);

const DropdownItem = ({ icon, label, onClick, danger }) => (
  <button
    style={{ ...styles.dropdownItem, ...(danger ? styles.dropdownItemDanger : {}) }}
    onClick={onClick}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

const formatRole = (role) => {
  if (!role) return '';
  return role.replace('ROLE_', '').replace('_', ' ');
};

// ==================== STYLES ====================

const styles = {
  nav: {
    background: 'white',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '20px',
    fontWeight: '800',
    color: '#1e293b',
    textDecoration: 'none',
    flexShrink: 0,
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
    gap: '4px',
    alignItems: 'center',
    flex: 1,
    marginLeft: '32px',
  },
  link: {
    color: '#475569',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    padding: '8px 14px',
    borderRadius: '8px',
    transition: 'all 0.15s',
  },
  linkActive: {
    color: '#4f46e5',
    background: '#eef2ff',
  },
  right: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    flexShrink: 0,
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
    minWidth: '260px',
    padding: '8px',
    zIndex: 1001,
  },
  dropdownHeader: { padding: '12px 14px' },
  dropdownName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '2px',
  },
  dropdownEmail: { fontSize: '12px', color: '#94a3b8', marginBottom: '8px' },
  roleBadge: {
    display: 'inline-block',
    fontSize: '10px',
    padding: '3px 8px',
    background: '#eef2ff',
    color: '#4f46e5',
    borderRadius: '4px',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  dropdownDivider: {
    height: '1px',
    background: '#f1f5f9',
    margin: '4px 0',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
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
  dropdownItemDanger: { color: '#ef4444' },
  mobileToggle: {
    display: 'none',
    background: 'transparent',
    border: 'none',
    fontSize: '22px',
    cursor: 'pointer',
    color: '#475569',
    padding: '4px 8px',
  },
  mobileMenu: {
    display: 'none',
    padding: '12px 24px',
    background: 'white',
    borderTop: '1px solid #f1f5f9',
    flexDirection: 'column',
    gap: '4px',
  },
  mobileLink: {
    padding: '12px 14px',
    color: '#475569',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '600',
    borderRadius: '8px',
  },
};

export default Navbar;