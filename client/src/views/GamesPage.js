import axios from 'axios'; // Importing axios for making HTTP requests
import { useCallback, useEffect, useState } from 'react'; // Importing necessary hooks from React
import Swal from 'sweetalert2'; // Importing SweetAlert2 for alerts
import '../styles/GamesPage.css'; // Importing CSS styles for the GamesPage component
import axiosInstance from '../utils/axiosInstance'; // Importing custom axios instance for API calls

// GamesPage component definition
export default function GamesPage() {
  const [games, setGames] = useState([]); // State for storing the list of games
  const [favorites, setFavorites] = useState([]); // State for storing favorite games
  const [genres, setGenres] = useState([]); // State for storing game genres
  const [platforms, setPlatforms] = useState([]); // State for storing game platforms
  const [searchTerm, setSearchTerm] = useState(''); // State for storing the search term
  const [selectedGenre, setSelectedGenre] = useState(''); // State for storing the selected genre
  const [selectedPlatform, setSelectedPlatform] = useState(''); // State for storing the selected platform
  const [selectedYear, setSelectedYear] = useState(''); // State for storing the selected year
  const [loading, setLoading] = useState(false); // State for loading status

  const API_KEY = '4dd12c5f73e64b5b836b71b4a334cd5c'; // API key for accessing the RAWG API

  // useEffect to fetch game genres on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      const res = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`); // API call to fetch genres
      setGenres(res.data.results); // Setting the genres state
    };
    fetchGenres(); // Calling the fetchGenres function
  }, []);

  // useEffect to fetch game platforms on component mount
  useEffect(() => {
    const fetchPlatforms = async () => {
      const res = await axios.get(`https://api.rawg.io/api/platforms?key=${API_KEY}`); // API call to fetch platforms
      setPlatforms(res.data.results); // Setting the platforms state
    };
    fetchPlatforms(); // Calling the fetchPlatforms function
  }, []);

  // Function to fetch games based on filters and search term
  const fetchGames = useCallback(async () => {
    setLoading(true); // Set loading state to true
    let url = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=20`; // Base URL for fetching games
    if (searchTerm) url += `&search=${searchTerm}`; // Adding search term to URL if provided
    if (selectedGenre) url += `&genres=${selectedGenre}`; // Adding selected genre to URL if provided
    if (selectedPlatform) url += `&platforms=${selectedPlatform}`; // Adding selected platform to URL if provided
    if (selectedYear) url += `&dates=${selectedYear}-01-01,${selectedYear}-12-31`; // Adding selected year to URL if provided
    const response = await axios.get(url); // API call to fetch games
    setGames(response.data.results); // Setting the games state with the fetched data
    setLoading(false); // Set loading state to false
  }, [searchTerm, selectedGenre, selectedPlatform, selectedYear]); // Dependencies for the useCallback

  // useEffect to debounce the fetchGames function
  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchGames(); // Calling fetchGames after a delay
    }, 500); // 500ms debounce time
    return () => clearTimeout(debounce); // Cleanup function to clear the timeout
  }, [fetchGames]); // Dependencies for the useEffect

  // Function to fetch user's favorite games from the server
  const fetchFavorites = async () => {
    const res = await axiosInstance.get('/favorites/games'); // API call to fetch favorite games
    setFavorites(res.data); // Setting the favorites state
  };

  // useEffect to fetch favorites on component mount
  useEffect(() => {
    fetchFavorites(); // Calling fetchFavorites function
  }, []);

  // Function to check if a game is already favorited
  const isFavorited = (gameId) => favorites.some((fav) => fav.gameId === String(gameId));

  // Function to handle adding a game to favorites
  const handleFavorite = async (game) => {
    await axiosInstance.post('/favorites/games', { // API call to add game to favorites
      gameId: String(game.id),
      title: game.name,
      posterImage: game.background_image,
      rating: game.rating
    });
    fetchFavorites(); // Refreshing favorites after adding
    Swal.fire({ // Success alert for adding to favorites
      icon: 'success',
      title: 'Saved!',
      text: `${game.name} has been added to your favorites.`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
    });
  };

  // Function to handle visiting the game's website
  const handleVisitWebsite = async (game) => {
    await axiosInstance.post('/recent/game', { // API call to log recent game visit
      gameId: String(game.id),
      title: game.name,
      slug: game.slug
    });
    window.open(`https://rawg.io/games/${game.slug}`, '_blank'); // Opening the game's website in a new tab
  };

  // Function to clear all filters
  const handleClearFilters = () => {
    setSearchTerm(''); // Resetting search term
    setSelectedGenre(''); // Resetting selected genre
    setSelectedPlatform(''); // Resetting selected platform
    setSelectedYear(''); // Resetting selected year
  };

  return (
    <div className="games-page"> {/* Main container for the GamesPage */}
      <div className="game-hero"> {/* Hero section for the featured game */}
        {games[0] && ( // Conditional rendering for the first game in the list
          <>
            <img src={games[0].background_image} alt={games[0].name} /> {/* Displaying background image of the game */}
            <div className="game-hero-content"> {/* Content overlay for the hero section */}
              <h2>{games[0].name}</h2> {/* Displaying the name of the game */}
              <p>Released: {games[0].released}</p> {/* Displaying the release date */}
              <p className="rating">⭐ {games[0].rating}</p> {/* Displaying the rating */}
              <div className="hero-buttons"> {/* Buttons for actions on the featured game */}
                <button className="btn visit" onClick={() => handleVisitWebsite(games[0])}>Visit Game</button> {/* Button to visit game website */}
                {isFavorited(games[0].id) ? ( // Conditional rendering for favorite button
                  <button className="btn favorite saved" disabled>✓ Saved</button> // Indicating the game is already favorited
                ) : (
                  <button className="btn favorite" onClick={() => handleFavorite(games[0])}>Add to Favorites</button> // Button to add to favorites
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="filters"> {/* Filter section for searching and filtering games */}
        <input type="text" placeholder="🔍 Search games..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /> {/* Search input */}
        <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}> {/* Genre filter */}
          <option value="">All Genres</option> {/* Default option */}
          {genres.map((genre) => ( // Mapping through genres to create options
            <option key={genre.id} value={genre.slug}>{genre.name}</option>
          ))}
        </select>
        <select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)}> {/* Platform filter */}
          <option value="">All Platforms</option> {/* Default option */}
          {platforms.map((platform) => ( // Mapping through platforms to create options
            <option key={platform.id} value={platform.id}>{platform.name}</option>
          ))}
        </select>
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}> {/* Year filter */}
          <option value="">All Years</option> {/* Default option */}
          {Array.from({ length: 25 }, (_, i) => 2023 - i).map((year) => ( // Generating a list of years
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <button className="clear-btn" onClick={handleClearFilters}>Clear Filters</button> {/* Button to clear filters */}
      </div>

      {loading ? ( // Conditional rendering for loading state
        <p style={{ textAlign: 'center', fontSize: '18px' }}>Loading...</p>
      ) : (
        <div className="games-grid"> {/* Grid layout for displaying games */}
          {games.slice(1).map((game) => ( // Mapping through games, skipping the first one (featured)
            <div key={game.id} className="game-card"> {/* Card for each game */}
              <img src={game.background_image} alt={game.name} /> {/* Displaying game image */}
              <h3>{game.name}</h3> {/* Displaying game name */}
              <p>Released: {game.released}</p> {/* Displaying release date */}
              <p className="rating">⭐ {game.rating}</p> {/* Displaying rating */}
              <div className="card-buttons"> {/* Buttons for actions on the game card */}
                <button className="visit" onClick={() => handleVisitWebsite(game)}>Visit Website</button> {/* Button to visit game website */}
                {isFavorited(game.id) ? ( // Conditional rendering for favorite button
                  <button className="saved" disabled>Saved</button> // Indicating the game is already favorited
                ) : (
                  <button className="favorite" onClick={() => handleFavorite(game)}>Add to Favorites</button> // Button to add to favorites
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
