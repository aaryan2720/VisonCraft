const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const CRM = require('../models/CRM');

class WebhookHandler {
  static async handleStripeEvent(event) {
    const { type, data } = event;

    switch (type) {
      case 'payment_intent.succeeded':
        await WebhookHandler.handlePaymentSuccess(data.object);
        break;

      case 'payment_intent.payment_failed':
        await WebhookHandler.handlePaymentFailure(data.object);
        break;

      case 'charge.refunded':
        await WebhookHandler.handleRefund(data.object);
        break;

      default:
        console.log(`Unhandled event type: ${type}`);
    }
  }

  static async handlePaymentSuccess(paymentIntent) {
    try {
      const order = await Order.findOne({
        'paymentDetails.transactionId': paymentIntent.id
      });

      if (!order) return;

      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      order.paymentDetails.paymentDate = new Date();
      order.paymentDetails.receiptUrl = paymentIntent.charges.data[0]?.receipt_url;
      await order.save();

      await CRM.findOneAndUpdate(
        { relatedOrder: order._id },
        {
          stage: 'process',
          $push: {
            stageHistory: {
              stage: 'process',
              remarks: 'Payment successful, order confirmed'
            }
          }
        }
      );
    } catch (error) {
      console.error('Error handling payment success:', error);
    }
  }

  static async handlePaymentFailure(paymentIntent) {
    try {
      const order = await Order.findOne({
        'paymentDetails.transactionId': paymentIntent.id
      });

      if (!order) return;

      order.paymentStatus = 'failed';
      order.status = 'payment_failed';
      await order.save();

      await CRM.findOneAndUpdate(
        { relatedOrder: order._id },
        {
          stage: 'payment_failed',
          $push: {
            stageHistory: {
              stage: 'payment_failed',
              remarks: 'Payment failed, requiring attention'
            }
          }
        }
      );
    } catch (error) {
      console.error('Error handling payment failure:', error);
    }
  }

  static async handleRefund(charge) {
    try {
      const order = await Order.findOne({
        'paymentDetails.transactionId': charge.payment_intent
      });

      if (!order) return;

      order.paymentStatus = 'refunded';
      order.status = 'refunded';
      await order.save();

      await CRM.findOneAndUpdate(
        { relatedOrder: order._id },
        {
          stage: 'refunded',
          $push: {
            stageHistory: {
              stage: 'refunded',
              remarks: 'Payment refunded to customer'
            }
          }
        }
      );
    } catch (error) {
      console.error('Error handling refund:', error);
    }
  }
}

module.exports = WebhookHandler;