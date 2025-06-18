import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import {
  FaHome,
  FaTv,
  FaGamepad,
  FaMusic,
  FaHeart,
  FaUser
} from 'react-icons/fa';

export default function Navbar() {
  const location = useLocation();
  const { toggleTheme, theme } = useContext(ThemeContext);

  const hideNavbarPaths = ['/', '/signup', '/OTP'];
  if (hideNavbarPaths.includes(location.pathname)) {
    return null;
  }

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: <FaHome /> },
    { label: 'Anime', path: '/anime', icon: <FaTv /> },
    { label: 'Games', path: '/games', icon: <FaGamepad /> },
    { label: 'Music', path: '/music', icon: <FaMusic /> }, // ✅ Music tab
    { label: 'Favorites', path: '/favorites', icon: <FaHeart /> },
    { label: 'Profile', path: '/profile', icon: <FaUser /> }
  ];

  return (
    <nav style={{
      ...styles.navbar,
      backgroundColor: theme === 'light' ? '#ffffff' : '#111',
      color: theme === 'light' ? '#111' : '#fff'
    }}>
      <div style={styles.left}>
        <Link to="/" style={{
          ...styles.logo,
          color: theme === 'light' ? '#111' : '#fff'
        }}>
          SenpaiStats
        </Link>
      </div>

      <div style={styles.right}>
        {navItems
          .filter(item => item.path !== location.pathname)
          .map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.link,
                color: theme === 'light' ? '#111' : '#fff'
              }}
            >
              <span style={styles.icon}>{item.icon}</span>
              {item.label}
            </Link>
          ))}

        <label className="switch" title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          <input
            type="checkbox"
            onChange={toggleTheme}
            checked={theme === 'light'}
          />
          <span className="slider"></span>
        </label>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 999,
    transition: 'background-color 0.3s ease'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none'
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  link: {
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.1rem'
  }
};
