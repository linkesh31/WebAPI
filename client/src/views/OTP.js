import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/OTP.css';
import otpBackground from '../assets/login_arttt.jpeg';

export default function OTP() {
  const [otp, setOtp] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });

      Swal.fire({
        icon: 'success',
        title: 'OTP Verified!',
        text: response.data.message || 'You may now log in.',
        confirmButtonColor: '#7c3aed'
      }).then(() => {
        navigate('/');
      });

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: err.response?.data?.message || 'Invalid OTP. Please try again.',
        confirmButtonColor: '#7c3aed'
      });
    }
  };

  return (
    <div 
      className="otp-container" 
      style={{ backgroundImage: `url(${otpBackground})` }}
    >
      <div className="otp-box">
        <h2>OTP VERIFICATION</h2>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter OTP"
            className="input-field"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit" className="otp-btn">
            VERIFY OTP
          </button>
        </form>
        <div className="footer-text">
          <p>Please check your email for the OTP code.</p>
        </div>
      </div>
    </div>
  );
}
