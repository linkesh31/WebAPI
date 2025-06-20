import axios from 'axios'; // Importing axios for making HTTP requests
import { useState } from 'react'; // Importing necessary hooks from React
import { useLocation, useNavigate } from 'react-router-dom'; // Importing hooks for routing
import Swal from 'sweetalert2'; // Importing SweetAlert2 for alerts
import otpBackground from '../assets/login_arttt.jpeg'; // Importing background image for the OTP page
import '../styles/OTP.css'; // Importing CSS styles for the OTP component

// OTP component definition
export default function OTP() {
  const [otp, setOtp] = useState(''); // State for storing the OTP entered by the user
  const location = useLocation(); // Hook to access the current location
  const navigate = useNavigate(); // Hook for programmatic navigation
  const email = location.state?.email; // Retrieving email from the location state

  // Function to handle OTP verification
  const handleVerify = async (e) => {
    e.preventDefault(); // Preventing default form submission behavior
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp }); // API call to verify OTP

      // Success alert for OTP verification
      Swal.fire({
        icon: 'success',
        title: 'OTP Verified!',
        text: response.data.message || 'You may now log in.', // Success message
        confirmButtonColor: '#7c3aed' // Custom button color
      }).then(() => {
        navigate('/'); // Navigating to the home page after successful verification
      });

    } catch (err) {
      // Error alert if verification fails
      Swal.fire({
        icon: 'error',
        title: 'Verification Failed', // Error title
        text: err.response?.data?.message || 'Invalid OTP. Please try again.', // Error message
        confirmButtonColor: '#7c3aed' // Custom button color
      });
    }
  };

  return (
    <div 
      className="otp-container" // Main container for the OTP page
      style={{ backgroundImage: `url(${otpBackground})` }} // Setting background image
    >
      <div className="otp-box"> {/* Box layout for the OTP form */}
        <h2>OTP VERIFICATION</h2> {/* Title for the OTP verification */}
        <form onSubmit={handleVerify}> {/* Form for OTP input */}
          <input
            type="text" // Input type for OTP
            placeholder="Enter OTP" // Placeholder text
            className="input-field" // CSS class for styling
            value={otp} // Controlled input for OTP
            onChange={(e) => setOtp(e.target.value)} // Updating OTP state on change
            required // Making the field required
          />
          <button type="submit" className="otp-btn"> {/* Button to submit the OTP */}
            VERIFY OTP
          </button>
        </form>
        <div className="footer-text"> {/* Footer text for instructions */}
          <p>Please check your email for the OTP code.</p> {/* Instruction message */}
        </div>
      </div>
    </div>
  );
}
