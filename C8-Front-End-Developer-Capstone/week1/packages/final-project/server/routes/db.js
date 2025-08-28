const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017,localhost:27018,localhost:27019/little-lemon?replicaSet=rs0'
).then(() => {
  console.log('Connected to little-lemon database with replica set');
}).catch((err) => {
  console.log(err);
});

mongoose.connection.on('connected', async () => {
  try {
    // 检查是否支持事务
    const isMaster = await mongoose.connection.db.command({ isMaster: 1 });
    console.log("MongoDB 部署信息:", JSON.stringify(isMaster, null, 2));

    if (isMaster.setName) {
      console.log(`✅ 这是一个复制集 (${isMaster.setName})，支持事务功能`);
      console.log(`當前主節點: ${isMaster.primary}`);
    } else {
      console.log("⚠️ 这是单机部署，不支持事务功能");
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
});
// 连接事件监听

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// 优雅关闭
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed due to app termination');
  process.exit(0);
});

module.exports = mongoose;