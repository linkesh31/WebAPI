const mongoose = require('mongoose');

const recentMusicSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
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
  audioUrl: {
    type: String,
    required: true
  }
}, {
  timestamps: true // ✅ Enables createdAt for sorting
});

module.exports = mongoose.model('RecentMusic', recentMusicSchema);
