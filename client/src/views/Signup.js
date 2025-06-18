import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/Signup.css';
import signupBackground from '../assets/login_arttt.jpeg';  // consistent background

export default function Signup() {
  const [formData, setFormData] = useState({ email: '', username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      
      // ✅ Sweet success modal
      Swal.fire({
        icon: 'success',
        title: 'Signup Successful!',
        text: response.data.message,
        confirmButtonColor: '#7c3aed'
      }).then(() => {
        navigate('/otp', { state: { email: formData.email } });
      });
    } catch (err) {
      // ❌ Sweet error modal
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: err.response?.data?.message || 'An error occurred.',
        confirmButtonColor: '#7c3aed'
      });
    }
  };

  return (
    <div 
      className="signup-container" 
      style={{ backgroundImage: `url(${signupBackground})` }}
    >
      <div className="signup-box">
        <h2>SenpaiStats Signup</h2>
        <form onSubmit={handleSignup}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input-field"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="input-field"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input-field"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        <div className="footer-text">
          <p>Already have an account? <a href="/">Login</a></p>
        </div>
      </div>
    </div>
  );
}
