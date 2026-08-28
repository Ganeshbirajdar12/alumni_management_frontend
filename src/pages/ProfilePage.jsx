// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile, updateProfilePicture } from '../store/slices/profileSlice';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, isLoading, isUpdating, error } = useSelector((state) => state.profile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    dispatch(fetchProfile());
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(formData));
    if (!result.error) {
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    }
  };

  const handlePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, we'll use a placeholder URL
      // In production, upload to cloud storage first
      const pictureUrl = URL.createObjectURL(file);
      await dispatch(updateProfilePicture(pictureUrl));
      toast.success('Profile picture updated!');
    }
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading profile...</div>;
  }

  if (!profile) {
    return <div style={styles.error}>Failed to load profile</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Profile</h1>

      {/* Profile Header */}
      <div style={styles.header}>
        <div style={styles.avatarContainer}>
          {profile.profilePicture ? (
            <img src={profile.profilePicture} alt="Profile" style={styles.avatar} />
          ) : (
            <div style={styles.avatarPlaceholder}>
              {profile.firstName?.[0]}{profile.lastName?.[0]}
            </div>
          )}
          <label style={styles.uploadButton}>
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
              style={{ display: 'none' }}
            />
          </label>
        </div>
        <div style={styles.headerInfo}>
          <h2>{profile.fullName}</h2>
          <p>{profile.currentPosition || 'No position set'} {profile.currentCompany && `at ${profile.currentCompany}`}</p>
          <p>{profile.location || 'No location set'}</p>
          <div style={styles.badge}>
            {profile.profileCompleted ? '✅ Profile Complete' : '⚠️ Profile Incomplete'}
          </div>
        </div>
      </div>

      {/* Profile Details */}
      {!isEditing ? (
        <div style={styles.detailsCard}>
          <div style={styles.detailsHeader}>
            <h3>Profile Information</h3>
            <button onClick={() => setIsEditing(true)} style={styles.editButton}>Edit Profile</button>
          </div>
          
          <div style={styles.detailsGrid}>
            <DetailItem label="Email" value={profile.email} />
            <DetailItem label="Phone" value={profile.phoneNumber} />
            <DetailItem label="Graduation Year" value={profile.graduationYear} />
            <DetailItem label="Department" value={profile.department} />
            <DetailItem label="Degree" value={profile.degree} />
            <DetailItem label="Roll Number" value={profile.rollNumber} />
            <DetailItem label="Industry" value={profile.industry} />
            <DetailItem label="Years of Experience" value={profile.yearsOfExperience} />
          </div>

          <div style={styles.section}>
            <h4>Bio</h4>
            <p>{profile.bio || 'No bio added yet'}</p>
          </div>

          <div style={styles.section}>
            <h4>Skills</h4>
            <div style={styles.skills}>
              {profile.skills ? (
                profile.skills.split(',').map((skill, index) => (
                  <span key={index} style={styles.skillTag}>{skill.trim()}</span>
                ))
              ) : (
                <p>No skills added</p>
              )}
            </div>
          </div>

          <div style={styles.section}>
            <h4>Social Links</h4>
            <div style={styles.socialLinks}>
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>LinkedIn</a>
              )}
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>GitHub</a>
              )}
              {profile.twitterUrl && (
                <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>Twitter</a>
              )}
              {profile.personalWebsite && (
                <a href={profile.personalWebsite} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>Website</a>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Edit Form */
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            <FormInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
            <FormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
            <FormInput label="Phone" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            <FormInput label="Graduation Year" name="graduationYear" value={formData.graduationYear} onChange={handleChange} />
            <FormInput label="Department" name="department" value={formData.department} onChange={handleChange} />
            <FormInput label="Degree" name="degree" value={formData.degree} onChange={handleChange} />
            <FormInput label="Roll Number" name="rollNumber" value={formData.rollNumber} onChange={handleChange} />
            <FormInput label="Current Company" name="currentCompany" value={formData.currentCompany} onChange={handleChange} />
            <FormInput label="Current Position" name="currentPosition" value={formData.currentPosition} onChange={handleChange} />
            <FormInput label="Industry" name="industry" value={formData.industry} onChange={handleChange} />
            <FormInput label="Years of Experience" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} type="number" />
            <FormInput label="Location" name="location" value={formData.location} onChange={handleChange} />
            <FormInput label="LinkedIn URL" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} />
            <FormInput label="GitHub URL" name="githubUrl" value={formData.githubUrl} onChange={handleChange} />
            <FormInput label="Twitter URL" name="twitterUrl" value={formData.twitterUrl} onChange={handleChange} />
            <FormInput label="Personal Website" name="personalWebsite" value={formData.personalWebsite} onChange={handleChange} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Bio</label>
            <textarea
              name="bio"
              value={formData.bio || ''}
              onChange={handleChange}
              style={styles.textarea}
              rows="4"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Skills (comma separated)</label>
            <input
              name="skills"
              value={formData.skills || ''}
              onChange={handleChange}
              style={styles.input}
              placeholder="Java, Spring Boot, React..."
            />
          </div>

          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.saveButton} disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => setIsEditing(false)} style={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// Helper Components
const DetailItem = ({ label, value }) => (
  <div style={styles.detailItem}>
    <span style={styles.detailLabel}>{label}</span>
    <span style={styles.detailValue}>{value || 'N/A'}</span>
  </div>
);

const FormInput = ({ label, name, value, onChange, type = 'text' }) => (
  <div style={styles.formGroup}>
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

// Styles
const styles = {
  container: {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '0 20px',
  },
  title: {
    marginBottom: '30px',
    color: '#333',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
  },
  error: {
    textAlign: 'center',
    padding: '50px',
    color: 'red',
  },
  header: {
    display: 'flex',
    gap: '30px',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '30px',
  },
  avatarContainer: {
    textAlign: 'center',
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#1a73e8',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    fontWeight: 'bold',
  },
  uploadButton: {
    display: 'block',
    marginTop: '10px',
    color: '#1a73e8',
    cursor: 'pointer',
    fontSize: '14px',
  },
  headerInfo: {
    flex: 1,
  },
  badge: {
    display: 'inline-block',
    padding: '5px 10px',
    borderRadius: '4px',
    backgroundColor: '#f0f2f5',
    marginTop: '10px',
    fontSize: '14px',
  },
  detailsCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  detailsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee',
  },
  editButton: {
    padding: '8px 20px',
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailLabel: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '5px',
  },
  detailValue: {
    fontSize: '16px',
    color: '#333',
  },
  section: {
    marginTop: '25px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  skills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '10px',
  },
  skillTag: {
    padding: '5px 15px',
    backgroundColor: '#e8f0fe',
    color: '#1a73e8',
    borderRadius: '20px',
    fontSize: '14px',
  },
  socialLinks: {
    display: 'flex',
    gap: '15px',
    marginTop: '10px',
  },
  socialLink: {
    color: '#1a73e8',
    textDecoration: 'none',
    padding: '5px 15px',
    border: '1px solid #1a73e8',
    borderRadius: '4px',
  },
  form: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
  },
  label: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '5px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    resize: 'vertical',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px',
  },
  saveButton: {
    padding: '12px 30px',
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  cancelButton: {
    padding: '12px 30px',
    backgroundColor: '#f0f2f5',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default ProfilePage;