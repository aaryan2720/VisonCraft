const PaymentService = require('./payment');
const Order = require('../models/Order');
const CRM = require('../models/CRM');
const InvoiceService = require('./invoice');
const EmailService = require('./emailService');
const Logger = require('./logger');

class CheckoutService {
  static async processCheckout({
    customer,
    services,
    paymentMethod,
    billingAddress,
    scheduledDate
  }) {
    try {
      // Calculate total amount
      const totalAmount = services.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);

      // Create payment intent
      const paymentIntent = await PaymentService.createPaymentIntent(totalAmount);

      // Create order
      const order = await Order.create({
        customer,
        services,
        totalAmount,
        paymentMethod,
        billingAddress,
        scheduledDate,
        paymentStatus: 'unpaid',
        status: 'pending',
        paymentDetails: {
          transactionId: paymentIntent.id
        }
      });

      // Create CRM record
      const crm = await CRM.create({
        customer,
        relatedOrder: order._id,
        stage: 'confirm',
        type: 'order',
        status: 'active',
        notes: `New order created with invoice number: ${order.invoiceNumber}`
      });

      // Send order confirmation email
      await EmailService.sendOrderConfirmation(order, customer);
      Logger.info('Order confirmation email sent', { orderId: order._id });

      return {
        order,
        crm,
        clientSecret: paymentIntent.client_secret
      };
    } catch (error) {
      throw new Error(`Checkout processing failed: ${error.message}`);
    }
  }

  static async confirmCheckout(orderId) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      // Confirm payment
      const paymentIntent = await PaymentService.confirmPayment(
        order.paymentDetails.transactionId
      );

      if (paymentIntent.status === 'succeeded') {
        // Update order status
        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        order.paymentDetails.paymentDate = new Date();
        order.paymentDetails.receiptUrl = paymentIntent.charges.data[0]?.receipt_url;
        await order.save();

        // Generate invoice
        const invoice = await InvoiceService.generateInvoice(order);
        order.invoiceUrl = invoice.url;
        await order.save();

        // Update CRM record
        await CRM.findOneAndUpdate(
          { relatedOrder: order._id },
          {
            stage: 'process',
            $push: {
              stageHistory: {
                stage: 'process',
                remarks: 'Payment confirmed, order processing initiated'
              }
            }
          }
        );

        // Send payment receipt email
        await EmailService.sendPaymentReceipt(order, customer);
        Logger.info('Payment receipt email sent', { orderId: order._id });

        return order;
      } else {
        throw new Error('Payment confirmation failed');
      }
    } catch (error) {
      throw new Error(`Checkout confirmation failed: ${error.message}`);
    }
  }
}

module.exports = CheckoutService;