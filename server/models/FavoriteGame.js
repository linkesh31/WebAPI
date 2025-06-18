const mongoose = require('mongoose');

const favoriteGameSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gameId: { type: String, required: true },
  title: { type: String, required: true },
  posterImage: { type: String },
  rating: { type: Number },
});

module.exports = mongoose.model('FavoriteGame', favoriteGameSchema);
