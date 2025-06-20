import axios from 'axios'; // Importing axios for making HTTP requests
import { useState } from 'react'; // Importing necessary hooks from React
import { useNavigate } from 'react-router-dom'; // Importing hook for navigation
import Swal from 'sweetalert2'; // Importing SweetAlert2 for alerts
import signupBackground from '../assets/login_arttt.jpeg'; // Importing background image for the signup page
import '../styles/Signup.css'; // Importing CSS styles for the Signup component

// Signup component definition
export default function Signup() {
  const [formData, setFormData] = useState({ email: '', username: '', password: '' }); // State for storing form data
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Updating form data state
  };

  // Function to handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault(); // Preventing default form submission behavior
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData); // API call to signup
      
      // ✅ Sweet success modal
      Swal.fire({
        icon: 'success',
        title: 'Signup Successful!', // Success title
        text: response.data.message, // Success message
        confirmButtonColor: '#7c3aed' // Custom button color
      }).then(() => {
        navigate('/otp', { state: { email: formData.email } }); // Navigating to OTP page with email state
      });
    } catch (err) {
      // Sweet error modal
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed', // Error title
        text: err.response?.data?.message || 'An error occurred.', // Error message
        confirmButtonColor: '#7c3aed' // Custom button color
      });
    }
  };

  return (
    <div 
      className="signup-container" // Main container for the signup page
      style={{ backgroundImage: `url(${signupBackground})` }} // Setting background image
    >
      <div className="signup-box"> {/* Box layout for the signup form */}
        <h2>SenpaiStats Signup</h2> {/* Title for the signup form */}
        <form onSubmit={handleSignup}> {/* Form for signup */}
          <input
            type="email" // Input type for email
            name="email" // Name attribute for the input
            placeholder="Email" // Placeholder text
            className="input-field" // CSS class for styling
            value={formData.email} // Controlled input for email
            onChange={handleChange} // Updating email state on change
            required // Making the field required
          />
          <input
            type="text" // Input type for username
            name="username" // Name attribute for the input
            placeholder="Username" // Placeholder text
            className="input-field" // CSS class for styling
            value={formData.username} // Controlled input for username
            onChange={handleChange} // Updating username state on change
            required // Making the field required
          />
          <input
            type="password" // Input type for password
            name="password" // Name attribute for the input
            placeholder="Password" // Placeholder text
            className="input-field" // CSS class for styling
            value={formData.password} // Controlled input for password
            onChange={handleChange} // Updating password state on change
            required // Making the field required
          />
          <button type="submit" className="signup-btn">Sign Up</button> {/* Button to submit the form */}
        </form>
        <div className="footer-text"> {/* Footer text for additional links */}
          <p>Already have an account? <a href="/">Login</a></p> {/* Link to login page */}
        </div>
      </div>
    </div>
  );
}
