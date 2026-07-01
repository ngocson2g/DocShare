/**
 * Error handler tập trung.
 * Bắt lỗi Multer và các lỗi khác, trả JSON response chuẩn.
 */
function errorHandler(err, req, res, _next) {
  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File quá lớn. Tối đa 100MB.',
      code: 'LIMIT_FILE_SIZE',
    });
  }

  if (err.message === 'Định dạng file không được hỗ trợ') {
    return res.status(400).json({
      error: err.message,
      code: 'INVALID_FILE_TYPE',
    });
  }

  // Generic error
  console.error('❌ Server error:', err.message);
  return res.status(500).json({
    error: 'Đã xảy ra lỗi máy chủ',
    code: 'INTERNAL_ERROR',
  });
}

module.exports = errorHandler;
