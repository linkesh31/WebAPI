// src/views/ProfilePage.js
import { useContext, useEffect, useState } from 'react'; // Importing necessary hooks from React
import { useNavigate } from 'react-router-dom'; // Importing hook for navigation
import Swal from 'sweetalert2'; // Importing SweetAlert2 for alerts
import bgImage from '../assets/profilee.jpg'; // Importing background image for the profile page
import { ThemeContext } from '../context/ThemeContext'; // Importing ThemeContext for theme management
import '../styles/ProfilePage.css'; // Importing CSS styles for the ProfilePage component
import axiosInstance from '../utils/axiosInstance'; // Importing custom axios instance for API calls

// ProfilePage component definition
export default function ProfilePage() {
  const navigate = useNavigate(); // Hook for programmatic navigation
  const { theme } = useContext(ThemeContext); // Accessing theme from context

  // State variables for profile data and UI management
  const [profile, setProfile] = useState({});
  const [animeCount, setAnimeCount] = useState(0);
  const [gameCount, setGameCount] = useState(0);
  const [musicCount, setMusicCount] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // useEffect to load profile data and set theme on component mount
  useEffect(() => {
    loadProfile(); // Loading profile data
    document.body.classList.remove('light-theme', 'dark-theme'); // Removing existing theme classes
    document.body.classList.add(`${theme}-theme`); // Adding the current theme class
  }, [theme]);

  // Function to load user profile data from the server
  const loadProfile = async () => {
    try {
      const res = await axiosInstance.get('/profile'); // API call to fetch profile data
      const user = res.data?.user || {}; // Extracting user data
      setProfile(user); // Setting profile state
      setUsername(user.username || ''); // Setting username state
      setBio(user.bio || ''); // Setting bio state
      setEmail(user.email || ''); // Setting email state
      setAnimeCount(res.data.favorites?.anime || 0); // Setting anime count
      setGameCount(res.data.favorites?.games || 0); // Setting game count
      setMusicCount(res.data.favorites?.music || 0); // Setting music count
    } catch {
      Swal.fire('Error', 'Failed to load profile', 'error'); // Error alert if loading fails
    }
  };

  // Function to handle profile update
  const handleUpdateProfile = async () => {
    try {
      await axiosInstance.put('/profile/update', { username, bio, email }); // API call to update profile
      Swal.fire('Success', 'Profile updated', 'success'); // Success alert
      setEditMode(false); // Exiting edit mode
      loadProfile(); // Reloading profile data
    } catch {
      Swal.fire('Error', 'Update failed', 'error'); // Error alert if update fails
    }
  };

  // Function to handle password change
  const handleChangePassword = async () => {
    if (!currentPassword.trim() || !newPassword.trim()) { // Checking if both passwords are provided
      Swal.fire('Error', 'Please enter both current and new password.', 'error'); // Error alert
      return; // Exit the function
    }
    try {
      await axiosInstance.put('/profile/change-password', { currentPassword, newPassword }); // API call to change password
      Swal.fire('Success', 'Password changed', 'success'); // Success alert
      setCurrentPassword(''); // Resetting current password field
      setNewPassword(''); // Resetting new password field
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Password change failed', 'error'); // Error alert if change fails
    }
  };

  // Function to handle account deletion
  const handleDeleteAccount = async () => {
    const result = await Swal.fire({ // Confirmation dialog for account deletion
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) { // If confirmed
      try {
        await axiosInstance.delete('/profile/delete'); // API call to delete account
        Swal.fire('Deleted!', 'Your account has been deleted.', 'success'); // Success alert
        localStorage.removeItem('token'); // Removing token from localStorage
        localStorage.removeItem('user'); // Removing user data from localStorage
        navigate('/'); // Navigating to home page
      } catch {
        Swal.fire('Error', 'Delete failed', 'error'); // Error alert if deletion fails
      }
    }
  };

  // Function to handle user logout
  const handleLogout = async () => {
    const result = await Swal.fire({ // Confirmation dialog for logout
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Logout'
    });

    if (result.isConfirmed) { // If confirmed
      localStorage.removeItem('token'); // Removing token from localStorage
      localStorage.removeItem('user'); // Removing user data from localStorage
      navigate('/'); // Navigating to home page
    }
  };

  return (
    <div className="profile-wrapper"> {/* Main wrapper for the profile page */}
      <div
        className="cover-section" // Cover section for background image
        style={{ backgroundImage: `url(${bgImage})` }} // Setting background image
      >
        <div className="cover-overlay" /> {/* Overlay for the cover section */}
      </div>

      <div className="profile-card"> {/* Card layout for profile information */}
        <div className="profile-header"> {/* Header section for profile */}
          <div className="initials-avatar"> {/* Avatar displaying initials */}
            {username ? username[0].toUpperCase() : '?'} {/* Displaying first letter of username */}
          </div>
          <div className="info"> {/* Info section for user details */}
            <h2 className="username">{username || 'N/A'}</h2> {/* Displaying username */}
            <p className="followers"> {/* Displaying counts of favorites */}
              🎌 {animeCount} Anime · 🎮 {gameCount} Games · 🎵 {musicCount} Music
            </p>
            <p className="meta">📧 {email || 'N/A'}</p> {/* Displaying email */}
            <p className="meta">📅 Joined: {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p> {/* Displaying join date */}
          </div>
          <div>
            {editMode ? ( // Conditional rendering for edit mode
              <button className="save-button" onClick={handleUpdateProfile}>💾 Save</button> // Save button
            ) : (
              <button className="edit-button" onClick={() => setEditMode(true)}>✏️ Edit</button> // Edit button
            )}
          </div>
        </div>

        <div className="form-section"> {/* Section for personal info */}
          <h3>📝 Personal Info</h3> {/* Section title */}
          <div className="form-grid"> {/* Grid layout for form inputs */}
            <div>
              <label>Username</label> {/* Label for username input */}
              <input value={username} onChange={e => setUsername(e.target.value)} disabled={!editMode} /> {/* Username input */}
            </div>
            <div>
              <label>Email</label> {/* Label for email input */}
              <input value={email} onChange={e => setEmail(e.target.value)} disabled={!editMode} /> {/* Email input */}
            </div>
            <div className="full-width">
              <label>Bio</label> {/* Label for bio input */}
              <input value={bio} onChange={e => setBio(e.target.value)} disabled={!editMode} /> {/* Bio input */}
            </div>
          </div>
        </div>

        <div className="form-section"> {/* Section for changing password */}
          <h3>🔐 Change Password</h3> {/* Section title */}
          <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} /> {/* Current password input */}
          <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} /> {/* New password input */}
          <button className="save-button" onClick={handleChangePassword}>Change Password</button> {/* Button to change password */}
        </div>

        <div className="form-section danger"> {/* Danger section for account deletion and logout */}
          <button className="delete-button" onClick={handleDeleteAccount}>🗑️ Delete Account</button> {/* Button to delete account */}
          <button className="logout-button" onClick={handleLogout}>Logout</button> {/* Button to logout */}
        </div>
      </div>
    </div>
  );
}
