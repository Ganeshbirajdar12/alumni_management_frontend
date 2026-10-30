import React from 'react';
import { Link } from 'react-router-dom';

const AlumniCard = ({ alumni }) => {
  const initials = alumni.fullName?.split(' ').map((n) => n[0]).join('').toUpperCase() || '?';

  return (
    <Link to={`/directory/${alumni.id}`} style={styles.cardLink}>
      <div style={styles.card}>
        <div style={styles.header}>
          {alumni.profilePicture ? (
            <img src={alumni.profilePicture} alt={alumni.fullName} style={styles.avatar} />
          ) : (
            <div style={styles.avatarPlaceholder}>{initials}</div>
          )}
          <div style={styles.headerInfo}>
            <h3 style={styles.name}>{alumni.fullName}</h3>
            <p style={styles.position}>{alumni.currentPosition || 'No position set'}</p>
            {alumni.currentCompany && <p style={styles.company}>@ {alumni.currentCompany}</p>}
          </div>
        </div>

        <div style={styles.details}>
          {alumni.department && (
            <div style={styles.detailItem}>
              <span style={styles.icon}>🎓</span>
              <span>{alumni.department}</span>
            </div>
          )}
          {alumni.graduationYear && (
            <div style={styles.detailItem}>
              <span style={styles.icon}>📅</span>
              <span>Class of {alumni.graduationYear}</span>
            </div>
          )}
          {alumni.location && (
            <div style={styles.detailItem}>
              <span style={styles.icon}>📍</span>
              <span>{alumni.location}</span>
            </div>
          )}
        </div>

        {alumni.skills && (
          <div style={styles.skills}>
            {alumni.skills.split(',').slice(0, 3).map((skill, i) => (
              <span key={i} style={styles.skillTag}>{skill.trim()}</span>
            ))}
            {alumni.skills.split(',').length > 3 && (
              <span style={styles.skillTag}>+{alumni.skills.split(',').length - 3}</span>
            )}
          </div>
        )}

        <div style={styles.footer}>
          <span style={styles.viewProfile}>View Profile →</span>
        </div>
      </div>
    </Link>
  );
};

const styles = {
  cardLink: { textDecoration: 'none', color: 'inherit' },
  card: { background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' },
  header: { display: 'flex', alignItems: 'center', gap: '14px' },
  avatar: { width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' },
  avatarPlaceholder: { width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700', flexShrink: 0 },
  headerInfo: { flex: 1, minWidth: 0 },
  name: { margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  position: { margin: 0, fontSize: '13px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  company: { margin: '2px 0 0 0', fontSize: '12px', color: '#4f46e5', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  details: { display: 'flex', flexDirection: 'column', gap: '8px' },
  detailItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' },
  icon: { fontSize: '14px' },
  skills: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  skillTag: { padding: '4px 10px', background: '#eef2ff', color: '#4f46e5', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  footer: { display: 'flex', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid #f1f5f9', marginTop: 'auto' },
  viewProfile: { color: '#4f46e5', fontSize: '13px', fontWeight: '700' },
};

export default AlumniCard;