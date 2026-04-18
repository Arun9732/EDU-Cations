const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  classId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  subject:   { type: String, required: true },
  name:      { type: String, required: true },
  order:     { type: Number, default: 1 },
  nextSteps: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Chapter', chapterSchema);
