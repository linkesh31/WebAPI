// server/models/FavoriteTrack.js

const mongoose = require('mongoose');

const favoriteTrackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trackId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  artistName: { // ✅ updated field
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  audioUrl: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FavoriteTrack', favoriteTrackSchema);
