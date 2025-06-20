const mongoose = require('../utils/db'); // Importing the Mongoose instance from the database utility

// Defining the schema for recent games
const recentGameSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    ref: 'User ', // Establishes a relationship with the User collection
    required: true // This field is mandatory
  },
  gameId: {
    type: String, // Unique identifier for the game
    required: true // This field is mandatory
  },
  title: {
    type: String, // Title of the game
    required: true // This field is mandatory
  },
  slug: {
    type: String, // Slug for the game, typically used in URLs
    required: true // This field is mandatory
  },
  createdAt: {
    type: Date, // Date when the record was created
    default: Date.now // Default value is the current date and time
  }
});

// Exporting the RecentGame model based on the schema
module.exports = mongoose.model('RecentGame', recentGameSchema);
