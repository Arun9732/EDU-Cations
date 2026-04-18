const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  number:      { type: Number, required: true, unique: true },
  label:       { type: String, required: true },
  tagline:     { type: String },
  description: { type: String },
  color:       { type: String, default: '#6c63ff' },
  tag:         { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
