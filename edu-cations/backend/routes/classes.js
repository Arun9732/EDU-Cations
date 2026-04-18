const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

// GET /api/classes — get all classes
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find().sort({ number: 1 });
    res.json({ success: true, data: classes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/classes/:number
router.get('/:number', async (req, res) => {
  try {
    const cls = await Class.findOne({ number: req.params.number });
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
    res.json({ success: true, data: cls });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
