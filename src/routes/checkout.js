const express = require('express');
const router = express.Router();
const { checkoutLimiter } = require('../middleware');
const { protect } = require('./auth');
const CheckoutService = require('../utils/checkout');

// Initialize checkout process
router.post('/process', checkoutLimiter, protect, async (req, res) => {
  try {
    const { services, paymentMethod, billingAddress, scheduledDate } = req.body;

    const checkoutResult = await CheckoutService.processCheckout({
      customer: req.user._id,
      services,
      paymentMethod,
      billingAddress,
      scheduledDate
    });

    res.status(200).json({
      status: 'success',
      data: {
        clientSecret: checkoutResult.clientSecret,
        order: checkoutResult.order,
        crm: checkoutResult.crm
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Confirm checkout after successful payment
router.post('/confirm/:orderId', protect, async (req, res) => {
  try {
    const order = await CheckoutService.confirmCheckout(req.params.orderId);

    res.status(200).json({
      status: 'success',
      data: { order }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;