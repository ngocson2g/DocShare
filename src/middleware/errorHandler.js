/**
 * Error handler tập trung.
 * Bắt lỗi Multer và các lỗi khác, trả JSON response chuẩn.
 */
function errorHandler(err, req, res, _next) {
  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: req.t('fileTooLarge'),
      code: 'LIMIT_FILE_SIZE',
    });
  }

  if (err.message === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      error: req.t('invalidFileType'),
      code: 'INVALID_FILE_TYPE',
    });
  }

  // Generic error
  console.error('❌ Server error:', err.message);
  return res.status(500).json({
    error: req.t('internalError'),
    code: 'INTERNAL_ERROR',
  });
}

module.exports = errorHandler;
