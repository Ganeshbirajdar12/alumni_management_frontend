import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchAlumniById, clearCurrentAlumni } from '../../store/slices/directorySlice';
import BackButton from '../../components/common/BackButton';
import toast from 'react-hot-toast';

const AlumniProfilePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentAlumni, isLoading, error } = useSelector((state) => state.directory);

  useEffect(() => {
    dispatch(fetchAlumniById(id));
    return () => dispatch(clearCurrentAlumni());
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      navigate('/directory');
    }
  }, [error, navigate]);

  if (isLoading || !currentAlumni) {
    return (
      <div style={styles.container}>
        <BackButton to="/directory" />
        <div style={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  const a = currentAlumni;
  const initials = a.fullName?.split(' ').map((n) => n[0]).join('').toUpperCase() || '?';
  const skills = a.skills ? a.skills.split(',').map((s) => s.trim()).filter(Boolean) : [];

  return (
    <div style={styles.container}>
      <BackButton to="/directory" label="Back to Directory" />

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          {a.profilePicture ? (
            <img src={a.profilePicture} alt={a.fullName} style={styles.avatar} />
          ) : (
            <div style={styles.avatarPlaceholder}>{initials}</div>
          )}

          <div style={styles.heroInfo}>
            <h1 style={styles.name}>{a.fullName}</h1>
            {a.currentPosition && (
              <p style={styles.position}>
                {a.currentPosition}
                {a.currentCompany && <span style={styles.company}> @ {a.currentCompany}</span>}
              </p>
            )}
            <div style={styles.metaRow}>
              {a.department && <span style={styles.metaBadge}>🎓 {a.department}</span>}
              {a.graduationYear && <span style={styles.metaBadge}>📅 Class of {a.graduationYear}</span>}
              {a.location && <span style={styles.metaBadge}>📍 {a.location}</span>}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.actions}>
          {a.linkedinUrl && (
            <a href={a.linkedinUrl} target="_blank" rel="noopener noreferrer" style={styles.primaryBtn}>
              💼 LinkedIn
            </a>
          )}
          {a.githubUrl && (
            <a href={a.githubUrl} target="_blank" rel="noopener noreferrer" style={styles.secondaryBtn}>
              💻 GitHub
            </a>
          )}
          {a.personalWebsite && (
            <a href={a.personalWebsite} target="_blank" rel="noopener noreferrer" style={styles.secondaryBtn}>
              🌐 Website
            </a>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div style={styles.grid}>
        {/* Left Column */}
        <div style={styles.main}>
          {/* About */}
          {a.bio && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>About</h3>
              <p style={styles.bio}>{a.bio}</p>
            </div>
          )}

          {/* Experience */}
          {a.currentCompany && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>💼 Experience</h3>
              <div style={styles.experienceItem}>
                <div style={styles.expIcon}>💼</div>
                <div>
                  <div style={styles.expTitle}>{a.currentPosition || 'Employee'}</div>
                  <div style={styles.expCompany}>{a.currentCompany}</div>
                  {a.industry && <div style={styles.expMeta}>Industry: {a.industry}</div>}
                  {a.yearsOfExperience && (
                    <div style={styles.expMeta}>{a.yearsOfExperience} years of experience</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Education */}
          {(a.department || a.degree || a.graduationYear) && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>🎓 Education</h3>
              <div style={styles.experienceItem}>
                <div style={styles.expIcon}>🎓</div>
                <div>
                  {a.degree && <div style={styles.expTitle}>{a.degree}</div>}
                  {a.department && <div style={styles.expCompany}>{a.department}</div>}
                  {a.graduationYear && (
                    <div style={styles.expMeta}>Class of {a.graduationYear}</div>
                  )}
                  {a.rollNumber && <div style={styles.expMeta}>Roll No: {a.rollNumber}</div>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={styles.sidebar}>
          {/* Skills */}
          {skills.length > 0 && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>⚡ Skills</h3>
              <div style={styles.skillsWrap}>
                {skills.map((s, i) => (
                  <span key={i} style={styles.skillTag}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {(a.linkedinUrl || a.githubUrl || a.twitterUrl || a.personalWebsite) && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>🔗 Links</h3>
              <div style={styles.linksList}>
                {a.linkedinUrl && (
                  <a href={a.linkedinUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
                    💼 LinkedIn
                  </a>
                )}
                {a.githubUrl && (
                  <a href={a.githubUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
                    💻 GitHub
                  </a>
                )}
                {a.twitterUrl && (
                  <a href={a.twitterUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
                    🐦 Twitter
                  </a>
                )}
                {a.personalWebsite && (
                  <a href={a.personalWebsite} target="_blank" rel="noopener noreferrer" style={styles.link}>
                    🌐 Website
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1100px', margin: '40px auto', padding: '0 24px' },
  loading: { textAlign: 'center', padding: '100px', color: '#64748b' },
  hero: {
    background: 'linear-gradient(135deg, #eef2ff 0%, #f0f9ff 100%)',
    border: '1px solid #c7d2fe',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '24px',
  },
  heroContent: { display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' },
  avatar: { width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: '0 4px 12px rgba(79,70,229,0.15)' },
  avatarPlaceholder: {
    width: '110px', height: '110px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '38px', fontWeight: '800', flexShrink: 0,
    border: '4px solid white', boxShadow: '0 4px 12px rgba(79,70,229,0.15)',
  },
  heroInfo: { flex: 1, minWidth: 0 },
  name: { fontSize: '30px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0' },
  position: { fontSize: '16px', color: '#475569', margin: '0 0 12px 0', fontWeight: '500' },
  company: { color: '#4f46e5', fontWeight: '700' },
  metaRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  metaBadge: { fontSize: '13px', padding: '5px 12px', background: 'white', color: '#475569', borderRadius: '20px', fontWeight: '600', border: '1px solid #e2e8f0' },
  actions: { display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' },
  primaryBtn: {
    padding: '10px 20px', background: '#0a66c2', color: 'white',
    textDecoration: 'none', borderRadius: '10px', fontWeight: '700',
    fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px',
  },
  secondaryBtn: {
    padding: '10px 20px', background: 'white', color: '#475569',
    border: '1.5px solid #e2e8f0', textDecoration: 'none',
    borderRadius: '10px', fontWeight: '600', fontSize: '14px',
    display: 'inline-flex', alignItems: 'center', gap: '6px',
  },
  grid: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' },
  main: { display: 'flex', flexDirection: 'column', gap: '20px' },
  sidebar: { display: 'flex', flexDirection: 'column', gap: '20px' },
  card: {
    background: 'white', padding: '24px', borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9',
  },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px 0' },
  bio: { fontSize: '15px', color: '#475569', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-wrap' },
  experienceItem: { display: 'flex', gap: '14px', alignItems: 'flex-start' },
  expIcon: {
    width: '48px', height: '48px', background: '#eef2ff',
    borderRadius: '12px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '22px', flexShrink: 0,
  },
  expTitle: { fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '2px' },
  expCompany: { fontSize: '14px', color: '#4f46e5', fontWeight: '600', marginBottom: '4px' },
  expMeta: { fontSize: '13px', color: '#64748b' },
  skillsWrap: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  skillTag: { padding: '6px 14px', background: '#eef2ff', color: '#4f46e5', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  linksList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  link: {
    padding: '10px 14px', background: '#f8fafc', color: '#475569',
    textDecoration: 'none', borderRadius: '10px', fontSize: '14px',
    fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px',
  },
};

export default AlumniProfilePage;