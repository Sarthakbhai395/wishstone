module.exports = {
  apps: [{
    name: "wishstone-backend",
    script: "./server.js",

    // Cluster mode — uses all CPU cores for load balancing
    instances: "max",
    exec_mode: "cluster",

    // Environment
    env: {
      NODE_ENV: "development",
      PORT: 5000,
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 5000,
    },

    // Logging
    error_file: "./logs/err.log",
    out_file:   "./logs/out.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    merge_logs: true,

    // Reliability
    autorestart: true,
    watch: false,
    max_memory_restart: "512M",
    min_uptime: "10s",
    max_restarts: 10,
    restart_delay: 3000,

    // Graceful shutdown
    kill_timeout: 10000,
    listen_timeout: 8000,
    shutdown_with_message: true,
  }],
};
