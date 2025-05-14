const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.param,
      value: error.value,
      message: error.msg
    }));

    logger.warn('Validation errors:', {
      path: req.path,
      method: req.method,
      errors: formattedErrors
    });

    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: formattedErrors
    });
  }
  next();
};

const registerValidationRules = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .custom(async (value) => {
      const User = require('../models/User');
      const existingUser = await User.findOne({ email: value.toLowerCase() });
      if (existingUser) {
        throw new Error('This email is already registered. Please use a different email or try logging in');
      }
      return true;
    }),
  body('password')
    .trim()
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)')
    .custom((value, { req }) => {
      if (value.toLowerCase().includes(req.body.email?.toLowerCase())) {
        throw new Error('Password cannot contain your email address');
      }
      return true;
    }),
  body('firstName').trim().notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName').trim().notEmpty().withMessage('Last name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^(\+91|0)?[6789]\d{9}$/)
    .withMessage('Please enter a valid Indian mobile number (e.g., +91XXXXXXXXXX or 0XXXXXXXXXX)')
    .custom(async (value) => {
      const User = require('../models/User');
      const existingUser = await User.findOne({ phone: value });
      if (existingUser) {
        throw new Error('This phone number is already registered. Please use a different number or try logging in');
      }
      return true;
    }),
  body('dateOfBirth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isISO8601()
    .withMessage('Please provide a valid date in YYYY-MM-DD format')
    .custom((value) => {
      const dob = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      if (age < 18) {
        throw new Error('You must be at least 18 years old to register');
      }
      if (age > 120) {
        throw new Error('Please enter a valid date of birth');
      }
      if (dob > today) {
        throw new Error('Date of birth cannot be in the future');
      }
      return true;
    })
];

const loginValidationRules = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required')
];

const userValidationRules = {
  register: registerValidationRules,
  login: loginValidationRules,
  adminRegister: [
    ...registerValidationRules,
    body('role')
      .equals('admin')
      .withMessage('Invalid role for admin registration')
  ],
  adminLogin: [
    ...loginValidationRules,
    body('role')
      .equals('admin')
      .withMessage('Invalid role for admin login')
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