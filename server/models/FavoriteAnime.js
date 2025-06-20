const mongoose = require('mongoose'); // Importing mongoose library

// Defining the schema for favorite anime
const FavoriteAnimeSchema = new mongoose.Schema({
  userId: String, // ID of the user who favorited the anime
  animeId: String, // ID of the anime
  title: String, // Title of the anime
  posterImage: String, // URL of the anime's poster image
  rating: String // User's rating for the anime
});

// Exporting the model based on the FavoriteAnime schema
module.exports = mongoose.model('FavoriteAnime', FavoriteAnimeSchema);
