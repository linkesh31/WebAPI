import { jwtDecode } from 'jwt-decode'; // Importing jwtDecode for decoding JWT tokens
import { useEffect, useState } from 'react'; // Importing necessary hooks from React
import { ToastContainer } from 'react-toastify'; // Importing ToastContainer for notifications
import 'react-toastify/dist/ReactToastify.css'; // Importing CSS for toast notifications
import Swal from 'sweetalert2'; // Importing SweetAlert2 for alerts
import '../styles/Dashboard.css'; // Importing CSS styles for the Dashboard component
import axiosInstance from '../utils/axiosInstance'; // Importing custom axios instance for API calls

// Dashboard component definition
export default function Dashboard() {
  // State variables for managing counts and recent items
  const [animeCount, setAnimeCount] = useState(0); // Count of followed anime
  const [gameCount, setGameCount] = useState(0); // Count of followed games
  const [trackCount, setTrackCount] = useState(0); // Count of followed music tracks
  const [username, setUsername] = useState(''); // Username of the logged-in user
  const [recentAnime, setRecentAnime] = useState([]); // List of recently viewed anime
  const [recentGames, setRecentGames] = useState([]); // List of recently viewed games
  const [recentMusic, setRecentMusic] = useState([]); // List of recently viewed music tracks

  // useEffect to fetch user data and recent favorites on component mount
  useEffect(() => {
    const token = localStorage.getItem('token'); // Getting the token from localStorage
    if (token) {
      const decoded = jwtDecode(token); // Decoding the token to get user information
      setUsername(decoded.username); // Setting the username state
    }

    // Fetching favorites and recent items
    fetchAnimeFavorites();
    fetchGameFavorites();
    fetchMusicFavorites();
    loadRecentAnime();
    loadRecentGames();
    loadRecentMusic();
  }, []);

  // Function to fetch user's favorite anime from the server
  const fetchAnimeFavorites = async () => {
    try {
      const res = await axiosInstance.get('/favorites/anime'); // API call to fetch anime favorites
      setAnimeCount(res.data.length); // Setting the anime count state
    } catch (err) {
      console.error('Error fetching anime favorites:', err); // Logging error if the API call fails
    }
  };

  // Function to fetch user's favorite games from the server
  const fetchGameFavorites = async () => {
    try {
      const res = await axiosInstance.get('/favorites/games'); // API call to fetch game favorites
      setGameCount(res.data.length); // Setting the game count state
    } catch (err) {
      console.error('Error fetching game favorites:', err); // Logging error if the API call fails
    }
  };

  // Function to fetch user's favorite music tracks from the server
  const fetchMusicFavorites = async () => {
    try {
      const res = await axiosInstance.get('/favorites/music'); // API call to fetch music favorites
      setTrackCount(res.data.length); // Setting the track count state
    } catch (err) {
      console.error('Error fetching music favorites:', err); // Logging error if the API call fails
    }
  };

  // Function to load recently viewed anime from the server
  const loadRecentAnime = async () => {
    try {
      const res = await axiosInstance.get('/recent/anime'); // API call to fetch recent anime
      setRecentAnime(res.data); // Setting the recent anime state
    } catch (err) {
      console.error('Error loading recent anime:', err); // Logging error if the API call fails
    }
  };

  // Function to load recently viewed games from the server
  const loadRecentGames = async () => {
    try {
      const res = await axiosInstance.get('/recent/game'); // API call to fetch recent games
      setRecentGames(res.data); // Setting the recent games state
    } catch (err) {
      console.error('Error loading recent games:', err); // Logging error if the API call fails
    }
  };

  // Function to load recently viewed music tracks from the server
  const loadRecentMusic = async () => {
    try {
      const res = await axiosInstance.get('/recent/music'); // API call to fetch recent music
      setRecentMusic(res.data); // Setting the recent music state
    } catch (err) {
      console.error('Error loading recent music:', err); // Logging error if the API call fails
    }
  };

  // Function to confirm clearing recent items with a SweetAlert2 dialog
  const confirmClear = async (type) => {
    const { isConfirmed } = await Swal.fire({
      title: `Clear ${type}?`, // Alert title
      text: `Are you sure you want to clear your recent ${type}?`, // Alert text
      icon: 'warning', // Alert icon
      showCancelButton: true, // Show cancel button
      confirmButtonColor: '#e74c3c', // Confirm button color
      cancelButtonColor: '#3085d6', // Cancel button color
      confirmButtonText: 'Yes, clear it!' // Confirm button text
    });

    if (isConfirmed) {
      await axiosInstance.delete(`/recent/${type}`); // API call to clear recent items
      // Clearing the respective recent items from state
      if (type === 'anime') setRecentAnime([]);
      if (type === 'game') setRecentGames([]);
      if (type === 'music') setRecentMusic([]);
    }
  };

  // Function to handle visiting a URL
  const handleVisit = (url) => window.open(url, '_blank'); // Opening the URL in a new tab

  return (
    <div className="dashboard-wrapper"> {/* Main wrapper for the dashboard */}
      <ToastContainer position="bottom-right" autoClose={2000} /> {/* Toast notifications container */}
      <h1 className="welcome-text"> {/* Welcome text */}
        Welcome back, <span className="highlight">{username || '👋'}</span> {/* Displaying username or emoji */}
      </h1>

      <div className="main-container"> {/* Main container for dashboard content */}
        {/* ANIME */}
        <div className="dashboard-box"> {/* Box for anime statistics */}
          <div className="stat-card anime-bg"> {/* Card for anime count */}
            <h3>Anime Followed</h3> {/* Title for anime count */}
            <h2>{animeCount}</h2> {/* Displaying anime count */}
          </div>
          <div className="recent-header"> {/* Header for recent anime section */}
            <h3>Anime</h3> {/* Title for recent anime */}
            {recentAnime.length > 0 && ( // Conditional rendering for clear button
              <button className="icon-btn" onClick={() => confirmClear('anime')}>🗑️</button>
            )}
          </div>
          <p className="recent-title">Recently Viewed</p> {/* Title for recently viewed items */}
          <div className="recent-list"> {/* List for recently viewed anime */}
            {recentAnime.length ? recentAnime.map(item => ( // Mapping through recent anime
              <div key={item._id} className="recent-chip" onClick={() => handleVisit(item.url)}> {/* Chip for each recent anime */}
                {item.title} {/* Displaying anime title */}
              </div>
            )) : <p className="empty">✨ Nothing here yet</p>} {/* Message if no recent anime */}
          </div>
        </div>

        {/* GAMES */}
        <div className="dashboard-box"> {/* Box for game statistics */}
          <div className="stat-card games-bg"> {/* Card for game count */}
            <h3>Games Followed</h3> {/* Title for game count */}
            <h2>{gameCount}</h2> {/* Displaying game count */}
          </div>
          <div className="recent-header"> {/* Header for recent games section */}
            <h3>Games</h3> {/* Title for recent games */}
            {recentGames.length > 0 && ( // Conditional rendering for clear button
              <button className="icon-btn" onClick={() => confirmClear('game')}>🗑️</button>
            )}
          </div>
          <p className="recent-title">Recently Viewed</p> {/* Title for recently viewed items */}
          <div className="recent-list"> {/* List for recently viewed games */}
            {recentGames.length ? recentGames.map(item => ( // Mapping through recent games
              <div key={item._id} className="recent-chip" onClick={() => handleVisit(`https://rawg.io/games/${item.slug}`)}> {/* Chip for each recent game */}
                {item.title} {/* Displaying game title */}
              </div>
            )) : <p className="empty">✨ Nothing here yet</p>} {/* Message if no recent games */}
          </div>
        </div>

        {/* MUSIC */}
        <div className="dashboard-box"> {/* Box for music statistics */}
          <div className="stat-card music-bg"> {/* Card for track count */}
            <h3>Tracks Followed</h3> {/* Title for track count */}
            <h2>{trackCount}</h2> {/* Displaying track count */}
          </div>
          <div className="recent-header"> {/* Header for recent music section */}
            <h3>Music</h3> {/* Title for recent music */}
            {recentMusic.length > 0 && ( // Conditional rendering for clear button
              <button className="icon-btn" onClick={() => confirmClear('music')}>🗑️</button>
            )}
          </div>
          <p className="recent-title">Recently Viewed</p> {/* Title for recently viewed items */}
          <div className="recent-list"> {/* List for recently viewed music */}
            {recentMusic.length ? recentMusic.map(item => ( // Mapping through recent music
              <div key={item._id} className="recent-chip" onClick={() => handleVisit(item.audioUrl)}> {/* Chip for each recent music track */}
                {item.title} {/* Displaying music title */}
              </div>
            )) : <p className="empty">✨ Nothing here yet</p>} {/* Message if no recent music */}
          </div>
        </div>
      </div>
    </div>
  );
}
