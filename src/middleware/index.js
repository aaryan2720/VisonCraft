const rateLimiter = require('../utils/rateLimiter');
const Logger = require('../utils/logger');

module.exports = {
  // Rate limiting middleware
  authLimiter: rateLimiter.auth,
  apiLimiter: rateLimiter.api,
  checkoutLimiter: rateLimiter.checkout,
  uploadLimiter: rateLimiter.upload,

  // Logging middleware
  logRequest: Logger.logAPIRequest,
  logError: Logger.logError
};