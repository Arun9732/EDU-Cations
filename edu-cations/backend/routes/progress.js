const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const { protect } = require('../middleware/auth');

// GET /api/progress — get my progress
router.get('/', protect, async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user._id }).populate('chapterId', 'name subject');
    res.json({ success: true, data: progress });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/progress/video — mark video watched
router.post('/video', protect, async (req, res) => {
  try {
    const { chapterId, videoId } = req.body;
    let progress = await Progress.findOne({ userId: req.user._id, chapterId });
    if (!progress) {
      progress = await Progress.create({ userId: req.user._id, chapterId, videoIds: [videoId] });
    } else if (!progress.videoIds.includes(videoId)) {
      progress.videoIds.push(videoId);
      await progress.save();
    }
    res.json({ success: true, data: progress });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/progress/complete — mark chapter complete
router.post('/complete', protect, async (req, res) => {
  try {
    const { chapterId } = req.body;
    const progress = await Progress.findOneAndUpdate(
      { userId: req.user._id, chapterId },
      { completed: true },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: progress });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
