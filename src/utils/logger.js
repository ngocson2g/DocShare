const AdminLog = require('../models/AdminLog');

async function getLogs() {
  try {
    return await AdminLog.find().sort({ createdAt: -1 }).limit(100).exec();
  } catch (error) {
    console.error('Error fetching logs:', error);
    return [];
  }
}

async function logAction(action, details) {
  try {
    await AdminLog.create({ action, details });
    
    // Optional: limit to 100 logs (could be done via a cron job, but we'll do it simply here)
    const count = await AdminLog.countDocuments();
    if (count > 100) {
      const oldest = await AdminLog.find().sort({ createdAt: 1 }).limit(count - 100).exec();
      const oldestIds = oldest.map(log => log._id);
      await AdminLog.deleteMany({ _id: { $in: oldestIds } });
    }
  } catch (error) {
    console.error('Error writing log:', error);
  }
}

module.exports = { getLogs, logAction };
