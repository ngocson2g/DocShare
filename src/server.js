const app = require('./app');
const config = require('./config');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

app.listen(config.port, () => {
  console.log(`✅ DocShare đang chạy tại http://localhost:${config.port}`);
});
