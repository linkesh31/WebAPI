import { useEffect, useState } from 'react'; // Importing necessary hooks from React
import Swal from 'sweetalert2'; // Importing SweetAlert2 for alerts
import '../styles/Favorites.css'; // Importing CSS styles for the Favorites component
import axiosInstance from '../utils/axiosInstance'; // Importing custom axios instance for API calls

// Favorites component definition
export default function Favorites() {
  const [activeTab, setActiveTab] = useState('anime'); // State for managing the active tab (anime, games, music)
  const [animeFavorites, setAnimeFavorites] = useState([]); // State for storing favorite anime
  const [gamesFavorites, setGamesFavorites] = useState([]); // State for storing favorite games
  const [musicFavorites, setMusicFavorites] = useState([]); // State for storing favorite music tracks

  // useEffect to fetch favorites on component mount
  useEffect(() => {
    fetchAnimeFavorites(); // Fetching favorite anime
    fetchGamesFavorites(); // Fetching favorite games
    fetchMusicFavorites(); // Fetching favorite music
  }, []);

  // Function to fetch user's favorite anime from the server
  const fetchAnimeFavorites = async () => {
    try {
      const res = await axiosInstance.get('/favorites/anime'); // API call to fetch anime favorites
      setAnimeFavorites(res.data); // Setting the anime favorites state
    } catch (err) {
      console.error('Error loading anime favorites:', err); // Logging error if the API call fails
    }
  };

  // Function to fetch user's favorite games from the server
  const fetchGamesFavorites = async () => {
    try {
      const res = await axiosInstance.get('/favorites/games'); // API call to fetch game favorites
      setGamesFavorites(res.data); // Setting the games favorites state
    } catch (err) {
      console.error('Error loading games favorites:', err); // Logging error if the API call fails
    }
  };

  // Function to fetch user's favorite music tracks from the server
  const fetchMusicFavorites = async () => {
    try {
      const res = await axiosInstance.get('/favorites/music'); // API call to fetch music favorites
      setMusicFavorites(res.data); // Setting the music favorites state
    } catch (err) {
      console.error('Error loading music favorites:', err); // Logging error if the API call fails
    }
  };

  // Function to handle removing an anime from favorites
  const handleRemoveAnime = async (animeId) => {
    const result = await Swal.fire({ // Showing confirmation dialog
      title: 'Remove Anime?',
      text: 'Are you sure you want to remove this anime from favorites?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel',
    });
    if (!result.isConfirmed) return; // If not confirmed, exit the function

    try {
      await axiosInstance.delete(`/favorites/anime/${animeId}`); // API call to remove anime from favorites
      setAnimeFavorites(prev => prev.filter(item => item.animeId !== animeId)); // Updating state to remove the anime
      Swal.fire('Removed!', 'Anime removed from favorites.', 'success'); // Success alert
    } catch (err) {
      console.error("Error removing anime:", err); // Logging error if the API call fails
      Swal.fire('Oops!', 'Failed to remove anime.', 'error'); // Error alert
    }
  };

  // Function to handle removing a game from favorites
  const handleRemoveGame = async (gameId) => {
    const result = await Swal.fire({ // Showing confirmation dialog
      title: 'Remove Game?',
      text: 'Are you sure you want to remove this game from favorites?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel',
    });
    if (!result.isConfirmed) return; // If not confirmed, exit the function

    try {
      await axiosInstance.delete(`/favorites/games/${gameId}`); // API call to remove game from favorites
      setGamesFavorites(prev => prev.filter(item => item.gameId !== gameId)); // Updating state to remove the game
      Swal.fire('Removed!', 'Game removed from favorites.', 'success'); // Success alert
    } catch (err) {
      console.error("Error removing game:", err); // Logging error if the API call fails
      Swal.fire('Oops!', 'Failed to remove game.', 'error'); // Error alert
    }
  };

  // Function to handle removing a track from favorites
  const handleRemoveTrack = async (trackId) => {
    const result = await Swal.fire({ // Showing confirmation dialog
      title: 'Remove Track?',
      text: 'Are you sure you want to remove this track from favorites?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel',
    });
    if (!result.isConfirmed) return; // If not confirmed, exit the function

    try {
      await axiosInstance.delete(`/favorites/music/${trackId}`); // API call to remove track from favorites
      setMusicFavorites(prev => prev.filter(item => item.trackId !== trackId)); // Updating state to remove the track
      Swal.fire('Removed!', 'Music removed from favorites.', 'success'); // Success alert
    } catch (err) {
      console.error("Error removing track:", err); // Logging error if the API call fails
      Swal.fire('Oops!', 'Failed to remove track.', 'error'); // Error alert
    }
  };

  // Function to render anime favorite cards
  const renderAnimeCards = () => {
    if (animeFavorites.length === 0) return <p>No favorite anime found.</p>; // Message if no favorites

    return (
      <div className="favorites-grid"> {/* Grid layout for anime favorites */}
        {animeFavorites.map(anime => ( // Mapping through anime favorites
          <div key={anime.animeId} className="fav-card"> {/* Card for each anime */}
            <button className="remove-btn" onClick={() => handleRemoveAnime(anime.animeId)}>✖</button> {/* Remove button */}
            <img src={anime.posterImage} alt={anime.title} /> {/* Anime poster image */}
            <h3>{anime.title}</h3> {/* Anime title */}
            <p>⭐ {anime.rating}</p> {/* Anime rating */}
            <a href={`https://myanimelist.net/anime/${anime.animeId}`} target="_blank" rel="noreferrer" className="visit-btn">Visit Website</a> {/* Link to anime website */}
          </div>
        ))}
      </div>
    );
  };

  // Function to render game favorite cards
  const renderGamesCards = () => {
    if (gamesFavorites.length === 0) return <p>No favorite games found.</p>; // Message if no favorites

    return (
      <div className="favorites-grid"> {/* Grid layout for game favorites */}
        {gamesFavorites.map(game => ( // Mapping through game favorites
          <div key={game.gameId} className="fav-card"> {/* Card for each game */}
            <button className="remove-btn" onClick={() => handleRemoveGame(game.gameId)}>✖</button> {/* Remove button */}
            <img src={game.posterImage} alt={game.title} /> {/* Game poster image */}
            <h3>{game.title}</h3> {/* Game title */}
            <p>⭐ {game.rating}</p> {/* Game rating */}
            <a href={`https://rawg.io/games/${game.title.replaceAll(' ', '-').toLowerCase()}`} target="_blank" rel="noreferrer" className="visit-btn">Visit Website</a> {/* Link to game website */}
          </div>
        ))}
      </div>
    );
  };

  // Function to render music favorite cards
  const renderMusicCards = () => {
    if (musicFavorites.length === 0) return <p>No favorite tracks found.</p>; // Message if no favorites

    return (
      <div className="favorites-grid"> {/* Grid layout for music favorites */}
        {musicFavorites.map(track => ( // Mapping through music favorites
          <div key={track.trackId} className="fav-card"> {/* Card for each track */}
            <button className="remove-btn" onClick={() => handleRemoveTrack(track.trackId)}>✖</button> {/* Remove button */}
            <img src={track.coverImage} alt={track.title} /> {/* Track cover image */}
            <h3>{track.title}</h3> {/* Track title */}
            <p>{track.artistName || track.animeOrGameTitle}</p> {/* Displaying artist name or related title */}
            <audio controls src={track.audioUrl}></audio> {/* Audio player for the track */}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="favorites-container"> {/* Main container for favorites */}
      <h2 className="favorites-title">Favorites</h2> {/* Title for favorites section */}

      <div className="tab-buttons"> {/* Tab buttons for switching between favorites */}
        <button className={activeTab === 'anime' ? 'active' : ''} onClick={() => setActiveTab('anime')}>Anime</button> {/* Anime tab */}
        <button className={activeTab === 'games' ? 'active' : ''} onClick={() => setActiveTab('games')}>Games</button> {/* Games tab */}
        <button className={activeTab === 'music' ? 'active' : ''} onClick={() => setActiveTab('music')}>Music</button> {/* Music tab */}
      </div>

      {activeTab === 'anime' && renderAnimeCards()} {/* Rendering anime cards if anime tab is active */}
      {activeTab === 'games' && renderGamesCards()} {/* Rendering game cards if games tab is active */}
      {activeTab === 'music' && renderMusicCards()} {/* Rendering music cards if music tab is active */}
    </div>
  );
}
