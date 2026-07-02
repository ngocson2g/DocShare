const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').RedisStore;
const path = require('path');
const config = require('./config');
const redisClient = require('./config/redis');
const documentRoutes = require('./routes/documents');
const authRoutes = require('./routes/auth');
const commentRoutes = require('./routes/comments');
const collectionRoutes = require('./routes/collections');
const categoryRoutes = require('./routes/categories');
const settingsRoutes = require('./routes/settings');
const errorHandler = require('./middleware/errorHandler');
const rateLimit = require('express-rate-limit');
const RedisStoreRateLimit = require('rate-limit-redis').default;
const { i18nMiddleware, messages } = require('./i18n');

const app = express();

// Trust proxy khi chạy sau Nginx (để express-rate-limit lấy đúng IP client)
app.set('trust proxy', 1);

// Rate limiting (Basic DDoS / Spam protection)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Tăng limit lên 1000 để không bị chặn khi F5 nhiều
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStoreRateLimit({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  message: (req) => ({ error: req.t ? req.t('tooManyRequests') : messages.en.tooManyRequests })
});

// i18n — attaches req.t() to every request
app.use(i18nMiddleware);

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Session middleware
app.use(session({
  store: new RedisStore({ client: redisClient, prefix: 'docshare:sess:' }),
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 giờ
  },
}));

// Static files (frontend)
app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: '7d' }));
app.use('/uploads', express.static(config.uploadDir, { maxAge: '7d' }));

// API routes
app.use('/api', apiLimiter); // Apply rate limiter to all API endpoints
app.use('/api/auth', authRoutes);
app.use('/api', documentRoutes);
app.use('/api', commentRoutes);
app.use('/api', collectionRoutes);
app.use('/api', categoryRoutes);
app.use('/api', settingsRoutes);

// Error handler (phải đặt cuối cùng)
app.use(errorHandler);

module.exports = app;
