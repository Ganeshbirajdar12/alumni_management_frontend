import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestPromotionOtp, verifyPromotionOtp, clearError } from '../../store/slices/profileSlice';
import toast from 'react-hot-toast';

const PromotionModal = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1 = send OTP, 2 = verify OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);

  const dispatch = useDispatch();
  const { isRequestingOtp, isVerifyingOtp, error } = useSelector((state) => state.profile);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Countdown for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOtp = async () => {
    const result = await dispatch(requestPromotionOtp());
    if (!result.error) {
      toast.success('OTP sent to your email!');
      setStep(2);
      setResendTimer(60); // 60 seconds cooldown
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // only numbers

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    const result = await dispatch(verifyPromotionOtp(otpCode));
    if (!result.error) {
      toast.success('Verified! Waiting for admin approval.');
      onSuccess && onSuccess();
      onClose();
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    const result = await dispatch(requestPromotionOtp());
    if (!result.error) {
      toast.success('New OTP sent!');
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>

        {step === 1 ? (
          // ============= STEP 1: SEND OTP =============
          <>
            <div style={styles.header}>
              <div style={styles.icon}>📧</div>
              <h2 style={styles.title}>Verify Your Email</h2>
              <p style={styles.subtitle}>
                We'll send a 6-digit code to your registered email to verify your identity.
              </p>
            </div>

            <button
              style={styles.primaryBtn}
              onClick={handleSendOtp}
              disabled={isRequestingOtp}
            >
              {isRequestingOtp ? 'Sending...' : 'Send OTP'}
            </button>
          </>
        ) : (
          // ============= STEP 2: VERIFY OTP =============
          <>
            <div style={styles.header}>
              <div style={styles.icon}>🔐</div>
              <h2 style={styles.title}>Enter Verification Code</h2>
              <p style={styles.subtitle}>
                Enter the 6-digit code sent to your email
              </p>
            </div>

            <div style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  style={styles.otpInput}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <div style={styles.resendContainer}>
              {resendTimer > 0 ? (
                <span style={styles.resendText}>
                  Resend in 00:{resendTimer.toString().padStart(2, '0')}
                </span>
              ) : (
                <button style={styles.resendBtn} onClick={handleResend}>
                  Resend OTP
                </button>
              )}
            </div>

            <button
              style={styles.primaryBtn}
              onClick={handleVerify}
              disabled={isVerifyingOtp || otp.join('').length !== 6}
            >
              {isVerifyingOtp ? 'Verifying...' : 'Verify'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '20px',
  },
  modal: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '420px',
    width: '100%',
    position: 'relative',
    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
    animation: 'slideUp 0.3s ease-out',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '32px',
    height: '32px',
    border: 'none',
    background: '#f1f5f9',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#64748b',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  icon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
    lineHeight: '1.5',
  },
  primaryBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '8px',
  },
  otpContainer: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  otpInput: {
    width: '48px',
    height: '56px',
    textAlign: 'center',
    fontSize: '22px',
    fontWeight: '700',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    outline: 'none',
    transition: 'border 0.2s',
  },
  resendContainer: {
    textAlign: 'center',
    marginBottom: '20px',
    minHeight: '24px',
  },
  resendText: {
    fontSize: '13px',
    color: '#94a3b8',
  },
  resendBtn: {
    background: 'none',
    border: 'none',
    color: '#4f46e5',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default PromotionModal;