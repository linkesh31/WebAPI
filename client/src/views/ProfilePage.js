// src/views/ProfilePage.js
import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfilePage.css';
import bgImage from '../assets/profilee.jpg';
import { ThemeContext } from '../context/ThemeContext';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

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

  useEffect(() => {
    loadProfile();
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
  }, [theme]);

  const loadProfile = async () => {
    try {
      const res = await axiosInstance.get('/profile');
      const user = res.data?.user || {};
      setProfile(user);
      setUsername(user.username || '');
      setBio(user.bio || '');
      setEmail(user.email || '');
      setAnimeCount(res.data.favorites?.anime || 0);
      setGameCount(res.data.favorites?.games || 0);
      setMusicCount(res.data.favorites?.music || 0);
    } catch {
      Swal.fire('Error', 'Failed to load profile', 'error');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await axiosInstance.put('/profile/update', { username, bio, email });
      Swal.fire('Success', 'Profile updated', 'success');
      setEditMode(false);
      loadProfile();
    } catch {
      Swal.fire('Error', 'Update failed', 'error');
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword.trim() || !newPassword.trim()) {
      Swal.fire('Error', 'Please enter both current and new password.', 'error');
      return;
    }
    try {
      await axiosInstance.put('/profile/change-password', { currentPassword, newPassword });
      Swal.fire('Success', 'Password changed', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Password change failed', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete('/profile/delete');
        Swal.fire('Deleted!', 'Your account has been deleted.', 'success');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
      } catch {
        Swal.fire('Error', 'Delete failed', 'error');
      }
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Logout'
    });

    if (result.isConfirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  return (
    <div className="profile-wrapper">
      <div
        className="cover-section"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="cover-overlay" />
      </div>

      <div className="profile-card">
        <div className="profile-header">
          <div className="initials-avatar">
            {username ? username[0].toUpperCase() : '?'}
          </div>
          <div className="info">
            <h2 className="username">{username || 'N/A'}</h2>
            <p className="followers">
              🎌 {animeCount} Anime · 🎮 {gameCount} Games · 🎵 {musicCount} Music
            </p>
            <p className="meta">📧 {email || 'N/A'}</p>
            <p className="meta">📅 Joined: {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div>
            {editMode ? (
              <button className="save-button" onClick={handleUpdateProfile}>💾 Save</button>
            ) : (
              <button className="edit-button" onClick={() => setEditMode(true)}>✏️ Edit</button>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>📝 Personal Info</h3>
          <div className="form-grid">
            <div>
              <label>Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)} disabled={!editMode} />
            </div>
            <div>
              <label>Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} disabled={!editMode} />
            </div>
            <div className="full-width">
              <label>Bio</label>
              <input value={bio} onChange={e => setBio(e.target.value)} disabled={!editMode} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>🔐 Change Password</h3>
          <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
          <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          <button className="save-button" onClick={handleChangePassword}>Change Password</button>
        </div>

        <div className="form-section danger">
          <button className="delete-button" onClick={handleDeleteAccount}>🗑️ Delete Account</button>
          <button className="logout-button" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </div>
    </div>
  );
}
