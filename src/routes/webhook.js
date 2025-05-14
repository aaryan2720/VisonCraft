const express = require('express');
const router = express.Router();
const WebhookHandler = require('../utils/webhookHandler');
const logger = require('../utils/logger');

const webhookHandler = new WebhookHandler();

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  if (!sig) {
    logger.warn('Missing Stripe signature');
    return res.status(400).json({ error: 'Missing signature' });
  }

  try {
    // Verify webhook signature
    const event = await webhookHandler.verifyStripeSignature(req.body, sig);

    // Check for duplicate events
    if (await webhookHandler.isEventProcessed(event.id)) {
      logger.info(`Duplicate webhook event received: ${event.id}`);
      return res.json({ received: true, status: 'duplicate' });
    }

    // Handle the event
    await WebhookHandler.handleStripeEvent(event);

    // Mark event as processed
    await webhookHandler.markEventProcessed(event.id);

    logger.info(`Successfully processed webhook event: ${event.id}, type: ${event.type}`);
    res.json({ received: true, status: 'success' });
  } catch (err) {
    const errorDetails = {
      error: err.message,
      eventId: req.body?.id,
      eventType: req.body?.type,
      stack: err.stack
    };

    logger.error('Webhook Error:', errorDetails);

    if (err.message === 'Invalid signature') {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    res.status(400).json({
      error: 'Webhook processing failed',
      message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
    });
  }
});

module.exports = router;