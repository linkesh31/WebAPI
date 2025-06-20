import axios from 'axios'; // Importing axios for making HTTP requests
import { useState } from 'react'; // Importing necessary hooks from React
import { Link, useNavigate } from 'react-router-dom'; // Importing hooks for navigation and linking
import Swal from 'sweetalert2'; // Importing SweetAlert2 for alerts
import loginBackground from '../assets/login_arttt.jpeg'; // Importing background image for the login page
import '../styles/Login.css'; // Importing CSS styles for the Login component

// Login component definition
export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' }); // State for storing form data
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Updating form data state
  };

  // Function to handle form submission for login
  const handleLogin = async (e) => {
    e.preventDefault(); // Preventing default form submission behavior
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData); // API call to log in

      // ✅ Sweet success modal
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome back!', // Success message
        confirmButtonColor: '#7c3aed' // Custom button color
      }).then(() => {
        localStorage.setItem('token', response.data.token); // Storing token in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Storing user data in localStorage
        navigate('/dashboard'); // Navigating to the dashboard
      });

    } catch (err) {
      // ❌ Sweet error modal
      Swal.fire({
        icon: 'error',
        title: 'Login Failed', // Error title
        text: err.response?.data?.message || 'Something went wrong.', // Error message
        confirmButtonColor: '#7c3aed' // Custom button color
      });
      console.error(err); // Logging error to the console
    }
  };

  return (
    <div 
      className="container" // Main container for the login page
      style={{ backgroundImage: `url(${loginBackground})` }} // Setting background image
    >
      <div className="login-box"> {/* Box for the login form */}
        <h2>SenpaiStats</h2> {/* Title of the application */}
        <form onSubmit={handleLogin}> {/* Form for login */}
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
            type="password" // Input type for password
            name="password" // Name attribute for the input
            placeholder="Password" // Placeholder text
            className="input-field" // CSS class for styling
            value={formData.password} // Controlled input for password
            onChange={handleChange} // Updating password state on change
            required // Making the field required
          />
          <div className="options"> {/* Options for additional links */}
            <Link to="/forgot-password" className="link-button"> {/* Link to forgot password page */}
              Forgot Password?
            </Link>
            <Link to="/signup" className="link-button">Sign Up</Link>
                                                                         {/* Link to sign up page */}
          </div>
          <button type="submit" className="login-btn">Login</button> {/* Button to submit the form */}
        </form>
        <div className="footer-text"></div> {/* Placeholder for footer text */}
      </div>
    </div>
  );
}
