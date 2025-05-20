const Redis = require('ioredis');
const logger = require('../utils/logger');

class OTPService {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      retryStrategy: function(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3
    });

    this.redis.on('error', (error) => {
      logger.error('Redis OTP service error:', error);
    });

    this.redis.on('connect', () => {
      logger.info('OTP service connected to Redis');
    });
  }

  async generateOTP(identifier) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `otp_${identifier}`;
    
    // Store OTP with 5 minutes expiry
    await this.redis.set(key, otp, 'EX', 300);
    
    return otp;
  }

  async verifyOTP(identifier, otp) {
    const key = `otp_${identifier}`;
    const storedOTP = await this.redis.get(key);
    
    if (!storedOTP || storedOTP !== otp) {
      return false;
    }
    
    // Delete OTP after successful verification
    await this.redis.del(key);
    return true;
  }

  async cleanup() {
    await this.redis.quit();
  }
}

module.exports = new OTPService();