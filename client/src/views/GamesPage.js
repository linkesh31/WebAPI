import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';
import Swal from 'sweetalert2';
import '../styles/GamesPage.css';

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = '4dd12c5f73e64b5b836b71b4a334cd5c';

  useEffect(() => {
    const fetchGenres = async () => {
      const res = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`);
      setGenres(res.data.results);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchPlatforms = async () => {
      const res = await axios.get(`https://api.rawg.io/api/platforms?key=${API_KEY}`);
      setPlatforms(res.data.results);
    };
    fetchPlatforms();
  }, []);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    let url = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=20`;
    if (searchTerm) url += `&search=${searchTerm}`;
    if (selectedGenre) url += `&genres=${selectedGenre}`;
    if (selectedPlatform) url += `&platforms=${selectedPlatform}`;
    if (selectedYear) url += `&dates=${selectedYear}-01-01,${selectedYear}-12-31`;
    const response = await axios.get(url);
    setGames(response.data.results);
    setLoading(false);
  }, [searchTerm, selectedGenre, selectedPlatform, selectedYear]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchGames();
    }, 500);
    return () => clearTimeout(debounce);
  }, [fetchGames]);

  const fetchFavorites = async () => {
    const res = await axiosInstance.get('/favorites/games');
    setFavorites(res.data);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const isFavorited = (gameId) => favorites.some((fav) => fav.gameId === String(gameId));

  const handleFavorite = async (game) => {
    await axiosInstance.post('/favorites/games', {
      gameId: String(game.id),
      title: game.name,
      posterImage: game.background_image,
      rating: game.rating
    });
    fetchFavorites();
    Swal.fire({
      icon: 'success',
      title: 'Saved!',
      text: `${game.name} has been added to your favorites.`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const handleVisitWebsite = async (game) => {
    await axiosInstance.post('/recent/game', {
      gameId: String(game.id),
      title: game.name,
      slug: game.slug
    });
    window.open(`https://rawg.io/games/${game.slug}`, '_blank');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setSelectedPlatform('');
    setSelectedYear('');
  };

  return (
    <div className="games-page">
      <div className="game-hero">
        {games[0] && (
          <>
            <img src={games[0].background_image} alt={games[0].name} />
            <div className="game-hero-content">
              <h2>{games[0].name}</h2>
              <p>Released: {games[0].released}</p>
              <p className="rating">⭐ {games[0].rating}</p>
              <div className="hero-buttons">
                <button className="btn visit" onClick={() => handleVisitWebsite(games[0])}>Visit Game</button>
                {isFavorited(games[0].id) ? (
                  <button className="btn favorite saved" disabled>✓ Saved</button>
                ) : (
                  <button className="btn favorite" onClick={() => handleFavorite(games[0])}>Add to Favorites</button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="filters">
        <input type="text" placeholder="🔍 Search games..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.slug}>{genre.name}</option>
          ))}
        </select>
        <select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)}>
          <option value="">All Platforms</option>
          {platforms.map((platform) => (
            <option key={platform.id} value={platform.id}>{platform.name}</option>
          ))}
        </select>
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="">All Years</option>
          {Array.from({ length: 25 }, (_, i) => 2023 - i).map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <button className="clear-btn" onClick={handleClearFilters}>Clear Filters</button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', fontSize: '18px' }}>Loading...</p>
      ) : (
        <div className="games-grid">
          {games.slice(1).map((game) => (
            <div key={game.id} className="game-card">
              <img src={game.background_image} alt={game.name} />
              <h3>{game.name}</h3>
              <p>Released: {game.released}</p>
              <p className="rating">⭐ {game.rating}</p>
              <div className="card-buttons">
                <button className="visit" onClick={() => handleVisitWebsite(game)}>Visit Website</button>
                {isFavorited(game.id) ? (
                  <button className="saved" disabled>Saved</button>
                ) : (
                  <button className="favorite" onClick={() => handleFavorite(game)}>Add to Favorites</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
