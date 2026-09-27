import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileCard = ({ profile }) => {
  const navigate = useNavigate();

  if (!profile) return null;

  const initials = `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`;
  const isAlumni = profile.role === 'ROLE_ALUMNI';

  return (
    <div style={styles.card}>
      <div style={styles.avatarWrap}>
        {profile.profilePicture ? (
          <img src={profile.profilePicture} alt="Avatar" style={styles.avatarImg} />
        ) : (
          <div style={styles.avatar}>{initials}</div>
        )}
      </div>

      <h2 style={styles.name}>{profile.fullName}</h2>

      <p style={styles.role}>
        {isAlumni ? '🎓 Alumni' : '📚 Student'}
      </p>

      <p style={styles.meta}>
        {profile.department || 'No department'}
        {profile.graduationYear && ` • Class of ${profile.graduationYear}`}
      </p>

      <div style={styles.buttons}>
        <button
          style={styles.editBtn}
          onClick={() => navigate('/profile?edit=true')}
        >
          Edit Profile
        </button>
        <button
          style={styles.viewBtn}
          onClick={() => navigate('/profile')}
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: '1px solid #f1f5f9',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatarWrap: { marginBottom: '16px' },
  avatar: {
    width: '88px',
    height: '88px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: '700',
  },
  avatarImg: {
    width: '88px',
    height: '88px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  name: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 6px 0',
  },
  role: {
    fontSize: '13px',
    color: '#4f46e5',
    fontWeight: '600',
    margin: '0 0 6px 0',
  },
  meta: {
    fontSize: '13px',
    color: '#94a3b8',
    margin: '0 0 20px 0',
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    width: '100%',
    marginTop: 'auto',
  },
  editBtn: {
    flex: 1,
    padding: '11px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  viewBtn: {
    flex: 1,
    padding: '11px',
    background: 'white',
    color: '#4f46e5',
    border: '1.5px solid #e0e7ff',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};

export default ProfileCard;