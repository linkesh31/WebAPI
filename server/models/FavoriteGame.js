const mongoose = require('mongoose'); // Import Mongoose ODM library

// Define the schema for favorite games
const favoriteGameSchema = new mongoose.Schema({
  // Reference to User model with required ObjectId field
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Establishes relationship with User collection
    required: true // Makes this field mandatory
  },
  
  // Unique identifier for the game from external API
  gameId: { 
    type: String,
    required: true // Makes this field mandatory
  },
  
  // Title of the game
  title: {
    type: String,
    required: true, // Makes this field mandatory
    trim: true // Automatically removes whitespace
  },
  
  // URL to the game's cover/poster image
  posterImage: {
    type: String,
    validate: { // Custom validation
      validator: function(v) {
        // Basic URL validation regex
        return /^(https?:\/\/).*\.(jpe?g|png|gif|bmp|webp)$/i.test(v);
      },
      message: props => `${props.value} is not a valid image URL!`
    }
  },
  
  // User's personal rating (1-10)
  rating: {
    type: Number,
    min: 1, // Minimum rating value
    max: 10, // Maximum rating value
    set: v => Math.round(v) // Round to nearest integer when saved
  }
}, { 
  // Schema options
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true }, // Include virtuals when converting to JSON
  toObject: { virtuals: true } // Include virtuals when converting to plain objects
});

// Index for faster queries on common fields
favoriteGameSchema.index({ userId: 1, gameId: 1 }, { unique: true });
// 1 = ascending order index
// unique: true ensures no duplicate game entries per user

// Virtual property that calculates age of the favorited game
favoriteGameSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt;
});

// Middleware that runs before saving
favoriteGameSchema.pre('save', function(next) {
  console.log(`Saving favorite game: ${this.title}`);
  next();
});

// Static method to find games by user
favoriteGameSchema.statics.findByUser = function(userId) {
  return this.find({ userId }); // Returns query promise
};

// Instance method to format output
favoriteGameSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.id = obj._id; // Convert _id to id
  delete obj._id;
  delete obj.__v;
  return obj;
};

// Export the FavoriteGame model
module.exports = mongoose.model('FavoriteGame', favoriteGameSchema);
