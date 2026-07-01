const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { requireAdmin } = require('../middleware/auth');
const controller = require('../controllers/documentController');

// Public — tất cả user đều truy cập được
router.get('/documents', controller.list);
router.get('/view/:id', controller.view);
router.get('/download/:id', controller.download);

// Admin only — yêu cầu đăng nhập admin
router.post('/upload', requireAdmin, upload.single('file'), controller.upload);
router.put('/documents/:id', requireAdmin, controller.update);
router.delete('/documents/:id', requireAdmin, controller.remove);

module.exports = router;
