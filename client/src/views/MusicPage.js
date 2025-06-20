import axios from 'axios'; // Importing axios for making HTTP requests
import { jwtDecode } from 'jwt-decode'; // Importing jwtDecode for decoding JWT tokens
import { useEffect, useState } from 'react'; // Importing necessary hooks from React
import { toast, ToastContainer } from 'react-toastify'; // Importing toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Importing CSS for toast notifications
import '../styles/MusicPage.css'; // Importing CSS styles for the MusicPage component
import axiosInstance from '../utils/axiosInstance'; // Importing custom axios instance for API calls

const cache = new Map(); // Cache to store fetched tracks

// MusicPage component definition
export default function MusicPage() {
  const [tracks, setTracks] = useState([]); // State for storing the list of tracks
  const [filteredTracks, setFilteredTracks] = useState([]); // State for storing filtered tracks
  const [favorites, setFavorites] = useState([]); // State for storing favorite tracks
  const [searchTerm, setSearchTerm] = useState(''); // State for storing the search term
  const [sortOption, setSortOption] = useState('newest'); // State for storing the selected sort option
  const [genre, setGenre] = useState('all'); // State for storing the selected genre
  const [userId, setUserId] = useState(null); // State for storing the user ID
  const [loading, setLoading] = useState(true); // State for loading status

  const token = localStorage.getItem('token'); // Retrieving token from localStorage

  // useEffect to decode the token and load favorites on component mount
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decoding the token to get user information
        setUserId(decoded.userId); // Setting the user ID state
        loadFavorites(); // Loading favorites
      } catch {
        toast.error('Invalid login token!'); // Error toast for invalid token
      }
    }
  }, [token]);

  // useEffect to load tracks based on search term and genre
  useEffect(() => {
    loadTracks(); // Calling loadTracks function
  }, [searchTerm, genre]);

  // useEffect to apply sorting whenever tracks or sort option changes
  useEffect(() => {
    applySort(); // Calling applySort function
  }, [tracks, sortOption]);

  // Function to load tracks from the API
  async function loadTracks() {
    const key = `${searchTerm}_${genre}`; // Creating a cache key based on search term and genre
    setLoading(true); // Set loading state to true

    if (cache.has(key)) { // Check if tracks are already cached
      setTracks(cache.get(key)); // Set tracks from cache
      setLoading(false); // Set loading state to false
      return; // Exit the function
    }

    try {
      const res = await axios.get( // API call to fetch tracks
        `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(searchTerm || genre || 'pop')}`,
        {
          headers: {
            'X-RapidAPI-Key': '7881826be6msh959612f430c1fb9p155689jsn20842b9db9e4', // API key
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com' // API host
          }
        }
      );

      // Mapping the results to a desired format
      const results = res.data.data.map(t => ({
        _id: `dz-${t.id}`, // Unique ID for the track
        trackId: t.id, // Track ID
        title: t.title, // Track title
        artistName: t.artist.name, // Artist name
        audioUrl: t.preview, // Preview audio URL
        coverImage: t.album.cover_medium, // Cover image URL
        date: t.duration, // Duration of the track
        artistUrl: t.artist.link, // Artist link
        albumName: t.album.title, // Album name
        detailsUrl: t.link || `https://www.deezer.com/track/${t.id}` // Link to track details
      }));

      cache.set(key, results); // Caching the results
      setTracks(results); // Setting the tracks state
    } catch (err) {
      console.error('Deezer API error:', err); // Logging error if the API call fails
      setTracks([]); // Resetting tracks on error
    } finally {
      setLoading(false); // Set loading state to false
    }
  }

  // Function to load user's favorite tracks from the server
  async function loadFavorites() {
    try {
      const res = await axiosInstance.get('/favorites/music', { // API call to fetch favorites
        headers: { Authorization: `Bearer ${token}` } // Including authorization header
      });
      setFavorites(res.data.map(i => i.trackId)); // Setting favorites state
    } catch {
      // silent
    }
  }

  // Function to apply sorting to the tracks based on the selected option
  function applySort() {
    let arr = [...tracks]; // Creating a copy of the tracks array
    switch (sortOption) {
      case 'az':
        arr.sort((a, b) => a.title.localeCompare(b.title)); // Sorting A-Z
        break;
      case 'za':
        arr.sort((a, b) => b.title.localeCompare(a.title)); // Sorting Z-A
        break;
      default:
        arr.sort((a, b) => b.date - a.date); // Sorting by newest
    }
    setFilteredTracks(arr); // Setting the filtered tracks state
  }

  // Function to add a track to favorites
  async function addToFavorites(track) {
    if (!userId) {
      toast.error('Login to save favorites!'); // Error toast if user is not logged in
      return; // Exit the function
    }

    try {
      await axiosInstance.post('/favorites/music', { // API call to add track to favorites
        trackId: track._id,
        title: track.title,
        animeOrGameTitle: track.artistName,
        coverImage: track.coverImage,
        audioUrl: track.audioUrl
      }, {
        headers: { Authorization: `Bearer ${token}` } // Including authorization header
      });

      setFavorites(f => [...f, track._id]); // Updating favorites state
      toast.success('Added to favorites!'); // Success toast
    } catch {
      toast.error('Something went wrong'); // Error toast
    }
  }

  // Function to save the recent track
  async function saveRecentTrack(track) {
    if (!userId) return; // Exit if user is not logged in
    try {
      await axiosInstance.post('/recent/music', { // API call to save recent track
        trackId: track.trackId,
        title: track.title,
        audioUrl: track.detailsUrl
      }, {
        headers: { Authorization: `Bearer ${token}` } // Including authorization header
      });
    } catch (err) {
      console.error('Failed to save recent music:', err); // Logging error if the API call fails
    }
  }

  // Function to handle viewing track details
  function handleViewDetails(track) {
    saveRecentTrack(track); // Saving the recent track
    window.open(track.detailsUrl, '_blank'); // Opening the track details in a new tab
  }

  return (
    <div className="music-page"> {/* Main container for the MusicPage */}
      <ToastContainer /> {/* Toast notifications container */}

      <div className="music-header"> {/* Header section for the music page */}
        <h1>🎵 Explore Popular Music</h1> {/* Title */}
        <div className="filter-bar"> {/* Filter bar for searching and filtering tracks */}
          <input
            placeholder="Search for any song..." // Placeholder text for search input
            value={searchTerm} // Controlled input for search term
            onChange={e => setSearchTerm(e.target.value)} // Updating search term state on change
          />
          <select value={genre} onChange={e => setGenre(e.target.value)}> {/* Genre filter */}
            <option value="all">All Genres</option> {/* Default option */}
            <option value="pop">Pop</option> {/* Genre option */}
            <option value="rock">Rock</option> {/* Genre option */}
            <option value="hip-hop">Hip-Hop</option> {/* Genre option */}
            <option value="jazz">Jazz</option> {/* Genre option */}
            <option value="classical">Classical</option> {/* Genre option */}
          </select>
          <select value={sortOption} onChange={e => setSortOption(e.target.value)}> {/* Sort option */}
            <option value="newest">Newest</option> {/* Default option */}
            <option value="az">A → Z</option> {/* Sort option */}
            <option value="za">Z → A</option> {/* Sort option */}
          </select>
        </div>
      </div>

      {loading ? ( // Conditional rendering for loading state
        <div className="no-results"><h3>⏳ Loading tracks...</h3></div>
      ) : filteredTracks.length === 0 ? ( // Conditional rendering for no results
        <div className="no-results">
          <h3>😔 No tracks found.</h3>
          <p>Try different search terms or filters.</p>
        </div>
      ) : (
        <div className="music-grid"> {/* Grid layout for displaying tracks */}
          {filteredTracks.map(track => ( // Mapping through filtered tracks
            <div key={track._id} className="music-card"> {/* Card for each track */}
              <img src={track.coverImage} alt={track.title} /> {/* Displaying cover image */}
              <div className="music-info"> {/* Info section for the track */}
                <h3>{track.title}</h3> {/* Displaying track title */}
                <p>
                  <a href={track.artistUrl} target="_blank" rel="noreferrer">{track.artistName}</a> | {track.albumName} {/* Displaying artist name and album name */}
                </p>
                <audio controls src={track.audioUrl}></audio> {/* Audio player for the track */}
                <div className="button-group"> {/* Button group for actions */}
                  {favorites.includes(track._id) ? ( // Conditional rendering for favorite button
                    <button className="fav-btn liked saved" disabled>✅ Saved</button> // Indicating the track is already favorited
                  ) : (
                    <button className="fav-btn" onClick={() => addToFavorites(track)}>🤍 Favorite</button> // Button to add to favorites
                  )}
                  <button
                    className="visit-btn"
                    onClick={() => handleViewDetails(track)} // Button to view track details
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
