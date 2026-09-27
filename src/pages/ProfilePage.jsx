import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  fetchProfile,
  updateProfile,
  fetchPromotionStatus,
} from '../store/slices/profileSlice';
import PromotionModal from '../components/profile/PromotionModal';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, promotionStatus, isLoading, isUpdating, error } = useSelector(
    (state) => state.profile
  );
  const [searchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(searchParams.get('edit') === 'true');
  const [formData, setFormData] = useState({});
  const [showPromotionModal, setShowPromotionModal] = useState(false);

  useEffect(() => {
    if (searchParams.get('edit') === 'true') {
      setIsEditing(true);
    }
  }, [searchParams]);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchPromotionStatus());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const isAlumni = profile?.role === 'ROLE_ALUMNI';
  const isStudent = profile?.role === 'ROLE_STUDENT';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Build request with only changed/valid fields
    const payload = { ...formData };
    // If student, remove work fields
    if (isStudent) {
      delete payload.currentCompany;
      delete payload.currentPosition;
      delete payload.industry;
      delete payload.yearsOfExperience;
    }

    const result = await dispatch(updateProfile(payload));
    if (!result.error) {
      toast.success('Profile updated!');
      setIsEditing(false);
    }
  };

  const handlePromotionSuccess = () => {
    dispatch(fetchPromotionStatus());
  };

  if (isLoading) return <div style={styles.loading}>Loading...</div>;
  if (!profile) return <div style={styles.error}>Failed to load profile</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>My Profile</h1>

      {/* ==================== PROMOTION BANNER ==================== */}
      {isStudent && <PromotionBanner status={promotionStatus} onRequest={() => setShowPromotionModal(true)} />}

      {/* ==================== PROFILE HEADER ==================== */}
      <div style={styles.header}>
        <div style={styles.avatar}>
          {profile.profilePicture ? (
            <img src={profile.profilePicture} alt="Profile" style={styles.avatarImg} />
          ) : (
            <div style={styles.avatarPlaceholder}>
              {profile.firstName?.[0]}
              {profile.lastName?.[0]}
            </div>
          )}
        </div>
        <div>
          <h2 style={styles.name}>{profile.fullName}</h2>
          <p style={styles.role}>
            {isAlumni ? '🎓 Alumni' : isStudent ? '📚 Student' : '👤 User'}
          </p>
          {profile.currentPosition && (
            <p style={styles.position}>
              {profile.currentPosition} {profile.currentCompany && `@ ${profile.currentCompany}`}
            </p>
          )}
        </div>
      </div>

      {/* ==================== DETAILS / EDIT ==================== */}
      {!isEditing ? (
        <ViewMode profile={profile} isAlumni={isAlumni} onEdit={() => setIsEditing(true)} />
      ) : (
        <EditMode
          formData={formData}
          isAlumni={isAlumni}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditing(false)}
          isUpdating={isUpdating}
        />
      )}

      {/* ==================== PROMOTION MODAL ==================== */}
      {showPromotionModal && (
        <PromotionModal
          onClose={() => setShowPromotionModal(false)}
          onSuccess={handlePromotionSuccess}
        />
      )}
    </div>
  );
};

// ==================== PROMOTION BANNER COMPONENT ====================
const PromotionBanner = ({ status, onRequest }) => {
  // No request yet → show "Request Promotion"
  if (!status || status.status === 'EXPIRED') {
    return (
      <div style={styles.banner}>
        <div style={styles.bannerIcon}>🎓</div>
        <div style={styles.bannerContent}>
          <h3 style={styles.bannerTitle}>Ready to Graduate?</h3>
          <p style={styles.bannerText}>
            Upgrade to Alumni status to unlock work information, job posting, and mentorship features.
          </p>
        </div>
        <button style={styles.bannerBtn} onClick={onRequest}>
          Request Promotion
        </button>
      </div>
    );
  }

  if (status.status === 'PENDING_OTP') {
    return (
      <div style={{ ...styles.banner, ...styles.bannerWarning }}>
        <div style={styles.bannerIcon}>📧</div>
        <div style={styles.bannerContent}>
          <h3 style={styles.bannerTitle}>OTP Pending</h3>
          <p style={styles.bannerText}>
            We sent an OTP to your email. Verify it to continue.
          </p>
        </div>
        <button style={styles.bannerBtn} onClick={onRequest}>
          Verify OTP
        </button>
      </div>
    );
  }

  if (status.status === 'PENDING_APPROVAL') {
    return (
      <div style={{ ...styles.banner, ...styles.bannerInfo }}>
        <div style={styles.bannerIcon}>⏳</div>
        <div style={styles.bannerContent}>
          <h3 style={styles.bannerTitle}>Promotion Under Review</h3>
          <p style={styles.bannerText}>
            Your request has been submitted! Our team will review it within 24 hours.
          </p>
          <p style={styles.bannerSmall}>
            Requested: {new Date(status.requestedAt).toLocaleString()}
          </p>
        </div>
      </div>
    );
  }

  if (status.status === 'REJECTED') {
    return (
      <div style={{ ...styles.banner, ...styles.bannerDanger }}>
        <div style={styles.bannerIcon}>❌</div>
        <div style={styles.bannerContent}>
          <h3 style={styles.bannerTitle}>Promotion Request Rejected</h3>
          <p style={styles.bannerText}>
            Reason: {status.adminRemarks || 'Not specified'}
          </p>
          <p style={styles.bannerSmall}>You can request again after 24 hours.</p>
        </div>
      </div>
    );
  }

  return null;
};

// ==================== VIEW MODE ====================
const ViewMode = ({ profile, isAlumni, onEdit }) => (
  <div style={styles.card}>
    <div style={styles.cardHeader}>
      <h3 style={styles.cardTitle}>Profile Information</h3>
      <button style={styles.editBtn} onClick={onEdit}>Edit Profile</button>
    </div>

    <div style={styles.grid}>
      <Field label="Email" value={profile.email} />
      <Field label="Phone" value={profile.phoneNumber} />
      <Field label="Department" value={profile.department} />
      <Field label="Degree" value={profile.degree} />
      <Field label="Graduation Year" value={profile.graduationYear} />
      <Field label="Location" value={profile.location} />

      {/* Only alumni see work info */}
      {isAlumni && (
        <>
          <Field label="Company" value={profile.currentCompany} />
          <Field label="Position" value={profile.currentPosition} />
          <Field label="Industry" value={profile.industry} />
          <Field label="Experience" value={profile.yearsOfExperience ? `${profile.yearsOfExperience} years` : null} />
        </>
      )}
    </div>

    {profile.bio && (
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Bio</h4>
        <p style={styles.sectionText}>{profile.bio}</p>
      </div>
    )}

    {profile.skills && (
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Skills</h4>
        <div style={styles.skills}>
          {profile.skills.split(',').map((s, i) => (
            <span key={i} style={styles.skillTag}>{s.trim()}</span>
          ))}
        </div>
      </div>
    )}
  </div>
);

// ==================== EDIT MODE ====================
const EditMode = ({ formData, isAlumni, onChange, onSubmit, onCancel, isUpdating }) => (
  <form style={styles.card} onSubmit={onSubmit}>
    <div style={styles.cardHeader}>
      <h3 style={styles.cardTitle}>Edit Profile</h3>
    </div>

    <div style={styles.grid}>
      <Input label="First Name" name="firstName" value={formData.firstName} onChange={onChange} />
      <Input label="Last Name" name="lastName" value={formData.lastName} onChange={onChange} />
      <Input label="Phone" name="phoneNumber" value={formData.phoneNumber} onChange={onChange} />
      <Input label="Department" name="department" value={formData.department} onChange={onChange} />
      <Input label="Degree" name="degree" value={formData.degree} onChange={onChange} />
      <Input label="Graduation Year" name="graduationYear" value={formData.graduationYear} onChange={onChange} />
      <Input label="Location" name="location" value={formData.location} onChange={onChange} />
    </div>

    {/* Work info — ONLY for alumni */}
    {isAlumni && (
      <>
        <div style={styles.sectionDivider}>
          <h4 style={styles.sectionTitle}>Professional Information</h4>
        </div>
        <div style={styles.grid}>
          <Input label="Company" name="currentCompany" value={formData.currentCompany} onChange={onChange} />
          <Input label="Position" name="currentPosition" value={formData.currentPosition} onChange={onChange} />
          <Input label="Industry" name="industry" value={formData.industry} onChange={onChange} />
          <Input label="Years of Experience" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={onChange} type="number" />
        </div>
      </>
    )}

    {!isAlumni && (
      <div style={styles.lockedNote}>
        🔒 Professional information is locked. Request promotion to unlock.
      </div>
    )}

    <div style={styles.formGroup}>
      <label style={styles.label}>Bio</label>
      <textarea
        name="bio"
        value={formData.bio || ''}
        onChange={onChange}
        rows={3}
        style={styles.textarea}
        placeholder="Tell us about yourself..."
      />
    </div>

    <div style={styles.formGroup}>
      <label style={styles.label}>Skills (comma separated)</label>
      <input
        name="skills"
        value={formData.skills || ''}
        onChange={onChange}
        style={styles.input}
        placeholder="Java, Spring Boot, React..."
      />
    </div>

    <div style={styles.buttonGroup}>
      <button type="submit" style={styles.saveBtn} disabled={isUpdating}>
        {isUpdating ? 'Saving...' : 'Save Changes'}
      </button>
      <button type="button" style={styles.cancelBtn} onClick={onCancel}>
        Cancel
      </button>
    </div>
  </form>
);

// ==================== SMALL COMPONENTS ====================
const Field = ({ label, value }) => (
  <div style={styles.field}>
    <span style={styles.fieldLabel}>{label}</span>
    <span style={styles.fieldValue}>{value || 'N/A'}</span>
  </div>
);

const Input = ({ label, name, value, onChange, type = 'text' }) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      style={styles.input}
    />
  </div>
);

// ==================== STYLES ====================
const styles = {
  container: { maxWidth: '900px', margin: '40px auto', padding: '0 20px' },
  pageTitle: { fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' },
  loading: { textAlign: 'center', padding: '60px', color: '#64748b' },
  error: { textAlign: 'center', padding: '60px', color: '#ef4444' },

  // Banner
  banner: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '24px',
    background: 'linear-gradient(135deg, #eef2ff 0%, #f0f9ff 100%)',
    border: '1px solid #c7d2fe',
    borderRadius: '16px',
    marginBottom: '24px',
  },
  bannerWarning: { background: '#fef3c7', borderColor: '#fcd34d' },
  bannerInfo: { background: '#dbeafe', borderColor: '#93c5fd' },
  bannerDanger: { background: '#fee2e2', borderColor: '#fca5a5' },
  bannerIcon: { fontSize: '40px' },
  bannerContent: { flex: 1 },
  bannerTitle: { fontSize: '17px', fontWeight: '700', color: '#1e293b', margin: '0 0 6px 0' },
  bannerText: { fontSize: '14px', color: '#475569', margin: '0 0 4px 0' },
  bannerSmall: { fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' },
  bannerBtn: {
    padding: '10px 20px',
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },

  // Header
  header: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    padding: '24px',
    background: 'white',
    borderRadius: '16px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  avatar: { flexShrink: 0 },
  avatarImg: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' },
  avatarPlaceholder: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: '700',
  },
  name: { fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' },
  role: { fontSize: '14px', color: '#4f46e5', fontWeight: '600', margin: '0 0 4px 0' },
  position: { fontSize: '14px', color: '#64748b', margin: 0 },

  // Card
  card: {
    background: 'white',
    padding: '28px',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #f1f5f9',
  },
  cardTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 },
  editBtn: {
    padding: '8px 20px',
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },

  // Grid
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '20px',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '4px' },
  fieldLabel: { fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' },
  fieldValue: { fontSize: '15px', color: '#1e293b' },

  // Sections
  section: { marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' },
  sectionDivider: { marginTop: '20px', marginBottom: '16px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' },
  sectionTitle: { fontSize: '15px', fontWeight: '700', color: '#475569', margin: '0 0 12px 0' },
  sectionText: { fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: 0 },
  skills: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  skillTag: {
    padding: '5px 12px',
    background: '#eef2ff',
    color: '#4f46e5',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },

  // Forms
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#475569' },
  input: {
    padding: '10px 12px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
  },
  textarea: {
    padding: '10px 12px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  lockedNote: {
    padding: '12px 16px',
    background: '#fef3c7',
    border: '1px solid #fcd34d',
    borderRadius: '10px',
    fontSize: '13px',
    color: '#92400e',
    marginBottom: '16px',
  },

  // Buttons
  buttonGroup: { display: 'flex', gap: '12px', marginTop: '8px' },
  saveBtn: {
    padding: '12px 28px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '12px 28px',
    background: '#f1f5f9',
    color: '#475569',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default ProfilePage;