const { body } = require('express-validator');
const validator = require('validator');

const validateIndianPhoneNumber = (value) => {
  const phoneRegex = /^(\+91|0)?[6789]\d{9}$/;
  return phoneRegex.test(value);
};

const validateAge = (value) => {
  const dob = new Date(value);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  return age >= 18;
};

const registrationValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .custom(async (value) => {
      const User = require('../models/User');
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        throw new Error('Email already registered');
      }
      return true;
    }),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*]/)
    .withMessage('Password must contain at least one special character'),

  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .custom(validateIndianPhoneNumber)
    .withMessage('Please provide a valid Indian phone number'),

  body('dateOfBirth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isISO8601()
    .withMessage('Please provide a valid date')
    .custom(validateAge)
    .withMessage('You must be at least 18 years old'),

  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters long'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters long')
];

const adminRegistrationValidation = [
  ...registrationValidation,
  body('adminCode')
    .notEmpty()
    .withMessage('Admin registration code is required')
    .custom(async (value) => {
      if (value !== process.env.ADMIN_REGISTRATION_CODE) {
        throw new Error('Invalid admin registration code');
      }
      return true;
    })
];

module.exports = {
  registrationValidation,
  adminRegistrationValidation
};