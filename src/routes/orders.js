const express = require('express');
const Order = require('../models/Order');
const { protect } = require('./auth');
const router = express.Router();

// Create new order
router.post('/', protect, async (req, res) => {
  try {
    const order = await Order.create({
      ...req.body,
      customer: req.user._id
    });

    await order.populate([
      { path: 'customer', select: 'firstName lastName email' },
      { path: 'services.service', select: 'name price duration' },
      { path: 'assignedStaff', select: 'firstName lastName' }
    ]);

    res.status(201).json({
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

// Get all orders (with filters)
router.get('/', protect, async (req, res) => {
  try {
    const query = {};
    
    // Filter by customer for regular users
    if (req.user.role === 'user') {
      query.customer = req.user._id;
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query.scheduledDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const orders = await Order.find(query)
      .populate([
        { path: 'customer', select: 'firstName lastName email' },
        { path: 'services.service', select: 'name price duration' },
        { path: 'assignedStaff', select: 'firstName lastName' }
      ])
      .sort('-scheduledDate');

    res.status(200).json({
      status: 'success',
      data: { orders }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate([
        { path: 'customer', select: 'firstName lastName email' },
        { path: 'services.service', select: 'name price duration' },
        { path: 'assignedStaff', select: 'firstName lastName' }
      ]);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Check if user has permission to view this order
    if (req.user.role === 'user' && order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access this order'
      });
    }

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

// Update order status
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Only staff and admin can update order status
    if (req.user.role === 'user') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update order status'
      });
    }

    order.status = status;
    await order.save();
    await order.populate([
      { path: 'customer', select: 'firstName lastName email' },
      { path: 'services.service', select: 'name price duration' },
      { path: 'assignedStaff', select: 'firstName lastName' }
    ]);

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