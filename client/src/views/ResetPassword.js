import { useState } from 'react'; // Importing necessary hooks from React
import { useLocation, useNavigate } from 'react-router-dom'; // Importing hooks for routing
import Swal from 'sweetalert2'; // Importing SweetAlert2 for alerts
import '../styles/ResetPassword.css'; // Importing CSS styles for the ResetPassword component
import axiosInstance from '../utils/axiosInstance'; // Importing custom axios instance for API calls

// ResetPassword component definition
export default function ResetPassword() {
  const location = useLocation(); // Hook to access the current location
  const navigate = useNavigate(); // Hook for programmatic navigation
  const email = location.state?.email; // Retrieving email from the location state

  // State variables for new password and confirm password
  const [newPassword, setNewPassword] = useState(''); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirming new password

  // Function to handle password reset
  const handleReset = async () => {
    if (newPassword !== confirmPassword) { // Checking if passwords match
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords do not match.', // Error alert if passwords do not match
        confirmButtonColor: '#7c3aed' // Custom button color
      });
      return; // Exit the function
    }

    try {
      await axiosInstance.post('/auth/reset-password', { email, newPassword }); // API call to reset password

      // Success alert for password reset
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Password reset successful!', // Success message
        confirmButtonColor: '#7c3aed' // Custom button color
      }).then(() => navigate('/')); // Navigate to home page after success
    } catch (err) {
      // Error alert if password reset fails
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Something went wrong.', // Error message
        confirmButtonColor: '#7c3aed' // Custom button color
      });
    }
  };

  return (
    <div className="reset-password-container"> {/* Main container for the reset password form */}
      <div className="reset-password-card"> {/* Card layout for the form */}
        <h2>Reset Your Password</h2> {/* Title for the form */}
        <input
          type="password" // Input type for new password
          placeholder="New Password" // Placeholder text
          value={newPassword} // Controlled input for new password
          onChange={(e) => setNewPassword(e.target.value)} // Updating new password state on change
        />
        <input
          type="password" // Input type for confirming new password
          placeholder="Confirm Password" // Placeholder text
          value={confirmPassword} // Controlled input for confirming password
          onChange={(e) => setConfirmPassword(e.target.value)} // Updating confirm password state on change
        />
        <button onClick={handleReset}>Reset Password</button> {/* Button to submit the form */}
      </div>
    </div>
  );
}
