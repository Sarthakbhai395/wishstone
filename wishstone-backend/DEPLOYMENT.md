# 🚀 Wishstone Backend - Production Deployment Guide

## Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB Atlas account or MongoDB server
- PM2 (optional, for production process management)

## 🔧 Installation

### 1. Clone and Install Dependencies

```bash
cd Wishstone-website/wishstone-backend
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your production values:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secure-jwt-secret-minimum-32-chars
FRONTEND_URL=https://your-frontend-domain.com
ADMIN_URL=https://your-admin-domain.com
```

**⚠️ IMPORTANT SECURITY NOTES:**
- JWT_SECRET must be at least 32 characters in production
- Never commit `.env` file to version control
- Use strong, randomly generated secrets

### 3. Validate Environment

```bash
npm run validate
```

This checks all required environment variables are set.

## 🏗️ Building for Production

```bash
npm run build
```

This validates your configuration and prepares for production deployment.

## 🚀 Running in Production

### Option 1: Direct Node (Simple)

```bash
npm run start:prod
```

### Option 2: PM2 (Recommended for Production)

PM2 provides process management, auto-restart, load balancing, and monitoring.

#### Install PM2 globally:

```bash
npm install -g pm2
```

#### Start with PM2:

```bash
# Start in cluster mode (uses all CPU cores)
pm2 start ecosystem.config.js --env production

# View logs
pm2 logs wishstone-backend

# Monitor
pm2 monit

# Restart
pm2 restart wishstone-backend

# Stop
pm2 stop wishstone-backend

# Auto-start on system reboot
pm2 startup
pm2 save
```

## 🔒 Security Features

The production build includes:

- **Helmet.js**: Security headers protection
- **Rate Limiting**: Prevents brute force attacks (100 req/15min per IP)
- **CORS**: Configured for specific domains only
- **XSS Protection**: Sanitizes user input
- **NoSQL Injection Protection**: Sanitizes MongoDB queries
- **Compression**: Gzip compression for responses
- **Request Logging**: Morgan logger for access logs
- **Error Handling**: Comprehensive error handling with stack traces hidden in production

## 📊 Monitoring & Health Checks

### Health Check Endpoint

```bash
GET /health
```

Returns server status, uptime, and MongoDB connection state.

### Logs

- Development: Console output with colored formatting
- Production: Structured logs (can be piped to file or logging service)

With PM2:
```bash
pm2 logs wishstone-backend
```

## 🌐 Deployment Platforms

### Heroku

```bash
# Install Heroku CLI
heroku login
heroku create wishstone-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set FRONTEND_URL=your-frontend-url

# Deploy
git push heroku main
```

### DigitalOcean / AWS / VPS

1. SSH into your server
2. Install Node.js and PM2
3. Clone repository
4. Configure `.env` file
5. Run `npm install --production`
6. Start with PM2: `pm2 start ecosystem.config.js --env production`
7. Configure Nginx as reverse proxy (optional)

### Nginx Reverse Proxy Configuration

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Docker (Optional)

Create `Dockerfile`:

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "run", "start:prod"]
```

Build and run:

```bash
docker build -t wishstone-backend .
docker run -p 5000:5000 --env-file .env wishstone-backend
```

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test API
curl http://localhost:5000/api
```

## 🔄 Graceful Shutdown

The server handles graceful shutdown on SIGTERM/SIGINT:
- Stops accepting new connections
- Completes ongoing requests
- Closes MongoDB connection
- Exits cleanly

## 📝 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| NODE_ENV | Yes | Environment mode | production |
| PORT | Yes | Server port | 5000 |
| MONGO_URI | Yes | MongoDB connection string | mongodb+srv://... |
| JWT_SECRET | Yes | JWT signing secret (32+ chars) | your-secret-key |
| FRONTEND_URL | Yes | Frontend domain (CORS) | https://example.com |
| ADMIN_URL | No | Admin panel domain (CORS) | https://admin.example.com |

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Issues

- Check MONGO_URI is correct
- Verify MongoDB Atlas IP whitelist includes your server IP
- Check network connectivity

### Environment Variable Errors

Run validation:
```bash
npm run validate
```

## 📞 Support

For issues or questions, check the logs:
```bash
pm2 logs wishstone-backend --lines 100
```

---

**🎉 Your Wishstone Backend is now production-ready!**
