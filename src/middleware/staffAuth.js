const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect staff-only routes
const staffAuth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated. Please log in.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('+active');

    // Check if user exists and is active
    if (!user || !user.active) {
      return res.status(401).json({
        status: 'error',
        message: 'User no longer exists or is inactive'
      });
    }

    // Check if user is staff or admin
    if (!['staff', 'admin'].includes(user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized. Staff access required.'
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token or session expired'
    });
  }
};

module.exports = staffAuth;