const { createClient } = require('redis');

// 显式指定连接配置（旧版服务器可能需要 legacyMode）
const client = createClient({
  socket: {
    host: '127.0.0.1',
    port: 6379
  }
  // legacyMode: true  // 如果仍有问题可以尝试启用
});

client.on('error', (err) => console.log('Redis Error:', err));

(async () => {
  await client.connect();  // 必须显式连接
  
  await client.set('key', 'Hello from Redis 3.0!');
  const value = await client.get('key');
  console.log(value);  // 输出: "Hello from Redis 3.0!"
  
  await client.quit();
})();