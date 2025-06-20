// Importing required modules
const express = require('express');                    // Express for routing
const router = express.Router();                       // Create a new Express Router
const bcrypt = require('bcryptjs');                    // For hashing passwords securely
const jwt = require('jsonwebtoken');                   // For generating and verifying JWT tokens
const User = require('../models/user');                // User model for MongoDB
const generateOTP = require('../utils/otpGenerator');  // Function to generate 6-digit OTP
const sendOTP = require('../utils/mailer');            // Function to send OTP email

// ===============================
// SIGN UP - WITH OTP VERIFICATION
// ===============================
router.post('/signup', async (req, res) => {
  const { email, username, password } = req.body; // Extract user details

  try {
    // Check if user with this email already exists
    const existing = await User.findOne({ email });

    // If user exists and is already verified, block registration
    if (existing && existing.isVerified) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // If user exists but is not verified, allow re-register by deleting old record
    if (existing && !existing.isVerified) {
      await User.deleteOne({ email });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a new OTP for email verification
    const otp = generateOTP();

    try {
      // Send OTP to user's email first (ensure email is valid)
      await sendOTP(email, otp);

      // Create new user with hashed password and OTP
      const newUser = new User({
        email,
        username,
        password: hashedPassword,
        otp,
        isVerified: false
      });

      // Save user to database
      await newUser.save();

      // Send success response
      res.status(200).json({ message: "OTP sent to email. Please verify your account." });

    } catch (emailError) {
      // If email fails to send, show error
      console.error("Failed to send OTP email:", emailError);
      res.status(500).json({ message: "Failed to send OTP email. Please try again." });
    }

  } catch (err) {
    // Any database or server error
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// ===========================================
// VERIFY OTP AFTER SIGNUP (EMAIL VERIFICATION)
// ===========================================
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // If OTP matches, verify account and clear OTP
    if (user.otp === otp) {
      user.isVerified = true;
      user.otp = null;
      await user.save();
      res.status(200).json({ message: "Email verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed", error: err.message });
  }
});

// =====================
// LOGIN (WITH JWT TOKEN)
// =====================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent login if user has not verified email
    if (!user.isVerified) return res.status(401).json({ message: "Please verify your email first" });

    // Compare password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token valid for 2 hours
    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Return token and user info
    res.status(200).json({
      token,
      user: {
        email: user.email,
        username: user.username
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// ===================================
// REQUEST OTP FOR PASSWORD RESET FLOW
// ===================================
router.post('/request-reset', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate new OTP
    const otp = generateOTP();
    user.otp = otp;

    try {
      await sendOTP(email, otp); // Send OTP to email
      await user.save();         // Save updated user
      res.status(200).json({ message: 'OTP sent for password reset' });
    } catch (emailError) {
      console.error("Failed to send reset OTP:", emailError);
      res.status(500).json({ message: "Failed to send OTP for reset." });
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================================
// VERIFY OTP DURING PASSWORD RESET FLOW
// =======================================
router.post('/verify-reset-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Match OTP
    if (user.otp === otp) {
      res.status(200).json({ message: 'OTP matched' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================
// RESET PASSWORD AFTER OTP
// ==========================
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null; // Clear OTP
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================
// EXPORT ROUTER FILE
// ==================
module.exports = router;
