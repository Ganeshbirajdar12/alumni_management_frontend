import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Reusable Back Button
 * 
 * Props:
 *  - to: optional. If provided, navigates to that path. Otherwise uses browser history.
 *  - label: optional. Custom label. Defaults to "Back".
 *  - variant: "solid" | "ghost" (default: "ghost")
 */
const BackButton = ({ to, label = 'Back', variant = 'ghost' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      // If no previous page, go to dashboard
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/dashboard');
      }
    }
  };

  const styles = variant === 'solid' ? solidStyles : ghostStyles;

  return (
    <button
      style={styles.btn}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = variant === 'solid' ? '#4338ca' : '#f1f5f9';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = variant === 'solid' ? '#4f46e5' : 'transparent';
      }}
    >
      ← {label}
    </button>
  );
};

const ghostStyles = {
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'inherit',
    marginBottom: '16px',
    transition: 'background 0.15s',
  },
};

const solidStyles = {
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 18px',
    background: '#4f46e5',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'inherit',
    marginBottom: '16px',
    transition: 'background 0.15s',
  },
};

export default BackButton;