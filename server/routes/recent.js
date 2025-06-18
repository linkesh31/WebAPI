const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const RecentAnime = require('../models/RecentAnime');
const RecentGame = require('../models/RecentGame');
const RecentMusic = require('../models/RecentMusic');
const auth = require('../middleware/auth');

// === SAVE ROUTES ===
router.post('/anime', auth, async (req, res) => {
  const { animeId, title, url } = req.body;
  const userId = new mongoose.Types.ObjectId(req.userId);

  try {
    await RecentAnime.deleteMany({ userId, animeId });
    await RecentAnime.create({ userId, animeId, title, url });

    const count = await RecentAnime.countDocuments({ userId });
    if (count > 4) {
      const oldest = await RecentAnime.find({ userId }).sort({ createdAt: 1 }).limit(count - 4);
      const idsToDelete = oldest.map(doc => doc._id);
      await RecentAnime.deleteMany({ _id: { $in: idsToDelete } });
    }

    res.status(200).json({ message: "Recent anime saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/game', auth, async (req, res) => {
  const { gameId, title, slug } = req.body;
  const userId = new mongoose.Types.ObjectId(req.userId);

  try {
    await RecentGame.deleteMany({ userId, gameId });
    await RecentGame.create({ userId, gameId, title, slug });

    const count = await RecentGame.countDocuments({ userId });
    if (count > 4) {
      const oldest = await RecentGame.find({ userId }).sort({ createdAt: 1 }).limit(count - 4);
      const idsToDelete = oldest.map(doc => doc._id);
      await RecentGame.deleteMany({ _id: { $in: idsToDelete } });
    }

    res.status(200).json({ message: "Recent game saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/music', auth, async (req, res) => {
  const { trackId, title, audioUrl } = req.body;
  const userId = new mongoose.Types.ObjectId(req.userId);

  try {
    await RecentMusic.deleteMany({ userId, trackId });
    await RecentMusic.create({ userId, trackId, title, audioUrl });

    const count = await RecentMusic.countDocuments({ userId });
    if (count > 4) {
      const oldest = await RecentMusic.find({ userId }).sort({ createdAt: 1 }).limit(count - 4);
      const idsToDelete = oldest.map(doc => doc._id);
      await RecentMusic.deleteMany({ _id: { $in: idsToDelete } });
    }

    res.status(200).json({ message: "Recent music saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === GET ROUTES ===
router.get('/anime', auth, async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.userId);
  try {
    const recent = await RecentAnime.find({ userId }).sort({ createdAt: -1 });
    res.json(recent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/game', auth, async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.userId);
  try {
    const recent = await RecentGame.find({ userId }).sort({ createdAt: -1 });
    res.json(recent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/music', auth, async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.userId);
  try {
    const recent = await RecentMusic.find({ userId }).sort({ createdAt: -1 });
    res.json(recent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === DELETE (CLEAR) ROUTES ===
router.delete('/anime', auth, async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.userId);
  try {
    await RecentAnime.deleteMany({ userId });
    res.status(200).json({ message: 'Anime history cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/game', auth, async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.userId);
  try {
    await RecentGame.deleteMany({ userId });
    res.status(200).json({ message: 'Game history cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/music', auth, async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.userId);
  try {
    await RecentMusic.deleteMany({ userId });
    res.status(200).json({ message: 'Music history cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
