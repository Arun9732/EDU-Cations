const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');
const Class = require('../models/Class');

// GET /api/chapters?classNumber=10&subject=Mathematics
router.get('/', async (req, res) => {
  try {
    const { classNumber, subject } = req.query;
    let filter = {};
    if (classNumber) {
      const cls = await Class.findOne({ number: classNumber });
      if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
      filter.classId = cls._id;
    }
    if (subject) filter.subject = subject;
    const chapters = await Chapter.find(filter).sort({ order: 1 });
    res.json({ success: true, data: chapters });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/chapters/subjects/:classNumber — get all subjects for a class
router.get('/subjects/:classNumber', async (req, res) => {
  try {
    const cls = await Class.findOne({ number: req.params.classNumber });
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
    const subjects = await Chapter.distinct('subject', { classId: cls._id });
    res.json({ success: true, data: subjects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/chapters/:id
router.get('/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id).populate('classId');
    if (!chapter) return res.status(404).json({ success: false, message: 'Chapter not found' });
    res.json({ success: true, data: chapter });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
