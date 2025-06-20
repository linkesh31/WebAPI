const mongoose = require('mongoose'); // Importing Mongoose library

// Defining the schema for users
const userSchema = new mongoose.Schema({
  email: {
    type: String, // User's email address
    required: true, // This field is mandatory
    unique: true, // Ensures that each email is unique in the database
  },
  username: {
    type: String, // User's chosen username
    required: true, // This field is mandatory
  },
  password: {
    type: String, // User's password (should be hashed before saving)
    required: true, // This field is mandatory
  },
  otp: {
    type: String, // One-time password for verification
    default: null, // Default value is null
  },
  isVerified: {
    type: Boolean, // Indicates if the user's email is verified
    default: false, // Default value is false
  },
  bio: {
    type: String, // User's biography or description
    default: '' // Default value is an empty string
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

//Safe export to prevent OverwriteModelError
module.exports = mongoose.models.User || mongoose.model('User ', userSchema);
