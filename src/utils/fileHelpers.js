/**
 * Multer nhận tên file dưới dạng Latin-1, cần decode lại thành UTF-8.
 * Điều này đảm bảo tên file tiếng Việt hiển thị đúng.
 */
function fixVietnameseName(raw) {
  try {
    return Buffer.from(raw, 'latin1').toString('utf8');
  } catch {
    return raw;
  }
}

/**
 * Tạo Content-Disposition header chuẩn RFC 5987 cho tiếng Việt.
 * @param {'inline'|'attachment'} type
 * @param {string} filename - Tên file gốc (UTF-8)
 */
function contentDisposition(type, filename) {
  const encoded = encodeURIComponent(filename).replace(/'/g, '%27');
  // fallback ASCII + UTF-8 extended param
  const ascii = filename.replace(/[^\x20-\x7E]/g, '_');
  return `${type}; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}

module.exports = {
  fixVietnameseName,
  contentDisposition,
};
