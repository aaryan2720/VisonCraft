const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const WebhookHandler = require('../utils/webhookHandler');

describe('Webhook API Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Stripe Webhook', () => {
    it('should handle valid Stripe webhook event', async () => {
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test123',
            amount: 1000,
            currency: 'usd',
            status: 'succeeded'
          }
        }
      };

      // Mock Stripe webhook signature verification
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      jest.spyOn(stripe.webhooks, 'constructEvent').mockReturnValue(mockEvent);

      // Mock webhook handler
      jest.spyOn(WebhookHandler, 'handleStripeEvent').mockResolvedValue();

      const response = await request(app)
        .post('/api/webhook/stripe')
        .set('stripe-signature', 'test_signature')
        .send(mockEvent);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ received: true });
      expect(WebhookHandler.handleStripeEvent).toHaveBeenCalledWith(mockEvent);
    });

    it('should handle invalid Stripe signature', async () => {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      jest.spyOn(stripe.webhooks, 'constructEvent').mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      const response = await request(app)
        .post('/api/webhook/stripe')
        .set('stripe-signature', 'invalid_signature')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toMatch(/Webhook Error/);
    });

    it('should handle webhook processing errors', async () => {
      const mockEvent = { type: 'test.event' };
      
      // Mock successful signature verification
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      jest.spyOn(stripe.webhooks, 'constructEvent').mockReturnValue(mockEvent);

      // Mock webhook handler error
      jest.spyOn(WebhookHandler, 'handleStripeEvent').mockRejectedValue(
        new Error('Processing failed')
      );

      const response = await request(app)
        .post('/api/webhook/stripe')
        .set('stripe-signature', 'test_signature')
        .send(mockEvent);

      expect(response.status).toBe(400);
      expect(response.body).toMatch(/Webhook Error/);
    });
  });
});