import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Login from './views/Login';
import Signup from './views/Signup';
import OTP from './views/OTP';
import Dashboard from './views/Dashboard';
import AnimePage from './views/AnimePage';
import GamesPage from './views/GamesPage';
import Favorites from './views/Favorites';
import Navbar from './components/Navbar';
import ForgotPassword from './views/ForgotPassword';
import ResetPassword from './views/ResetPassword';
import ProfilePage from './views/ProfilePage';
import MusicPage from './views/MusicPage';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const hideNavbar = ['/', '/signup', '/otp', '/forgot-password', '/reset-password'].includes(location.pathname);
  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/anime" element={<AnimePage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/music" element={<MusicPage />} />
       


        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
