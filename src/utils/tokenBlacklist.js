const Redis = require('ioredis');
const logger = require('./logger');

class TokenBlacklist {
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    this.redis.on('error', (err) => {
      logger.error('Redis connection error:', err);
    });
  }

  async blacklistToken(token, expiresIn) {
    try {
      await this.redis.set(`bl_${token}`, 'true', 'EX', expiresIn);
      return true;
    } catch (error) {
      logger.error('Error blacklisting token:', error);
      return false;
    }
  }

  async isBlacklisted(token) {
    try {
      const exists = await this.redis.get(`bl_${token}`);
      return !!exists;
    } catch (error) {
      logger.error('Error checking blacklisted token:', error);
      return false;
    }
  }

  async clearBlacklist() {
    try {
      const keys = await this.redis.keys('bl_*');
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
      return true;
    } catch (error) {
      logger.error('Error clearing token blacklist:', error);
      return false;
    }
  }
}

module.exports = new TokenBlacklist();