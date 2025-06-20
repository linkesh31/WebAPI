const mongoose = require('../utils/db'); // Importing the Mongoose instance from the database utility

// Defining the schema for recent anime
const recentAnimeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    ref: 'User ', // Establishes a relationship with the User collection
    required: true // This field is mandatory
  },
  animeId: {
    type: String, // Unique identifier for the anime
    required: true // This field is mandatory
  },
  title: {
    type: String, // Title of the anime
    required: true // This field is mandatory
  },
  url: {
    type: String, // URL to the anime's page or streaming link
    required: true // This field is mandatory
  },
  createdAt: {
    type: Date, // Date when the record was created
    default: Date.now // Default value is the current date and time
  }
});

// Exporting the RecentAnime model based on the schema
module.exports = mongoose.model('RecentAnime', recentAnimeSchema);
