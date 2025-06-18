import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import '../styles/MusicPage.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cache = new Map();

export default function MusicPage() {
  const [tracks, setTracks] = useState([]);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [genre, setGenre] = useState('all');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId);
        loadFavorites();
      } catch {
        toast.error('Invalid login token!');
      }
    }
  }, [token]);

  useEffect(() => {
    loadTracks();
  }, [searchTerm, genre]);

  useEffect(() => {
    applySort();
  }, [tracks, sortOption]);

  async function loadTracks() {
    const key = `${searchTerm}_${genre}`;
    setLoading(true);

    if (cache.has(key)) {
      setTracks(cache.get(key));
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(searchTerm || genre || 'pop')}`,
        {
          headers: {
            'X-RapidAPI-Key': '7881826be6msh959612f430c1fb9p155689jsn20842b9db9e4',
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
          }
        }
      );

      const results = res.data.data.map(t => ({
        _id: `dz-${t.id}`,
        trackId: t.id,
        title: t.title,
        artistName: t.artist.name,
        audioUrl: t.preview,
        coverImage: t.album.cover_medium,
        date: t.duration,
        artistUrl: t.artist.link,
        albumName: t.album.title,
        detailsUrl: t.link || `https://www.deezer.com/track/${t.id}`
      }));

      cache.set(key, results);
      setTracks(results);
    } catch (err) {
      console.error('Deezer API error:', err);
      setTracks([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadFavorites() {
    try {
      const res = await axiosInstance.get('/favorites/music', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(res.data.map(i => i.trackId));
    } catch {
      // silent
    }
  }

  function applySort() {
    let arr = [...tracks];
    switch (sortOption) {
      case 'az':
        arr.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'za':
        arr.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        arr.sort((a, b) => b.date - a.date);
    }
    setFilteredTracks(arr);
  }

  async function addToFavorites(track) {
    if (!userId) {
      toast.error('Login to save favorites!');
      return;
    }

    try {
      await axiosInstance.post('/favorites/music', {
        trackId: track._id,
        title: track.title,
        animeOrGameTitle: track.artistName,
        coverImage: track.coverImage,
        audioUrl: track.audioUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFavorites(f => [...f, track._id]);
      toast.success('Added to favorites!');
    } catch {
      toast.error('Something went wrong');
    }
  }

  async function saveRecentTrack(track) {
    if (!userId) return;
    try {
      await axiosInstance.post('/recent/music', {
        trackId: track.trackId,
        title: track.title,
        audioUrl: track.detailsUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Failed to save recent music:', err);
    }
  }

  function handleViewDetails(track) {
    saveRecentTrack(track);
    window.open(track.detailsUrl, '_blank');
  }

  return (
    <div className="music-page">
      <ToastContainer />

      <div className="music-header">
        <h1>🎵 Explore Popular Music</h1>
        <div className="filter-bar">
          <input
            placeholder="Search for any song..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select value={genre} onChange={e => setGenre(e.target.value)}>
            <option value="all">All Genres</option>
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
            <option value="hip-hop">Hip-Hop</option>
            <option value="jazz">Jazz</option>
            <option value="classical">Classical</option>
          </select>
          <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="no-results"><h3>⏳ Loading tracks...</h3></div>
      ) : filteredTracks.length === 0 ? (
        <div className="no-results">
          <h3>😔 No tracks found.</h3>
          <p>Try different search terms or filters.</p>
        </div>
      ) : (
        <div className="music-grid">
          {filteredTracks.map(track => (
            <div key={track._id} className="music-card">
              <img src={track.coverImage} alt={track.title} />
              <div className="music-info">
                <h3>{track.title}</h3>
                <p>
                  <a href={track.artistUrl} target="_blank" rel="noreferrer">{track.artistName}</a> | {track.albumName}
                </p>
                <audio controls src={track.audioUrl}></audio>
                <div className="button-group">
                  {favorites.includes(track._id) ? (
                    <button className="fav-btn liked saved" disabled>✅ Saved</button>
                  ) : (
                    <button className="fav-btn" onClick={() => addToFavorites(track)}>🤍 Favorite</button>
                  )}
                  <button
                    className="visit-btn"
                    onClick={() => handleViewDetails(track)}
                  >
                    🔗 View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
