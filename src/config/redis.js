const { createClient } = require('redis');
const config = require('./index');

const redisClient = createClient({
  url: config.redisURI
});

redisClient.on('error', (err) => console.log('❌ Redis Client Error', err));
redisClient.on('connect', () => console.log('✅ Redis Client Connected'));

// Tự động kết nối
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('❌ Redis Initial Connection Failed:', err.message);
  }
})();

module.exports = redisClient;
