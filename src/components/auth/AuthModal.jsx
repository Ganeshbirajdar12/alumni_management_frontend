import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, clearError } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ mode: initialMode, onClose, onSwitchMode }) => {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    graduationYear: '',
    department: '',
  });

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const navigate = useNavigate();
   
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (mode === 'login') {
    const result = await dispatch(login({
      email: formData.email,
      password: formData.password,
    }));
    if (!result.error) {
      toast.success('Welcome back!');
      onClose();

      // ⬇️ NEW: Redirect by role
      const userRole = result.payload?.user?.role;
      if (userRole === 'ROLE_SUPER_ADMIN' || userRole === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  } else {
    const result = await dispatch(register(formData));
    if (!result.error) {
      toast.success('Account created! Welcome to AlumniHub 🎓');
      onClose();
      // Register always creates STUDENT → go to normal dashboard
      navigate('/dashboard');
    }
  }
};

  const switchMode = (newMode) => {
    setMode(newMode);
    onSwitchMode(newMode);
    dispatch(clearError());
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>✕</button>

        <div className="auth-modal-header">
          <div className="auth-modal-icon">
            {mode === 'login' ? '👋' : '🎓'}
          </div>
          <h2 className="auth-modal-title">
            {mode === 'login' ? 'Welcome Back' : 'Join AlumniHub'}
          </h2>
          <p className="auth-modal-subtitle">
            {mode === 'login'
              ? 'Sign in to your account to continue'
              : 'Create your student account to get started'}
          </p>
        </div>

        <div className="auth-modal-tabs">
          <button
            className={`auth-modal-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Sign In
          </button>
          <button
            className={`auth-modal-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => switchMode('register')}
          >
            Register
          </button>
        </div>

        <div className="auth-modal-body">
          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                <div className="auth-form-row">
                  <div className="auth-form-group">
                    <label className="auth-form-label">First Name</label>
                    <input
                      className="auth-form-input"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="auth-form-group">
                    <label className="auth-form-label">Last Name</label>
                    <input
                      className="auth-form-input"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label className="auth-form-label">Phone Number</label>
                  <input
                    className="auth-form-input"
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+919876543210"
                    required
                  />
                </div>

                <div className="auth-form-row">
                  <div className="auth-form-group">
                    <label className="auth-form-label">Expected Graduation Year</label>
                    <input
                      className="auth-form-input"
                      type="text"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      placeholder="2025"
                    />
                  </div>
                  <div className="auth-form-group">
                    <label className="auth-form-label">Department</label>
                    <input
                      className="auth-form-input"
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="Computer Science"
                    />
                  </div>
                </div>

                {/* Info banner about student role */}
                <div style={{
                  padding: '12px 14px',
                  background: '#eef2ff',
                  border: '1px solid #c7d2fe',
                  borderRadius: '10px',
                  fontSize: '13px',
                  color: '#4338ca',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}>
                  <span style={{ fontSize: '16px' }}>ℹ️</span>
                  <div>
                    <strong>Student Account</strong><br />
                    You'll be registered as a <strong>Student</strong>. Once you graduate,
                    your account will be upgraded to <strong>Alumni</strong> status.
                  </div>
                </div>
              </>
            )}

            <div className="auth-form-group">
              <label className="auth-form-label">Email Address</label>
              <input
                className="auth-form-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Password</label>
              <input
                className="auth-form-input"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={mode === 'register' ? 'Min 8 chars with uppercase, number & symbol' : 'Enter your password'}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading
                ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
                : (mode === 'login' ? 'Sign In' : 'Create Student Account')}
            </button>

            <div className="auth-form-footer">
              {mode === 'login' ? (
                <>Don't have an account? <button type="button" onClick={() => switchMode('register')}>Sign up</button></>
              ) : (
                <>Already have an account? <button type="button" onClick={() => switchMode('login')}>Sign in</button></>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;