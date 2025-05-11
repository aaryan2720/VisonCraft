const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');
const logger = require('./logger');

const MAX_RETRY_ATTEMPTS = 5;
const INITIAL_RETRY_DELAY = 1000;
const MAX_RETRY_DELAY = 30000;

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    if (times > MAX_RETRY_ATTEMPTS) {
      return null; // Stop retrying after max attempts
    }
    const delay = Math.min(
      INITIAL_RETRY_DELAY * Math.pow(2, times - 1),
      MAX_RETRY_DELAY
    );
    logger.warn(`Redis connection attempt ${times}, retrying in ${delay}ms`);
    return delay;
  },
  maxRetriesPerRequest: MAX_RETRY_ATTEMPTS
});

let redisAvailable = false;
let redisStore = null;

redisClient.on('error', (err) => {
  logger.error('Redis connection error:', { error: err.message });
  redisAvailable = false;
  redisStore = null;
});

redisClient.on('connect', () => {
  logger.info('Successfully connected to Redis');
});

redisClient.on('ready', () => {
  logger.info('Redis client is ready to handle requests');
  redisAvailable = true;
  redisStore = new RedisStore({
    client: redisClient,
    prefix: 'rl:',
    resetExpiryOnChange: true
  });
});

redisClient.on('reconnecting', () => {
  logger.info('Reconnecting to Redis...');
});

redisClient.on('end', () => {
  logger.warn('Redis connection ended');
  redisAvailable = false;
  redisStore = null;
});


const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    store: redisStore
  };

  if (!redisAvailable) {
    logger.warn('Redis unavailable, falling back to memory store for rate limiting');
  }

  return rateLimit({
    ...defaultOptions,
    ...options
  });
};

// Different rate limiters for different endpoints
const limiters = {
  // Authentication endpoints
  auth: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per 15 minutes
    message: 'Too many login attempts, please try again later.'
  }),

  // API endpoints
  api: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 60 // 60 requests per minute
  }),

  // Checkout endpoints
  checkout: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 30 // 30 checkout attempts per hour
  }),

  // File upload endpoints
  upload: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50 // 50 uploads per hour
  })
};

module.exports = limiters;