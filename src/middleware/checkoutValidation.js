const { body, param, validationResult } = require('express-validator');

const checkoutValidationRules = {
  process: [
    body('services').isArray().withMessage('Services must be an array'),
    body('services.*.id').isMongoId().withMessage('Invalid service ID'),
    body('services.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('paymentMethod').isString().notEmpty().withMessage('Payment method is required'),
    body('billingAddress').isObject().notEmpty().withMessage('Billing address is required'),
    body('billingAddress.street').isString().notEmpty().withMessage('Street address is required'),
    body('billingAddress.city').isString().notEmpty().withMessage('City is required'),
    body('billingAddress.state').isString().notEmpty().withMessage('State is required'),
    body('billingAddress.zipCode').isString().notEmpty().withMessage('Zip code is required'),
    body('scheduledDate').optional().isISO8601().withMessage('Invalid scheduled date format')
  ],
  confirm: [
    param('orderId').isMongoId().withMessage('Invalid order ID'),
    body('paymentIntentId').isString().notEmpty().withMessage('Payment intent ID is required')
  ]
};

const validateCheckout = (validations) => {
  return async (req, res, next) => {
    try {
      // Run validations
      await Promise.all(validations.map(validation => validation.run(req)));

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          errors: errors.array()
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  checkoutValidationRules,
  validateCheckout
};