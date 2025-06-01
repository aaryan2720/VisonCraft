const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validationMiddleware');

const router = express.Router();

// Define validation rules
const registerValidation = [
  check('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters')
    .trim(),
  check('emailOrPhone')
    .notEmpty()
    .withMessage('Email or phone number is required')
    .trim(),
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  check('confirmPassword')
    .notEmpty()
    .withMessage('Please confirm your password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  check('userType')
    .notEmpty()
    .withMessage('User type is required')
    .isIn(['email', 'phone'])
    .withMessage('Invalid user type')
];

// Apply validation middleware correctly
router.post(
  '/register',
  validate(registerValidation),
  authController.register
);
router.post(
  '/login',
  validate([ // Wrap validation rules in an array
    check('emailOrPhone')
      .notEmpty()
      .withMessage('Email or phone number is required'),
    check('password')
      .notEmpty()
      .withMessage('Password is required')
  ]),
  authController.login
);
module.exports = router;