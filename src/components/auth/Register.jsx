import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'ROLE_ALUMNI',
    graduationYear: '',
    department: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <div style={styles.halfInput}>
              <label style={styles.label}>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.halfInput}>
              <label style={styles.label}>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
              placeholder="Min 8 chars, uppercase, number, special char"
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.row}>
            <div style={styles.halfInput}>
              <label style={styles.label}>Graduation Year</label>
              <input
                type="text"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                style={styles.input}
                placeholder="2020"
              />
            </div>
            <div style={styles.halfInput}>
              <label style={styles.label}>Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={styles.input}
                placeholder="Computer Science"
              />
            </div>
          </div>
          <button
            type="submit"
            style={styles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p style={styles.linkText}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#1a73e8',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  row: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
  },
  halfInput: {
    flex: 1,
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '500',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  linkText: {
    textAlign: 'center',
    marginTop: '20px',
  },
  link: {
    color: '#1a73e8',
    textDecoration: 'none',
  },
};

export default Register;