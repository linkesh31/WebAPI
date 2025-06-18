import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/ResetPassword.css';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords do not match.',
        confirmButtonColor: '#7c3aed'
      });
      return;
    }

    try {
      await axiosInstance.post('/auth/reset-password', { email, newPassword });

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Password reset successful!',
        confirmButtonColor: '#7c3aed'
      }).then(() => navigate('/'));
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Something went wrong.',
        confirmButtonColor: '#7c3aed'
      });
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h2>Reset Your Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={handleReset}>Reset Password</button>
      </div>
    </div>
  );
}
