import { useContext } from 'react'; // Importing useContext hook from React
import {
  FaGamepad,
  FaHeart,
  FaHome,
  FaMusic,
  FaTv,
  FaUser
} from 'react-icons/fa'; // Importing icon components from react-icons
import { Link, useLocation } from 'react-router-dom'; // Importing Link and useLocation from react-router-dom
import { ThemeContext } from '../context/ThemeContext'; // Importing ThemeContext for theme management

export default function Navbar() {
  const location = useLocation();// Getting the current location from the router
  const { toggleTheme, theme } = useContext(ThemeContext);// Accessing theme and toggleTheme function from ThemeContext


 // Paths where the navbar should be hidden
  const hideNavbarPaths = ['/', '/signup', '/OTP'];
  if (hideNavbarPaths.includes(location.pathname)) {
    return null;
  }


// Defining the navigation items with labels, paths, and icons
  const navItems = [
    { label: 'Home', path: '/dashboard', icon: <FaHome /> },
    { label: 'Anime', path: '/anime', icon: <FaTv /> },
    { label: 'Games', path: '/games', icon: <FaGamepad /> },
    { label: 'Music', path: '/music', icon: <FaMusic /> }, //
    { label: 'Favorites', path: '/favorites', icon: <FaHeart /> },
    { label: 'Profile', path: '/profile', icon: <FaUser /> }
  ];

  return (
    <nav style={{
      ...styles.navbar,
      backgroundColor: theme === 'light' ? '#ffffff' : '#111',// Setting background color based on theme
      color: theme === 'light' ? '#111' : '#fff'// Setting text color based on theme
    }}>
      <div style={styles.left}>
        <Link to="/" style={{
          ...styles.logo,
          color: theme === 'light' ? '#111' : '#fff'// Setting logo color based on theme
        }}>
          SenpaiStats
        </Link>
      </div>

      <div style={styles.right}>
        {navItems
          .filter(item => item.path !== location.pathname)// Filtering out the current path from nav items
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
