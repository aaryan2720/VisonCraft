const cron = require('node-cron');
const Order = require('../models/Order');
const User = require('../models/User');
const notificationService = require('./notificationService');
const logger = require('./logger');

class TaskScheduler {
  constructor() {
    this.initializeScheduledTasks();
  }

  initializeScheduledTasks() {
    // Schedule appointment reminders check every hour
    cron.schedule('0 * * * *', () => {
      this.sendAppointmentReminders();
    });

    // Schedule daily system maintenance tasks
    cron.schedule('0 0 * * *', () => {
      this.cleanupExpiredTokens();
      this.archiveOldRecords();
    });
  }

  async sendAppointmentReminders() {
    try {
      const now = new Date();
      const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const upcomingAppointments = await Order.find({
        scheduledDate: {
          $gt: now,
          $lt: twentyFourHoursFromNow
        },
        status: { $in: ['confirmed', 'in-progress'] }
      }).populate('customer');

      for (const appointment of upcomingAppointments) {
        try {
          await notificationService.sendAppointmentReminder(appointment, appointment.customer);
          logger.info(`Appointment reminder sent for order ${appointment.invoiceNumber}`);
        } catch (error) {
          logger.error(`Failed to send appointment reminder for order ${appointment.invoiceNumber}: ${error.message}`);
        }
      }
    } catch (error) {
      logger.error('Error in sendAppointmentReminders:', error);
    }
  }

  async cleanupExpiredTokens() {
    try {
      const result = await User.updateMany(
        {
          resetTokenExpiry: { $lt: new Date() }
        },
        {
          $unset: {
            resetToken: 1,
            resetTokenExpiry: 1
          }
        }
      );

      logger.info(`Cleaned up ${result.modifiedCount} expired reset tokens`);
    } catch (error) {
      logger.error('Error in cleanupExpiredTokens:', error);
    }
  }

  async archiveOldRecords() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
      // Archive completed orders
      const completedOrders = await Order.find({
        status: 'completed',
        updatedAt: { $lt: thirtyDaysAgo }
      });

      // Here you would implement your archiving logic
      // For example, moving to a different collection or marking as archived

      logger.info(`Archived ${completedOrders.length} old orders`);
    } catch (error) {
      logger.error('Error in archiveOldRecords:', error);
    }
  }

  scheduleCustomReminder(date, callback) {
    const cronExpression = this.dateToCronExpression(date);
    return cron.schedule(cronExpression, callback);
  }

  dateToCronExpression(date) {
    return `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;
  }
}

module.exports = new TaskScheduler();