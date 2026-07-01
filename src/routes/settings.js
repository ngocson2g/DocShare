const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { requireAdmin } = require('../middleware/auth');
const controller = require('../controllers/settingsController');
const config = require('../config');

// Setup multer cho settings (logo, bgImage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, config.uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const hash = crypto.randomBytes(8).toString('hex');
    cb(null, `setting_${hash}${ext}`);
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.get('/settings', controller.getSettings);

router.post('/settings', requireAdmin, upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'bgImage', maxCount: 1 }
]), controller.updateSettings);

module.exports = router;
