import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      await axiosInstance.post('/auth/request-reset', { email });

      Swal.fire({
        icon: 'success',
        title: 'OTP Sent!',
        text: 'Please check your email.',
        confirmButtonColor: '#7c3aed'
      });

      setOtpSent(true);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Send OTP',
        text: err.response?.data?.message || 'Something went wrong.',
        confirmButtonColor: '#7c3aed'
      });
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await axiosInstance.post('/auth/verify-reset-otp', { email, otp });

      Swal.fire({
        icon: 'success',
        title: 'OTP Verified',
        text: 'You can now reset your password.',
        confirmButtonColor: '#7c3aed'
      }).then(() => {
        navigate('/reset-password', { state: { email } });
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'OTP Verification Failed',
        text: err.response?.data?.message || 'Invalid OTP. Please try again.',
        confirmButtonColor: '#7c3aed'
      });
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Password Reset</h2>

        <label>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <button onClick={handleSendOtp}>Send OTP</button>

        {otpSent && (
          <>
            <p>OTP sent successfully.</p>
            <label>Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            <button onClick={handleVerifyOtp}>Submit OTP</button>
          </>
        )}

        <div style={{ marginTop: '20px' }}>
          <Link to="/">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
