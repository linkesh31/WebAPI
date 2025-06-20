import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../styles/Favorites.css';
import axiosInstance from '../utils/axiosInstance';

export default function Favorites() {
  const [activeTab, setActiveTab] = useState('anime');
  const [animeFavorites, setAnimeFavorites] = useState([]);
  const [gamesFavorites, setGamesFavorites] = useState([]);
  const [musicFavorites, setMusicFavorites] = useState([]);

  useEffect(() => {
    fetchAnimeFavorites();
    fetchGamesFavorites();
    fetchMusicFavorites();
  }, []);

  const fetchAnimeFavorites = async () => {
    try {
      const res = await axiosInstance.get('/favorites/anime');
      setAnimeFavorites(res.data);
    } catch (err) {
      console.error('Error loading anime favorites:', err);
    }
  };

  const fetchGamesFavorites = async () => {
    try {
      const res = await axiosInstance.get('/favorites/games');
      setGamesFavorites(res.data);
    } catch (err) {
      console.error('Error loading games favorites:', err);
    }
  };

  const fetchMusicFavorites = async () => {
    try {
      const res = await axiosInstance.get('/favorites/music');
      setMusicFavorites(res.data);
    } catch (err) {
      console.error('Error loading music favorites:', err);
    }
  };

  const handleRemoveAnime = async (animeId) => {
    const result = await Swal.fire({
      title: 'Remove Anime?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    });
    if (!result.isConfirmed) return;
    try {
      await axiosInstance.delete(`/favorites/anime/${animeId}`);
      setAnimeFavorites(prev => prev.filter(item => item.animeId !== animeId));
    } catch (err) {
      console.error('Error removing anime:', err);
    }
  };

  const handleRemoveGame = async (gameId) => {
    const result = await Swal.fire({
      title: 'Remove Game?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    });
    if (!result.isConfirmed) return;
    try {
      await axiosInstance.delete(`/favorites/games/${gameId}`);
      setGamesFavorites(prev => prev.filter(item => item.gameId !== gameId));
    } catch (err) {
      console.error('Error removing game:', err);
    }
  };

  const handleRemoveTrack = async (trackId) => {
    const result = await Swal.fire({
      title: 'Remove Track?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    });
    if (!result.isConfirmed) return;
    try {
      await axiosInstance.delete(`/favorites/music/${trackId}`);
      setMusicFavorites(prev => prev.filter(item => item.trackId !== trackId));
    } catch (err) {
      console.error('Error removing track:', err);
    }
  };

  const renderAnimeCards = () => (
    <div className="favorites-grid">
      {animeFavorites.map(anime => (
        <div key={anime.animeId} className="fav-card">
          <button className="remove-btn" onClick={() => handleRemoveAnime(anime.animeId)}>✖</button>
          <img src={anime.posterImage} alt={anime.title} />
          <h3>{anime.title}</h3>
          <p>⭐ {anime.rating}</p>
          <a href={`https://myanimelist.net/anime/${anime.animeId}`} className="visit-btn" target="_blank" rel="noreferrer">Visit Website</a>
        </div>
      ))}
    </div>
  );

  const renderGamesCards = () => (
    <div className="favorites-grid">
      {gamesFavorites.map(game => (
        <div key={game.gameId} className="fav-card">
          <button className="remove-btn" onClick={() => handleRemoveGame(game.gameId)}>✖</button>
          <img src={game.posterImage} alt={game.title} />
          <h3>{game.title}</h3>
          <p>⭐ {game.rating}</p>
          <a href={`https://rawg.io/games/${game.title.replaceAll(' ', '-').toLowerCase()}`} className="visit-btn" target="_blank" rel="noreferrer">Visit Website</a>
        </div>
      ))}
    </div>
  );

  const renderMusicCards = () => (
    <div className="favorites-grid">
      {musicFavorites.map(track => (
        <div
          key={track.trackId}
          className="fav-card clickable-music-card"
          onClick={() => {
            const id = track.trackId.toString().replace(/^dz-/, ''); // ✅ Strip 'dz-' if present
            window.open(`https://www.deezer.com/track/${id}`, '_blank');
          }}
        >
          <button
            className="remove-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveTrack(track.trackId);
            }}
          >✖</button>
          <img src={track.coverImage} alt={track.title} />
          <h3>{track.title}</h3>
          <p>{track.artistName || track.animeOrGameTitle}</p>
          <audio controls src={track.audioUrl} onClick={(e) => e.stopPropagation()}></audio>
        </div>
      ))}
    </div>
  );

  return (
    <div className="favorites-container">
      <h2 className="favorites-title">Favorites</h2>
      <div className="tab-buttons">
        <button className={activeTab === 'anime' ? 'active' : ''} onClick={() => setActiveTab('anime')}>Anime</button>
        <button className={activeTab === 'games' ? 'active' : ''} onClick={() => setActiveTab('games')}>Games</button>
        <button className={activeTab === 'music' ? 'active' : ''} onClick={() => setActiveTab('music')}>Music</button>
      </div>
      {activeTab === 'anime' && renderAnimeCards()}
      {activeTab === 'games' && renderGamesCards()}
      {activeTab === 'music' && renderMusicCards()}
    </div>
  );
}
