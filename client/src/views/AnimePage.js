import axios from 'axios'; // Importing axios for making HTTP requests
import { useEffect, useRef, useState } from 'react'; // Importing necessary hooks from React
import Swal from 'sweetalert2'; // Importing SweetAlert2 for alerts
import '../styles/AnimePage.css'; // Importing CSS styles for the AnimePage component
import axiosInstance from '../utils/axiosInstance'; // Importing custom axios instance for API calls

// AnimePage component definition
export default function AnimePage() {
  // State variables for managing anime list, search term, selected genre/type, loading state, favorite anime IDs, and selected anime
  const [animeList, setAnimeList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);
  const [favoriteAnimeIds, setFavoriteAnimeIds] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const searchTimeout = useRef(null); // Ref to store the timeout for search input

  // Options for genre and type filters
  const genreOptions = ['', 'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Sports'];
  const typeOptions = ['', 'TV', 'Movie', 'OVA', 'Special', 'ONA'];

  // useEffect to fetch top anime and user favorites on component mount
  useEffect(() => {
    fetchTopAnime(); // Fetching top anime
    fetchUserFavorites(); // Fetching user's favorite anime
  }, []);

  // Function to fetch top anime from the API
  const fetchTopAnime = async () => {
    setLoading(true); // Set loading state to true
    try {
      const res = await axios.get('https://api.jikan.moe/v4/top/anime?page=1'); // API call to fetch top anime
      setAnimeList(res.data.data); // Setting the anime list state with the fetched data
    } catch (err) {
      console.error("Error loading top anime:", err); // Logging error if the API call fails
      setAnimeList([]); // Resetting anime list on error
    } finally {
      setLoading(false); // Set loading state to false after fetching
    }
  };

  // Function to fetch user's favorite anime from the server
  const fetchUserFavorites = async () => {
    try {
      const res = await axiosInstance.get('/favorites/anime'); // API call to fetch favorites
      const ids = res.data.map(fav => fav.animeId); // Extracting anime IDs from the response
      setFavoriteAnimeIds(ids); // Setting favorite anime IDs state
    } catch (err) {
      console.error('Error fetching favorites:', err); // Logging error if the API call fails
    }
  };

  // useEffect to handle search functionality with debounce
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current); // Clearing previous timeout

    // If no search term, genre, or type is selected, fetch top anime
    if (!searchTerm && !selectedGenre && !selectedType) {
      fetchTopAnime();
      return;
    }

    // Setting a timeout for the search input to debounce the search
    searchTimeout.current = setTimeout(() => {
      const inlineSearch = async () => {
        setLoading(true); // Set loading state to true
        try {
          // Constructing the search query based on user input
          let query = `https://api.jikan.moe/v4/anime?q=${searchTerm}&limit=25`;
          if (selectedType) query += `&type=${selectedType.toLowerCase()}`; // Adding type to query if selected
          if (selectedGenre) query += `&genres=${mapGenreToId(selectedGenre)}`; // Adding genre to query if selected
          const res = await axios.get(query); // API call to fetch search results
          setAnimeList(res.data.data); // Setting the anime list state with the fetched data
        } catch (err) {
          console.error("Search error:", err); // Logging error if the API call fails
          setAnimeList([]); // Resetting anime list on error
        } finally {
          setLoading(false); // Set loading state to false after fetching
        }
      };
      inlineSearch(); // Calling the inline search function
    }, 600); // 600ms debounce time
  }, [searchTerm, selectedGenre, selectedType]); // Dependencies for the useEffect

  // Function to map genre names to their corresponding IDs
  const mapGenreToId = (genre) => {
    const genreMap = {
      Action: 1, Adventure: 2, Comedy: 4, Drama: 8,
      Fantasy: 10, Horror: 14, Romance: 22, "Sci-Fi": 24, Sports: 30,
    };
    return genreMap[genre] || ''; // Return the genre ID or an empty string if not found
  };

  // Function to add an anime to the user's favorites
  const handleAddToFavorites = async (anime) => {
    try {
      const token = localStorage.getItem('token'); // Getting the token from localStorage
      if (!token) {
        Swal.fire('Login Required', 'Please log in to favorite anime.', 'info'); // Alert if user is not logged in
        return;
      }
      // Payload for the favorite anime
      const payload = {
        animeId: String(anime.mal_id),
        title: anime.title,
        posterImage: anime.images.jpg.image_url,
        rating: anime.score || 'N/A'
      };
      await axiosInstance.post('/favorites/anime', payload); // API call to add to favorites
      Swal.fire({
        title: 'Favorited!',
        text: `${anime.title} has been added to favorites.`,
        icon: 'success',
        timer: 1800,
        showConfirmButton: false
      }); // Success alert
      setFavoriteAnimeIds(prev => [...prev, payload.animeId]); // Updating favorite anime IDs state
    } catch (err) {
      console.error('Error adding favorite:', err); // Logging error if the API call fails
      Swal.fire('Oops!', 'Failed to add to favorites.', 'error'); // Error alert
    }
  };

  // Function to handle visiting the anime's website
  const handleVisitWebsite = async (anime) => {
    try {
      await axiosInstance.post('/recent/anime', {
        animeId: String(anime.mal_id),
        title: anime.title,
        url: anime.url
      }); // API call to log recent visit
      window.open(anime.url, '_blank'); // Opening the anime's website in a new tab
    } catch (err) {
      console.error("Visit website error:", err); // Logging error if the API call fails
      window.open(anime.url, '_blank'); // Opening the anime's website in a new tab even on error
    }
  };

  // Function to check if an anime is already favorited
  const isAlreadyFavorited = (mal_id) => favoriteAnimeIds.includes(String(mal_id));
  const handleCardClick = (anime) => setSelectedAnime(anime); // Function to set the selected anime for modal
  const closeModal = () => setSelectedAnime(null); // Function to close the modal

  return (
    <>
      {selectedAnime && ( // Conditional rendering for the selected anime modal
        <div className="anime-modal">
          <div className="anime-modal-content">
            <button className="close-btn" onClick={closeModal}>✖</button> {/* Close button for modal */}
            <h2>{selectedAnime.title}</h2> {/* Displaying selected anime title */}
            <img src={selectedAnime.images.jpg.image_url} alt={selectedAnime.title} /> {/* Displaying selected anime image */}
            <p><strong>Score:</strong> ⭐ {selectedAnime.score || 'N/A'}</p> {/* Displaying selected anime score */}
            <p><strong>Episodes:</strong> {selectedAnime.episodes || 'Unknown'}</p> {/* Displaying selected anime episodes */}
            <p className="anime-desc">{selectedAnime.synopsis}</p> {/* Displaying selected anime synopsis */}
          </div>
        </div>
      )}

      <div className="anime-container">
        <div className="hero-section">
          {animeList.length > 0 && ( // Conditional rendering for the hero section if anime list is not empty
            <>
              <img src={animeList[0].images.jpg.large_image_url} alt="Backdrop" className="hero-blur-bg" /> {/* Hero background image */}
              <div className="hero-foreground">
                <img src={animeList[0].images.jpg.image_url} alt="Poster" className="hero-poster" /> {/* Hero poster image */}
                <div className="hero-text">
                  <h2>#1 Trending</h2> {/* Trending label */}
                  <h1>{animeList[0].title}</h1> {/* Displaying title of the top anime */}
                  <p>{animeList[0].synopsis?.substring(0, 180)}...</p> {/* Displaying a short synopsis */}
                  <div className="hero-buttons">
                    <button
                      className={`btn favorite-btn ${isAlreadyFavorited(animeList[0].mal_id) ? 'saved' : ''}`} // Favorite button with conditional class
                      onClick={() => handleAddToFavorites(animeList[0])} // Adding to favorites on click
                      disabled={isAlreadyFavorited(animeList[0].mal_id)} // Disabling button if already favorited
                    >
                      {isAlreadyFavorited(animeList[0].mal_id) ? '❤️ Saved' : '💖 Favorite'} {/* Button text based on favorite status */}
                    </button>
                    <button
                      className="btn visit-btn"
                      onClick={() => handleVisitWebsite(animeList[0])} // Visiting website on click
                    >
                      Visit Website
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <h2 style={{ color: 'white', marginBottom: '1rem' }}>Anime Collection</h2> {/* Collection title */}

        <div className="filter-bar"> {/* Filter bar for search and genre/type selection */}
          <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /> {/* Search input */}
          <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}> {/* Genre selection */}
            {genreOptions.map(g => <option key={g} value={g}>{g || 'All Genres'}</option>)}
          </select>
          <select value={selectedType} onChange={e => setSelectedType(e.target.value)}> {/* Type selection */}
            {typeOptions.map(t => <option key={t} value={t}>{t || 'All Types'}</option>)}
          </select>
        </div>

        {loading ? ( // Conditional rendering for loading state
          <p>Loading...</p>
        ) : animeList.length === 0 ? ( // Conditional rendering for no anime found
          <p>No anime found.</p>
        ) : (
          <div className="anime-grid"> {/* Grid layout for displaying anime cards */}
            {animeList.map((anime) => ( // Mapping through the anime list to create cards
              <div key={anime.mal_id} className="anime-card" onClick={() => handleCardClick(anime)}> {/* Anime card with click handler */}
                <img src={anime.images.jpg.image_url} alt={anime.title} className="anime-img" /> {/* Anime image */}
                <div className="anime-overlay">
                  <h3>{anime.title}</h3> {/* Displaying anime title */}
                  <p>⭐ {anime.score || 'N/A'}</p> {/* Displaying anime score */}
                  <div className="button-stack"> {/* Stack for buttons */}
                    <button
                      className={`btn favorite-btn ${isAlreadyFavorited(anime.mal_id) ? 'saved' : ''}`} // Favorite button with conditional class
                      onClick={(e) => { e.stopPropagation(); handleAddToFavorites(anime); }} // Adding to favorites on click
                      disabled={isAlreadyFavorited(anime.mal_id)} // Disabling button if already favorited
                    >
                      {isAlreadyFavorited(anime.mal_id) ? '❤️ Saved' : '💖 Favorite'} {/* Button text based on favorite status */}
                    </button>
                    <button
                      className="btn visit-btn"
                      onClick={(e) => { e.stopPropagation(); handleVisitWebsite(anime); }} // Visiting website on click
                    >
                      Visit Website
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
