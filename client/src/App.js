import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom'; // Importing routing components from react-router-dom

// Importing views for different routes
import Navbar from './components/Navbar';
import AnimePage from './views/AnimePage';
import Dashboard from './views/Dashboard';
import Favorites from './views/Favorites';
import ForgotPassword from './views/ForgotPassword';
import GamesPage from './views/GamesPage';
import Login from './views/Login';
import MusicPage from './views/MusicPage';
import OTP from './views/OTP';
import ProfilePage from './views/ProfilePage';
import ResetPassword from './views/ResetPassword';
import Signup from './views/Signup';

// MainLayout component to conditionally render the Navbar
const MainLayout = ({ children }) => {
  const location = useLocation(); // Getting the current location from the router
  // Determine if the Navbar should be hidden based on the current path
  const hideNavbar = ['/', '/signup', '/otp', '/forgot-password', '/reset-password'].includes(location.pathname);
  
  return (
    <>
      {/* Render Navbar only if the current path is not in hideNavbar */}
      {!hideNavbar && <Navbar />}
      {children} {/* Render child components */}
    </>
  );
};

// Main App component
function App() {
  return (
    <Router> {/* Wrapping the application in Router for routing functionality */}
      <MainLayout> {/* Using MainLayout to manage Navbar visibility */}
        <Routes> {/* Defining application routes */}
          <Route path="/" element={<Login />} /> {/* Route for Login page */}
          <Route path="/signup" element={<Signup />} /> {/* Route for Signup page */}
          <Route path="/otp" element={<OTP />} /> {/* Route for OTP page */}
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Route for Forgot Password page */}
          <Route path="/reset-password" element={<ResetPassword />} /> {/* Route for Reset Password page */}
          <Route path="/dashboard" element={<Dashboard />} /> {/* Route for Dashboard page */}
          <Route path="/anime" element={<AnimePage />} /> {/* Route for Anime page */}
          <Route path="/games" element={<GamesPage />} /> {/* Route for Games page */}
          <Route path="/favorites" element={<Favorites />} /> {/* Route for Favorites page */}
          <Route path="/profile" element={<ProfilePage />} /> {/* Route for Profile page */}
          <Route path="/music" element={<MusicPage />} /> {/* Route for Music page */}
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App; // Exporting the App component as default
