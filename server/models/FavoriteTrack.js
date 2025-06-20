// server/models/FavoriteTrack.js

const mongoose = require('mongoose'); // Importing Mongoose library

// Defining the schema for favorite tracks
const favoriteTrackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    ref: 'User ', // Establishes a relationship with the User collection
    required: true // This field is mandatory
  },
  trackId: {
    type: String, // Unique identifier for the track
    required: true // This field is mandatory
  },
  title: {
    type: String, // Title of the track
    required: true // This field is mandatory
  },
  artistName: { // Updated field for the artist's name
    type: String, // Type for artist name
    default: '' // Default value is an empty string
  },
  coverImage: {
    type: String, // URL for the track's cover image
    default: '' // Default value is an empty string
  },
  audioUrl: {
    type: String, // URL for the audio file
    required: true // This field is mandatory
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Exporting the FavoriteTrack model based on the schema
module.exports = mongoose.model('FavoriteTrack', favoriteTrackSchema);
