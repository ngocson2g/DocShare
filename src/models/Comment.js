const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  documentId: { type: String, required: true }, // Changed to String as frontend sends ID as string
  author: { type: String, required: true, default: 'Ẩn danh' },
  content: { type: String, default: '' },
  reaction: { type: String, enum: ['like', 'dislike', null], default: null }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Comment', commentSchema);
