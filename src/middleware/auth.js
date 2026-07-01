/**
 * Middleware kiểm tra quyền admin.
 * Chỉ cho phép truy cập nếu đã đăng nhập với tài khoản admin.
 */
function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  return res.status(401).json({ error: 'Bạn cần đăng nhập với quyền admin' });
}

module.exports = { requireAdmin };
