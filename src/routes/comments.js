const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const controller = require('../controllers/commentController');

// Public
router.get('/comments/:docId', controller.list);
router.get('/comments/:docId/stats', controller.stats);
router.post('/comments/:docId', controller.add); // Ai cũng có thể bình luận/thả tim

// Admin
router.delete('/comments/:id', requireAdmin, controller.remove);

module.exports = router;
