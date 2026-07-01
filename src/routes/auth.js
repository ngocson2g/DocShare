const express = require('express');
const router = express.Router();
const config = require('../config');
const { logAction, getLogs } = require('../utils/logger');

/**
 * POST /api/auth/login
 * Đăng nhập admin.
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === config.adminUsername && password === config.adminPassword) {
    req.session.isAdmin = true;
    logAction('LOGIN', 'Admin đăng nhập thành công');
    return res.json({ success: true, message: 'Đăng nhập thành công' });
  }

  return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
});

/**
 * POST /api/auth/logout
 * Đăng xuất.
 */
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Lỗi khi đăng xuất' });
    }
    res.json({ success: true, message: 'Đã đăng xuất' });
  });
});

/**
 * GET /api/auth/me
 * Kiểm tra trạng thái đăng nhập hiện tại.
 */
router.get('/me', (req, res) => {
  res.json({
    isAdmin: !!(req.session && req.session.isAdmin),
  });
});

router.get('/logs', async (req, res) => {
  if (!req.session || !req.session.isAdmin) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const logs = await getLogs();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
