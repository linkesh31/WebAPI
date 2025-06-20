import { useState } from 'react'; // Importing necessary hooks from React
import { Link, useNavigate } from 'react-router-dom'; // Importing hooks for navigation and linking
import Swal from 'sweetalert2'; // Importing SweetAlert2 for alerts
import '../styles/ForgotPassword.css'; // Importing CSS styles for the ForgotPassword component
import axiosInstance from '../utils/axiosInstance'; // Importing custom axios instance for API calls

// ForgotPassword component definition
export default function ForgotPassword() {
  const [email, setEmail] = useState(''); // State for storing the user's email
  const [otpSent, setOtpSent] = useState(false); // State to track if OTP has been sent
  const [otp, setOtp] = useState(''); // State for storing the OTP entered by the user
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to handle sending the OTP to the user's email
  const handleSendOtp = async () => {
    try {
      await axiosInstance.post('/auth/request-reset', { email }); // API call to send OTP

      // Success alert for OTP sent
      Swal.fire({
        icon: 'success',
        title: 'OTP Sent!',
        text: 'Please check your email.',
        confirmButtonColor: '#7c3aed'
      });

      setOtpSent(true); // Update state to indicate OTP has been sent
    } catch (err) {
      // Error alert if sending OTP fails
      Swal.fire({
        icon: 'error',
        title: 'Failed to Send OTP',
        text: err.response?.data?.message || 'Something went wrong.',
        confirmButtonColor: '#7c3aed'
      });
    }
  };

  // Function to handle verifying the OTP entered by the user
  const handleVerifyOtp = async () => {
    try {
      await axiosInstance.post('/auth/verify-reset-otp', { email, otp }); // API call to verify OTP

      // Success alert for OTP verification
      Swal.fire({
        icon: 'success',
        title: 'OTP Verified',
        text: 'You can now reset your password.',
        confirmButtonColor: '#7c3aed'
      }).then(() => {
        navigate('/reset-password', { state: { email } }); // Navigate to reset password page
      });
    } catch (err) {
      // Error alert if OTP verification fails
      Swal.fire({
        icon: 'error',
        title: 'OTP Verification Failed',
        text: err.response?.data?.message || 'Invalid OTP. Please try again.',
        confirmButtonColor: '#7c3aed'
      });
    }
  };

  return (
    <div className="forgot-password-container"> {/* Main container for the forgot password form */}
      <div className="forgot-password-card"> {/* Card layout for the form */}
        <h2>Password Reset</h2> {/* Title for the form */}

        <label>Email Address</label> {/* Label for email input */}
        <input
          type="email" // Input type for email
          value={email} // Controlled input for email
          onChange={e => setEmail(e.target.value)} // Updating email state on change
          placeholder="Enter your email" // Placeholder text
        />
        <button onClick={handleSendOtp}>Send OTP</button> {/* Button to send OTP */}

        {otpSent && ( // Conditional rendering for OTP input if OTP has been sent
          <>
            <p>OTP sent successfully.</p> {/* Message indicating OTP was sent */}
            <label>Enter OTP</label> {/* Label for OTP input */}
            <input
              type="text" // Input type for OTP
              value={otp} // Controlled input for OTP
              onChange={e => setOtp(e.target.value)} // Updating OTP state on change
              placeholder="Enter OTP" // Placeholder text
            />
            <button onClick={handleVerifyOtp}>Submit OTP</button> {/* Button to submit OTP */}
          </>
        )}

        <div style={{ marginTop: '20px' }}> {/* Link to go back to login */}
          <Link to="/">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
