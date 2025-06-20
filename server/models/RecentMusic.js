const mongoose = require('mongoose'); // Importing Mongoose library

// Defining the schema for recent music tracks
const recentMusicSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    required: true // This field is mandatory
  },
  trackId: {
    type: String, // Unique identifier for the music track
    required: true // This field is mandatory
  },
  title: {
    type: String, // Title of the music track
    required: true // This field is mandatory
  },
  audioUrl: {
    type: String, // URL to the audio file of the track
    required: true // This field is mandatory
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Exporting the RecentMusic model based on the schema
module.exports = mongoose.model('RecentMusic', recentMusicSchema);
