import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [animeCount, setAnimeCount] = useState(0);
  const [gameCount, setGameCount] = useState(0);
  const [trackCount, setTrackCount] = useState(0);
  const [username, setUsername] = useState('');
  const [recentAnime, setRecentAnime] = useState([]);
  const [recentGames, setRecentGames] = useState([]);
  const [recentMusic, setRecentMusic] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.username);
    }
  }, []);

  useEffect(() => {
    fetchAnimeFavorites();
    fetchGameFavorites();
    fetchMusicFavorites();
    loadRecentAnime();
    loadRecentGames();
    loadRecentMusic();
  }, []);

  const fetchAnimeFavorites = async () => {
    try {
      const res = await axiosInstance.get('/favorites/anime');
      setAnimeCount(res.data.length);
    } catch (err) {
      console.error('Error fetching anime favorites:', err);
    }
  };

  const fetchGameFavorites = async () => {
    try {
      const res = await axiosInstance.get('/favorites/games');
      setGameCount(res.data.length);
    } catch (err) {
      console.error('Error fetching game favorites:', err);
    }
  };

  const fetchMusicFavorites = async () => {
    try {
      const res = await axiosInstance.get('/favorites/music');
      setTrackCount(res.data.length);
    } catch (err) {
      console.error('Error fetching music favorites:', err);
    }
  };

  const loadRecentAnime = async () => {
    try {
      const res = await axiosInstance.get('/recent/anime');
      setRecentAnime(res.data);
    } catch (err) {
      console.error('Error loading recent anime:', err);
    }
  };

  const loadRecentGames = async () => {
    try {
      const res = await axiosInstance.get('/recent/game');
      setRecentGames(res.data);
    } catch (err) {
      console.error('Error loading recent games:', err);
    }
  };

  const loadRecentMusic = async () => {
    try {
      const res = await axiosInstance.get('/recent/music');
      setRecentMusic(res.data);
    } catch (err) {
      console.error('Error loading recent music:', err);
    }
  };

  const confirmClear = async (type) => {
    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
    const { isConfirmed } = await Swal.fire({
      title: `Clear ${typeLabel} History?`,
      text: `Are you sure you want to clear your recent ${type}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, clear it!'
    });

    if (isConfirmed) {
      try {
        await axiosInstance.delete(`/recent/${type}`);
        if (type === 'anime') setRecentAnime([]);
        else if (type === 'game') setRecentGames([]);
        else if (type === 'music') setRecentMusic([]);

        await Swal.fire({
          icon: 'success',
          title: 'Cleared!',
          text: `Your recent ${type} has been cleared.`,
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        console.error(`Error clearing ${type} history:`, err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Failed to clear recent ${type}.`
        });
      }
    }
  };

  const handleVisitAnime = (url) => window.open(url, '_blank');
  const handleVisitGame = (slug) => window.open(`https://rawg.io/games/${slug}`, '_blank');
  const handleVisitTrack = (audioUrl) => window.open(audioUrl, '_blank');

  return (
    <div className="dashboard-container">
      <ToastContainer position="bottom-right" autoClose={2500} />
      <div className="dashboard-content">
        <h1>
          Welcome back, <span className="highlight">{username || '👋'}</span>
        </h1>

        <div className="stats-container">
          <div className="stat-card">
            <h3>Anime Followed</h3>
            <h2>{animeCount}</h2>
          </div>
          <div className="stat-card">
            <h3>Games Followed</h3>
            <h2>{gameCount}</h2>
          </div>
          <div className="stat-card">
            <h3>Tracks Followed</h3>
            <h2>{trackCount}</h2>
          </div>
        </div>

        <h3>Recently Viewed</h3>

        {/* === RECENT ANIME === */}
        <div>
          <h4>
            Anime:{" "}
            {recentAnime.length > 0 && (
              <button className="clear-btn" onClick={() => confirmClear('anime')}>
                🗑️ Clear
              </button>
            )}
          </h4>
          <div className="recently-viewed">
            {recentAnime.length === 0 ? (
              <p>No recent anime.</p>
            ) : (
              recentAnime.map((item) => (
                <div
                  key={item._id}
                  className="recent-card"
                  onClick={() => handleVisitAnime(item.url)}
                >
                  {item.title}
                </div>
              ))
            )}
          </div>
        </div>

        {/* === RECENT GAMES === */}
        <div style={{ marginTop: '2rem' }}>
          <h4>
            Games:{" "}
            {recentGames.length > 0 && (
              <button className="clear-btn" onClick={() => confirmClear('game')}>
                🗑️ Clear
              </button>
            )}
          </h4>
          <div className="recently-viewed">
            {recentGames.length === 0 ? (
              <p>No recent games.</p>
            ) : (
              recentGames.map((item) => (
                <div
                  key={item._id}
                  className="recent-card"
                  onClick={() => handleVisitGame(item.slug)}
                >
                  {item.title}
                </div>
              ))
            )}
          </div>
        </div>

        {/* === RECENT MUSIC === */}
        <div style={{ marginTop: '2rem' }}>
          <h4>
            Music:{" "}
            {recentMusic.length > 0 && (
              <button className="clear-btn" onClick={() => confirmClear('music')}>
                🗑️ Clear
              </button>
            )}
          </h4>
          <div className="recently-viewed">
            {recentMusic.length === 0 ? (
              <p>No recent tracks.</p>
            ) : (
              recentMusic.map((item) => (
                <div
                  key={item._id}
                  className="recent-card"
                  onClick={() => handleVisitTrack(item.audioUrl)}
                >
                  {item.title}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
