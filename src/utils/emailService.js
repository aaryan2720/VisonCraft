const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  async sendOrderConfirmation(order, customer) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: customer.email,
      subject: `Order Confirmation #${order.invoiceNumber}`,
      html: `
        <h2>Thank you for your order!</h2>
        <p>Your order #${order.invoiceNumber} has been confirmed.</p>
        <h3>Order Details:</h3>
        <ul>
          ${order.services.map(service => `
            <li>${service.name} x ${service.quantity} - $${service.price * service.quantity}</li>
          `).join('')}
        </ul>
        <p>Total Amount: $${order.totalAmount}</p>
        <p>Scheduled Date: ${order.scheduledDate}</p>
      `
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendPaymentReceipt(order, customer) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: customer.email,
      subject: `Payment Receipt for Order #${order.invoiceNumber}`,
      html: `
        <h2>Payment Received</h2>
        <p>We've received your payment for order #${order.invoiceNumber}.</p>
        <p>Amount Paid: $${order.totalAmount}</p>
        <p>Payment Date: ${order.paymentDetails.paymentDate}</p>
        ${order.paymentDetails.receiptUrl ? 
          `<p><a href="${order.paymentDetails.receiptUrl}">View Receipt</a></p>` : ''}
        ${order.invoiceUrl ? 
          `<p><a href="${order.invoiceUrl}">Download Invoice</a></p>` : ''}
      `
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendOrderStatusUpdate(order, customer, status) {
    const statusMessages = {
      'processing': 'Your order is being processed',
      'completed': 'Your order has been completed',
      'cancelled': 'Your order has been cancelled'
    };

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: customer.email,
      subject: `Order Status Update #${order.invoiceNumber}`,
      html: `
        <h2>Order Status Update</h2>
        <p>${statusMessages[status] || `Order status: ${status}`}</p>
        <p>Order #${order.invoiceNumber}</p>
        <p>Current Status: ${status}</p>
      `
    };

    return this.transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailService();