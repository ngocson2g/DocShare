const path = require('path');

// Load .env từ project root
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

// Dùng process.cwd() thay vì __dirname để luôn đi qua symlink /current
// (__dirname resolve symlink thành path thực của release cũ, có thể bị xóa khi dọn rác)
const ROOT_DIR = process.cwd();

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,

  uploadDir: path.resolve(ROOT_DIR, process.env.UPLOAD_DIR || './data/uploads'),
  dataFile: path.resolve(ROOT_DIR, process.env.DATA_FILE || './data/documents.json'),
  commentsFile: path.resolve(ROOT_DIR, './data/comments.json'),
  collectionsFile: path.resolve(ROOT_DIR, './data/collections.json'),

  maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 100 * 1024 * 1024, // 100MB

  allowedExtensions: [
    '.pdf', '.doc', '.docx',
    '.xls', '.xlsx',
    '.ppt', '.pptx',
    '.txt', '.md',
    '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg',
  ],

  // Admin authentication
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  sessionSecret: process.env.SESSION_SECRET || 'docshare-secret-key',
  
  // Database & Cache
  mongoURI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/docshare',
  redisURI: process.env.REDIS_URI || 'redis://127.0.0.1:6379',
};

module.exports = config;
