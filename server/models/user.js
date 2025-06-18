const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  bio: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// ✅ Safe export to prevent OverwriteModelError
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
