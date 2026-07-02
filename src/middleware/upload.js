const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const config = require('../config');
const { fixVietnameseName } = require('../utils/fileHelpers');

// Đảm bảo thư mục uploads tồn tại
if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, config.uploadDir),
  filename: (req, file, cb) => {
    const unique = crypto.randomBytes(8).toString('hex');
    const fixedName = fixVietnameseName(file.originalname);
    const ext = path.extname(fixedName).toLowerCase();
    cb(null, unique + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const fixedName = fixVietnameseName(file.originalname);
  const ext = path.extname(fixedName).toLowerCase();
  if (config.allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('INVALID_FILE_TYPE'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: config.maxFileSize },
  fileFilter,
});

module.exports = upload;
