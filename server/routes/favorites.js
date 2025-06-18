// server/routes/favorite.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const FavoriteAnime = require('../models/FavoriteAnime');
const FavoriteGame = require('../models/FavoriteGame');
const FavoriteTrack = require('../models/FavoriteTrack'); // ✅ Music

// ===================== ANIME ROUTES =====================

// Save favorite anime
router.post('/anime', auth, async (req, res) => {
  const { animeId, title, posterImage, rating } = req.body;
  const userId = req.userId;

  try {
    const exists = await FavoriteAnime.findOne({ userId, animeId });
    if (exists) return res.status(400).json({ message: 'Already saved' });

    const fav = new FavoriteAnime({ userId, animeId, title, posterImage, rating });
    await fav.save();
    res.status(201).json({ message: 'Anime saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all favorite anime
router.get('/anime', auth, async (req, res) => {
  try {
    const data = await FavoriteAnime.find({ userId: req.userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove favorite anime
router.delete('/anime/:animeId', auth, async (req, res) => {
  try {
    await FavoriteAnime.findOneAndDelete({
      userId: req.userId,
      animeId: req.params.animeId
    });
    res.status(200).json({ message: 'Anime removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== GAME ROUTES =====================

// Save favorite game
router.post('/games', auth, async (req, res) => {
  const { gameId, title, posterImage, rating } = req.body;
  const userId = req.userId;

  try {
    const exists = await FavoriteGame.findOne({ userId, gameId });
    if (exists) return res.status(400).json({ message: 'Already saved' });

    const fav = new FavoriteGame({ userId, gameId, title, posterImage, rating });
    await fav.save();
    res.status(201).json({ message: 'Game saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all favorite games
router.get('/games', auth, async (req, res) => {
  try {
    const data = await FavoriteGame.find({ userId: req.userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove favorite game
router.delete('/games/:gameId', auth, async (req, res) => {
  try {
    await FavoriteGame.findOneAndDelete({
      userId: req.userId,
      gameId: req.params.gameId
    });
    res.status(200).json({ message: 'Game removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== MUSIC ROUTES =====================

// Save favorite music track
router.post('/music', auth, async (req, res) => {
  const { trackId, title, artistName, coverImage, audioUrl } = req.body;
  const userId = req.userId;

  try {
    const exists = await FavoriteTrack.findOne({ userId, trackId });
    if (exists) return res.status(400).json({ message: 'Already saved' });

    const fav = new FavoriteTrack({
      userId,
      trackId,
      title,
      artistName,
      coverImage,
      audioUrl
    });

    await fav.save();
    res.status(201).json({ message: 'Music track saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all favorite music tracks
router.get('/music', auth, async (req, res) => {
  try {
    const favorites = await FavoriteTrack.find({ userId: req.userId });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove favorite music track
router.delete('/music/:trackId', auth, async (req, res) => {
  try {
    await FavoriteTrack.findOneAndDelete({
      userId: req.userId,
      trackId: req.params.trackId
    });
    res.status(200).json({ message: 'Track removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
