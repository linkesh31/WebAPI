const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const FavoriteAnime = require('../models/FavoriteAnime');
const FavoriteGame = require('../models/FavoriteGame');
const FavoriteTrack = require('../models/FavoriteTrack'); // ADD THIS
const RecentAnime = require('../models/RecentAnime');
const RecentGame = require('../models/RecentGame');
const auth = require('../middleware/auth');

// Get profile info + favorites summary
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -otp -__v');

    const animeCount = await FavoriteAnime.countDocuments({ userId: req.userId });
    const gameCount = await FavoriteGame.countDocuments({ userId: req.userId });
    const musicCount = await FavoriteTrack.countDocuments({ userId: req.userId }); // ADD THIS

    res.json({
      user,
      favorites: {
        anime: animeCount,
        games: gameCount,
        music: musicCount // ADD THIS
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update profile (username, bio)
router.put('/update', auth, async (req, res) => {
  const { username, bio } = req.body;
  try {
    const updated = await User.findByIdAndUpdate(
      req.userId,
      { username, bio },
      { new: true, select: '-password -otp -__v' }
    );
    res.json({ message: 'Profile updated successfully', user: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Change password
router.put('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.userId);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete account
router.delete('/delete', auth, async (req, res) => {
  try {
    await FavoriteAnime.deleteMany({ userId: req.userId });
    await FavoriteGame.deleteMany({ userId: req.userId });
    await FavoriteTrack.deleteMany({ userId: req.userId }); // ADD THIS
    await RecentAnime.deleteMany({ userId: req.userId });
    await RecentGame.deleteMany({ userId: req.userId });
    await User.findByIdAndDelete(req.userId);

    res.json({ message: 'Account and all data deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Activity log (recent viewed)
router.get('/activity-log', auth, async (req, res) => {
  try {
    const recentAnime = await RecentAnime.find({ userId: req.userId }).sort({ createdAt: -1 });
    const recentGames = await RecentGame.find({ userId: req.userId }).sort({ createdAt: -1 });

    res.json({ recentAnime, recentGames });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
