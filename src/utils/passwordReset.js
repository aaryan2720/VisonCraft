const crypto = require('crypto');
const User = require('../models/User');
const notificationService = require('./notificationService');
const logger = require('./logger');

class PasswordResetService {
  constructor() {
    this.tokenExpiryHours = 24;
  }

  async generateResetToken() {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(32, (err, buffer) => {
        if (err) {
          logger.error('Error generating reset token:', err);
          reject(err);
        }
        resolve(buffer.toString('hex'));
      });
    });
  }

  async createResetToken(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      const resetToken = await this.generateResetToken();
      const resetTokenExpiry = new Date(Date.now() + this.tokenExpiryHours * 60 * 60 * 1000);

      user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;
      await user.save();

      await this.sendResetEmail(user.email, resetToken);
      logger.info(`Password reset token generated for user: ${email}`);

      return true;
    } catch (error) {
      logger.error(`Error creating reset token for ${email}:`, error);
      throw error;
    }
  }

  async verifyAndResetPassword(resetToken, newPassword) {
    try {
      const user = await User.findOne({
        resetToken,
        resetTokenExpiry: { $gt: Date.now() }
      });

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      user.password = newPassword;
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();

      await this.sendPasswordChangeConfirmation(user.email);
      logger.info(`Password reset successful for user: ${user.email}`);

      return true;
    } catch (error) {
      logger.error('Error resetting password:', error);
      throw error;
    }
  }

  async sendResetEmail(email, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link will expire in ${this.tokenExpiryHours} hours.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    try {
      await notificationService.emailService.transporter.sendMail(mailOptions);
      logger.info(`Password reset email sent to ${email}`);
    } catch (error) {
      logger.error(`Error sending password reset email to ${email}:`, error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendPasswordChangeConfirmation(email) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Password Changed Successfully',
      html: `
        <h2>Password Changed</h2>
        <p>Your password has been successfully changed.</p>
        <p>If you didn't make this change, please contact our support team immediately.</p>
      `
    };

    try {
      await notificationService.emailService.transporter.sendMail(mailOptions);
      logger.info(`Password change confirmation email sent to ${email}`);
    } catch (error) {
      logger.error(`Error sending password change confirmation to ${email}:`, error);
      throw new Error('Failed to send password change confirmation');
    }
  }
}

module.exports = new PasswordResetService();