module.exports = {
  apps: [{
    name: "docshare-api",
    script: "./src/server.js",
    cwd: "/root/docsharev2/current", // Luôn trỏ qua symlink ổn định, tránh PM2 cache cwd cũ
    instances: "max", // Chạy số process bằng số nhân CPU
    exec_mode: "cluster", // Chế độ load balancer của PM2
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
};
