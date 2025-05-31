const express = require('express');
const router = express.Router();

// @desc    Get all services
// @route   GET /api/v1/services
// @access  Public
router.get('/', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Services retrieved successfully',
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving services',
      error: error.message
    });
  }
});

// @desc    Create new service
// @route   POST /api/v1/services
// @access  Private/Admin
router.post('/', async (req, res) => {
  try {
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: req.body
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message
    });
  }
});

module.exports = router;