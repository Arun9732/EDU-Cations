const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  title:     { type: String, required: true },
  creator:   { type: String, required: true },
  handle:    { type: String },
  url:       { type: String, required: true },
  thumb:     { type: String },
  tags:      [{ type: String }],
  order:     { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
