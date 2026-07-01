const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const controller = require('../controllers/collectionController');

// Public
router.get('/collections', controller.list);

// Admin only
router.post('/collections', requireAdmin, controller.create);
router.put('/collections/:id', requireAdmin, controller.update);
router.delete('/collections/:id', requireAdmin, controller.remove);
router.post('/collections/:id/docs', requireAdmin, controller.addDocs);
router.delete('/collections/:id/docs', requireAdmin, controller.removeDocs);

module.exports = router;
