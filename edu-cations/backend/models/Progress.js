const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chapterId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  videoIds:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  completed:  { type: Boolean, default: false },
}, { timestamps: true });

progressSchema.index({ userId: 1, chapterId: 1 }, { unique: true });
module.exports = mongoose.model('Progress', progressSchema);
