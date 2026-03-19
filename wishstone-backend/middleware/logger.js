const morgan = require('morgan');

// Custom token for response time in ms
morgan.token('response-time-ms', (req, res) => {
  if (!req._startAt || !res._startAt) return '';
  const ms = (res._startAt[0] - req._startAt[0]) * 1e3 + (res._startAt[1] - req._startAt[1]) * 1e-6;
  return ms.toFixed(2);
});

// Development logging format
const devFormat = ':method :url :status :response-time-ms ms - :res[content-length]';

// Production logging format
const prodFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

// Create logger based on environment
const createLogger = () => {
  const isDev = process.env.NODE_ENV !== 'production';
  
  if (isDev) {
    return morgan(devFormat, {
      skip: (req) => req.url === '/health' || req.url === '/favicon.ico'
    });
  }
  
  return morgan(prodFormat, {
    skip: (req) => req.url === '/health' || req.url === '/favicon.ico',
    stream: {
      write: (message) => console.log(message.trim())
    }
  });
};

module.exports = createLogger;
