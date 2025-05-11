const express = require('express');
const CRM = require('../models/CRM');
const { protect } = require('./auth');
const router = express.Router();

// Create new CRM record
router.post('/', protect, async (req, res) => {
  try {
    const crm = await CRM.create({
      ...req.body,
      customer: req.user._id
    });

    await crm.populate([
      { path: 'customer', select: 'firstName lastName email' },
      { path: 'assignedTo', select: 'firstName lastName' },
      { path: 'relatedService', select: 'name' }
    ]);

    res.status(201).json({
      status: 'success',
      data: { crm }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get all CRM records (with filters)
router.get('/', protect, async (req, res) => {
  try {
    const query = {};
    const { 
      status, type, priority, stage, 
      assignedTo, relatedService,
      startDate, endDate, search,
      sortBy = '-createdAt'
    } = req.query;
    
    // Filter by customer for regular users
    if (req.user.role === 'user') {
      query.customer = req.user._id;
    }

    // Apply filters
    if (status) query.status = status;
    if (type) query.type = type;
    if (priority) query.priority = priority;
    if (stage) query.currentStage = stage;
    if (assignedTo) query.assignedTo = assignedTo;
    if (relatedService) query.relatedService = relatedService;

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Text search across subject and description
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await CRM.countDocuments(query);

    // Execute query with pagination and sorting
    const crm = await CRM.find(query)
      .populate([
        { path: 'customer', select: 'firstName lastName email' },
        { path: 'assignedTo', select: 'firstName lastName' },
        { path: 'relatedService', select: 'name' }
      ])
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: 'success',
      data: { 
        crm,
        pagination: {
          total: totalCount,
          page,
          pages: Math.ceil(totalCount / limit),
          limit
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get single CRM record
router.get('/:id', protect, async (req, res) => {
  try {
    const crm = await CRM.findById(req.params.id)
      .populate([
        { path: 'customer', select: 'firstName lastName email' },
        { path: 'assignedTo', select: 'firstName lastName' },
        { path: 'relatedService', select: 'name' },
        { path: 'notes.createdBy', select: 'firstName lastName' },
        { path: 'resolution.resolvedBy', select: 'firstName lastName' }
      ]);

    if (!crm) {
      return res.status(404).json({
        status: 'error',
        message: 'CRM record not found'
      });
    }

    // Check if user has permission to view this record
    if (req.user.role === 'user' && crm.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access this record'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { 
        crm,
        pagination: {
          total: totalCount,
          page,
          pages: Math.ceil(totalCount / limit),
          limit
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Update CRM record status
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const crm = await CRM.findById(req.params.id);

    if (!crm) {
      return res.status(404).json({
        status: 'error',
        message: 'CRM record not found'
      });
    }

    // Only staff and admin can update status
    if (req.user.role === 'user') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update record status'
      });
    }

    crm.status = status;
    await crm.save();
    await crm.populate([
      { path: 'customer', select: 'firstName lastName email' },
      { path: 'assignedTo', select: 'firstName lastName' },
      { path: 'relatedService', select: 'name' }
    ]);

    res.status(200).json({
      status: 'success',
      data: { 
        crm,
        pagination: {
          total: totalCount,
          page,
          pages: Math.ceil(totalCount / limit),
          limit
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Add note to CRM record
router.post('/:id/notes', protect, async (req, res) => {
  try {
    const crm = await CRM.findById(req.params.id);

    if (!crm) {
      return res.status(404).json({
        status: 'error',
        message: 'CRM record not found'
      });
    }

    crm.notes.push({
      content: req.body.content,
      createdBy: req.user._id
    });

    await crm.save();
    await crm.populate([
      { path: 'customer', select: 'firstName lastName email' },
      { path: 'assignedTo', select: 'firstName lastName' },
      { path: 'relatedService', select: 'name' },
      { path: 'notes.createdBy', select: 'firstName lastName' }
    ]);

    res.status(200).json({
      status: 'success',
      data: { 
        crm,
        pagination: {
          total: totalCount,
          page,
          pages: Math.ceil(totalCount / limit),
          limit
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Resolve CRM record
router.post('/:id/resolve', protect, async (req, res) => {
  try {
    const crm = await CRM.findById(req.params.id);

    if (!crm) {
      return res.status(404).json({
        status: 'error',
        message: 'CRM record not found'
      });
    }

    // Only staff and admin can resolve records
    if (req.user.role === 'user') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to resolve records'
      });
    }

    crm.status = 'resolved';
    crm.resolution = {
      content: req.body.content,
      resolvedBy: req.user._id,
      resolvedAt: new Date()
    };

    await crm.save();
    await crm.populate([
      { path: 'customer', select: 'firstName lastName email' },
      { path: 'assignedTo', select: 'firstName lastName' },
      { path: 'relatedService', select: 'name' },
      { path: 'resolution.resolvedBy', select: 'firstName lastName' }
    ]);

    res.status(200).json({
      status: 'success',
      data: { 
        crm,
        pagination: {
          total: totalCount,
          page,
          pages: Math.ceil(totalCount / limit),
          limit
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;