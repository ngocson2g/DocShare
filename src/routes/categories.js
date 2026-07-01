const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const controller = require('../controllers/categoryController');

router.get('/categories', controller.list);
router.post('/categories', requireAdmin, controller.add);
router.delete('/categories', requireAdmin, controller.remove);

module.exports = router;
