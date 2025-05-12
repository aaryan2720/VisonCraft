const emailService = require('./emailService');
const logger = require('./logger');

class NotificationService {
  constructor() {
    this.emailService = emailService;
  }

  async sendRegistrationConfirmation(user) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: user.email,
        subject: 'Welcome to VisionCraft - Registration Confirmation',
        html: `
          <h2>Welcome to VisionCraft, ${user.firstName}!</h2>
          <p>Thank you for registering with us. Your account has been successfully created.</p>
          <p>You can now log in to access our services and manage your appointments.</p>
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
        `
      };

      await this.emailService.transporter.sendMail(mailOptions);
      logger.info(`Registration confirmation email sent to ${user.email}`);
    } catch (error) {
      logger.error(`Failed to send registration confirmation email to ${user.email}: ${error.message}`);
      throw new Error('Failed to send registration confirmation email');
    }
  }

  async sendAppointmentReminder(order, customer) {
    try {
      const appointmentDate = new Date(order.scheduledDate);
      const formattedDate = appointmentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: customer.email,
        subject: `Appointment Reminder - ${formattedDate}`,
        html: `
          <h2>Appointment Reminder</h2>
          <p>Dear ${customer.firstName},</p>
          <p>This is a reminder for your upcoming appointment:</p>
          <p><strong>Date and Time:</strong> ${formattedDate}</p>
          <h3>Services:</h3>
          <ul>
            ${order.services.map(service => `
              <li>${service.name}</li>
            `).join('')}
          </ul>
          <p>If you need to reschedule or have any questions, please contact us as soon as possible.</p>
        `
      };

      await this.emailService.transporter.sendMail(mailOptions);
      logger.info(`Appointment reminder sent to ${customer.email} for order ${order.invoiceNumber}`);
    } catch (error) {
      logger.error(`Failed to send appointment reminder to ${customer.email}: ${error.message}`);
      throw new Error('Failed to send appointment reminder');
    }
  }

  async sendStatusUpdate(order, customer, oldStatus, newStatus) {
    try {
      const statusMessages = {
        'confirmed': 'Your order has been confirmed and is being processed',
        'in-progress': 'Work on your order has begun',
        'completed': 'Your order has been completed',
        'cancelled': 'Your order has been cancelled'
      };

      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: customer.email,
        subject: `Order Status Update - #${order.invoiceNumber}`,
        html: `
          <h2>Order Status Update</h2>
          <p>Dear ${customer.firstName},</p>
          <p>${statusMessages[newStatus] || `Your order status has been updated to: ${newStatus}`}</p>
          <h3>Order Details:</h3>
          <p><strong>Order Number:</strong> #${order.invoiceNumber}</p>
          <p><strong>Previous Status:</strong> ${oldStatus}</p>
          <p><strong>New Status:</strong> ${newStatus}</p>
          <p><strong>Services:</strong></p>
          <ul>
            ${order.services.map(service => `
              <li>${service.name}</li>
            `).join('')}
          </ul>
          <p>If you have any questions about this update, please don't hesitate to contact us.</p>
        `
      };

      await this.emailService.transporter.sendMail(mailOptions);
      logger.info(`Status update email sent to ${customer.email} for order ${order.invoiceNumber}`);
    } catch (error) {
      logger.error(`Failed to send status update email to ${customer.email}: ${error.message}`);
      throw new Error('Failed to send status update email');
    }
  }
}

module.exports = new NotificationService();