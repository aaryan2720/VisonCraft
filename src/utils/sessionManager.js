const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('./logger');

class SessionManager {
  constructor() {
    this.sessionDuration = process.env.SESSION_DURATION || '24h';
    this.refreshTokenDuration = process.env.REFRESH_TOKEN_DURATION || '7d';
  }

  async createSession(user) {
    try {
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      user.refreshToken = refreshToken;
      await user.save();

      logger.info(`Session created for user: ${user.email}`);

      return {
        accessToken,
        refreshToken,
        expiresIn: this.sessionDuration
      };
    } catch (error) {
      logger.error(`Error creating session for user ${user.email}:`, error);
      throw new Error('Failed to create session');
    }
  }

  generateAccessToken(user) {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: this.sessionDuration }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: this.refreshTokenDuration }
    );
  }

  async refreshSession(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.id);

      if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      const accessToken = this.generateAccessToken(user);
      logger.info(`Session refreshed for user: ${user.email}`);

      return {
        accessToken,
        expiresIn: this.sessionDuration
      };
    } catch (error) {
      logger.error('Error refreshing session:', error);
      throw new Error('Failed to refresh session');
    }
  }

  async invalidateSession(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      user.refreshToken = undefined;
      await user.save();

      logger.info(`Session invalidated for user: ${user.email}`);
      return true;
    } catch (error) {
      logger.error(`Error invalidating session for user ${userId}:`, error);
      throw new Error('Failed to invalidate session');
    }
  }

  async validateSession(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('+active');

      if (!user || !user.active) {
        throw new Error('Invalid session');
      }

      return {
        isValid: true,
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      logger.error('Error validating session:', error);
      return { isValid: false };
    }
  }
}

module.exports = new SessionManager();