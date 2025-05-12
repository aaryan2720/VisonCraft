const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(`Validation errors: ${JSON.stringify(errors.array())}`);
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }
  next();
};

const userValidationRules = {
  register: [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
      .matches(/[0-9]/).withMessage('Password must contain at least one number')
      .matches(/[!@#$%^&*]/).withMessage('Password must contain at least one special character'),
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('phone').optional().matches(/^\+?[1-9]\d{1,14}$/).withMessage('Invalid phone number format')
  ],
  login: [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required')
  ]
};

const orderValidationRules = [
  body('services.*.service').isMongoId().withMessage('Invalid service ID'),
  body('services.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('scheduledDate').isISO8601().toDate().withMessage('Invalid date format'),
  body('paymentMethod')
    .isIn(['credit-card', 'debit-card', 'bank-transfer', 'cash'])
    .withMessage('Invalid payment method'),
  body('billingAddress').optional().isObject().withMessage('Invalid billing address format'),
  body('notes').optional().trim().isLength({ max: 1000 }).withMessage('Notes too long')
];

const serviceValidationRules = [
  body('name').trim().notEmpty().withMessage('Service name is required'),
  body('description').trim().notEmpty().withMessage('Service description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive number'),
  body('category').isMongoId().withMessage('Invalid category ID')
];

const crmValidationRules = [
  body('customer').isMongoId().withMessage('Invalid customer ID'),
  body('status').isIn(['active', 'inactive', 'pending']).withMessage('Invalid status'),
  body('notes').optional().trim().isLength({ max: 2000 }).withMessage('Notes too long'),
  body('stage').isIn(['lead', 'prospect', 'customer']).withMessage('Invalid stage')
];

const sanitizeRequestBody = (req, res, next) => {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    }
  }
  next();
};

module.exports = {
  handleValidationErrors,
  userValidationRules,
  orderValidationRules,
  serviceValidationRules,
  crmValidationRules,
  sanitizeRequestBody
};