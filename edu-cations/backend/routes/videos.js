const express = require('express');
const router = express.Router();
const Video = require('../models/Video');

// GET /api/videos?chapterId=xxx
router.get('/', async (req, res) => {
  try {
    const { chapterId } = req.query;
    const filter = chapterId ? { chapterId } : {};
    const videos = await Video.find(filter).sort({ order: 1 });
    res.json({ success: true, data: videos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/videos/:id
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate('chapterId');
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    res.json({ success: true, data: video });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
