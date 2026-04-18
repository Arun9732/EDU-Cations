const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const Chapter = require('../models/Chapter');
const Video = require('../models/Video');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

// ── STATS ──────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [classes, chapters, videos, users] = await Promise.all([
      Class.countDocuments(),
      Chapter.countDocuments(),
      Video.countDocuments(),
      User.countDocuments({ role: 'student' }),
    ]);
    res.json({ success: true, data: { classes, chapters, videos, students: users } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── CHAPTERS CRUD ──────────────────────────────────────
router.get('/chapters', async (req, res) => {
  try {
    const chapters = await Chapter.find().populate('classId', 'number label').sort({ 'classId.number': 1, order: 1 });
    res.json({ success: true, data: chapters });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/chapters', async (req, res) => {
  try {
    const chapter = await Chapter.create(req.body);
    res.status(201).json({ success: true, data: chapter });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/chapters/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: chapter });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/chapters/:id', async (req, res) => {
  try {
    await Chapter.findByIdAndDelete(req.params.id);
    await Video.deleteMany({ chapterId: req.params.id });
    res.json({ success: true, message: 'Chapter and its videos deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── VIDEOS CRUD ────────────────────────────────────────
router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find().populate('chapterId', 'name subject').sort({ createdAt: -1 });
    res.json({ success: true, data: videos });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/videos', async (req, res) => {
  try {
    const video = await Video.create(req.body);
    res.status(201).json({ success: true, data: video });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/videos/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: video });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/videos/:id', async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Video deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── USERS ──────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
