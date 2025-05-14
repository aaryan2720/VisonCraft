const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const CRM = require('../models/CRM');
const Redis = require('ioredis');
const logger = require('./logger');

class WebhookHandler {
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    this.redis.on('error', (err) => {
      logger.error('Redis connection error:', err);
    });
  }

  async isEventProcessed(eventId) {
    try {
      const exists = await this.redis.get(`webhook_${eventId}`);
      return !!exists;
    } catch (error) {
      logger.error('Error checking webhook event:', error);
      return false;
    }
  }

  async markEventProcessed(eventId) {
    try {
      await this.redis.set(`webhook_${eventId}`, 'true', 'EX', 24 * 60 * 60); // Store for 24 hours
      return true;
    } catch (error) {
      logger.error('Error marking webhook event:', error);
      return false;
    }
  }

  async verifyStripeSignature(payload, signature) {
    try {
      return stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      logger.error('Webhook signature verification failed:', error);
      throw new Error('Invalid signature');
    }
  }
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
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const order = await Order.findOne({
          'paymentDetails.transactionId': paymentIntent.id
        }).session(session);

        if (!order) {
          logger.warn(`Order not found for payment intent: ${paymentIntent.id}`);
          await session.abortTransaction();
          return;
        }

        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        order.paymentDetails.paymentDate = new Date();
        order.paymentDetails.receiptUrl = paymentIntent.charges.data[0]?.receipt_url;
        await order.save({ session });

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
          },
          { session }
        );

        await session.commitTransaction();
        logger.info(`Payment success processed for order: ${order._id}`);
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    } catch (error) {
      logger.error('Error handling payment success:', { error: error.stack, paymentIntentId: paymentIntent.id });
    }
  }

  static async handlePaymentFailure(paymentIntent) {
    try {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const order = await Order.findOne({
          'paymentDetails.transactionId': paymentIntent.id
        }).session(session);

        if (!order) {
          logger.warn(`Order not found for failed payment intent: ${paymentIntent.id}`);
          await session.abortTransaction();
          return;
        }

        order.paymentStatus = 'failed';
        order.status = 'payment_failed';
        await order.save({ session });

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
          },
          { session }
        );

        await session.commitTransaction();
        logger.info(`Payment failure processed for order: ${order._id}`);
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    } catch (error) {
      logger.error('Error handling payment failure:', { error: error.stack, paymentIntentId: paymentIntent.id });
    }
  }

  static async handleRefund(charge) {
    try {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const order = await Order.findOne({
          'paymentDetails.transactionId': charge.payment_intent
        }).session(session);

        if (!order) {
          logger.warn(`Order not found for refund charge: ${charge.payment_intent}`);
          await session.abortTransaction();
          return;
        }

        order.paymentStatus = 'refunded';
        order.status = 'refunded';
        await order.save({ session });

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
          },
          { session }
        );

        await session.commitTransaction();
        logger.info(`Refund processed for order: ${order._id}`);
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    } catch (error) {
      logger.error('Error handling refund:', { error: error.stack, chargeId: charge.id });
    }
  }
}

module.exports = WebhookHandler;