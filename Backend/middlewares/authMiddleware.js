const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ApiError = require('../utils/apiError');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
  
    if (!token) {
      return next(new ApiError('Not authorized to access this route', 401));
    }
  
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      next();
    } catch (err) {
      return next(new ApiError('Not authorized to access this route', 401));
    }
  });

// Grant access to specific emails
exports.authorizeEmail = (allowedEmail) => {
  return (req, res, next) => {
    if (!req.user || req.user.email !== allowedEmail) {
      return next(
        new ApiError(
          'You are not authorized to access this route',
          403
        )
      );
    }
    next();
  };
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};