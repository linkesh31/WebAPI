const express = require('express'); // Importing Express framework
const router = express.Router(); // Creating a new router instance
const bcrypt = require('bcryptjs'); // Importing bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Importing jsonwebtoken for token generation
const User = require('../models/user'); // Importing the User model
const generateOTP = require('../utils/otpGenerator'); // Importing OTP generator utility
const sendOTP = require('../utils/mailer'); // Importing mailer utility for sending emails

// SIGNUP WITH OTP + SAFEGUARD (Allow re-register if unverified)
router.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const existing = await User.findOne({ email });

    // Check if the email already exists and is verified
    if (existing && existing.isVerified) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // If an unverified user exists, delete the previous unverified record
    if (existing && !existing.isVerified) {
      await User.deleteOne({ email });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password
    const otp = generateOTP(); // Generating OTP

    // Try sending OTP first before saving user
    try {
      await sendOTP(email, otp); // Sending OTP to the user's email

      const newUser  = new User({
        email,
        username,
        password: hashedPassword,
        otp,
        isVerified: false
      });

      await newUser .save(); // Saving the new user to the database

      res.status(200).json({ message: "OTP sent to email. Please verify your account." });

    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      res.status(500).json({ message: "Failed to send OTP email. Please try again." });
    }

  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// OTP VERIFICATION (for signup)
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User  not found" });

    if (user.otp === otp) {
      user.isVerified = true; // Marking the user as verified
      user.otp = null; // Clearing the OTP
      await user.save(); // Saving the updated user
      res.status(200).json({ message: "Email verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed", error: err.message });
  }
});

// LOGIN (only if email verified)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User  not found" });
    if (!user.isVerified) return res.status(401).json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password); // Comparing passwords
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username },
      process.env.JWT_SECRET, // Secret key for signing the token
      { expiresIn: '2h' } // Token expiration time
    );

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

// REQUEST OTP FOR PASSWORD RESET
router.post('/request-reset', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User  not found' });

    const otp = generateOTP(); // Generating OTP for password reset
    user.otp = otp; // Setting the OTP for the user

    try {
      await sendOTP(email, otp); // Sending OTP to the user's email
      await user.save(); // Saving the updated user
      res.status(200).json({ message: 'OTP sent for password reset' });
    } catch (emailError) {
      console.error("Failed to send reset OTP:", emailError);
      res.status(500).json({ message: "Failed to send OTP for reset." });
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// VERIFY OTP FOR PASSWORD RESET
router.post('/verify-reset-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User  not found' });

    if (user.otp === otp) {
      res.status(200).json({ message: 'OTP matched' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PASSWORD RESET
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User  not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hashing the new password
    user.password = hashedPassword; // Updating the user's password
    user.otp = null; // Clearing the OTP
    await user.save(); // Saving the updated user

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; // Exporting the router
