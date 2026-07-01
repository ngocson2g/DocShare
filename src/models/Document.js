const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  filename: { type: String, required: true },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  driveId: { type: String, default: null }, // ID của file trên Google Drive
  category: { type: String, default: 'Chung' },
  description: { type: String, default: '' },
  downloads: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  pinned: { type: Boolean, default: false },
}, { 
  timestamps: { createdAt: 'uploadedAt', updatedAt: false },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Document', documentSchema);
