const mongoose = require('mongoose');

const FavoriteAnimeSchema = new mongoose.Schema({
  userId: String,
  animeId: String,
  title: String,
  posterImage: String,
  rating: String
});

module.exports = mongoose.model('FavoriteAnime', FavoriteAnimeSchema);
