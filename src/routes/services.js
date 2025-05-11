const express = require('express');
const { Category, Service } = require('../models/Service');
const { protect } = require('./auth');
const router = express.Router();

// Admin middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Admin only.'
    });
  }
  next();
};

// Validation middleware
const validateService = (req, res, next) => {
  const { name, description, category, price, duration } = req.body;
  
  if (!name || !category || !price || !duration) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide all required fields: name, category, price, and duration'
    });
  }

  if (price < 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Price must be a positive number'
    });
  }

  if (duration < 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Duration must be a positive number'
    });
  }

  next();
};

const validateCategory = (req, res, next) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({
      status: 'error',
      message: 'Category name is required'
    });
  }

  next();
};

// Category routes
router.post('/categories', protect, isAdmin, validateCategory, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { category }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({ active: true }).sort('order');
    res.status(200).json({
      status: 'success',
      data: { categories }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Service routes
router.post('/', protect, isAdmin, validateService, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { service }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Bulk update service status
router.patch('/bulk/status', protect, isAdmin, async (req, res) => {
  try {
    const { serviceIds, active } = req.body;

    if (!Array.isArray(serviceIds) || !serviceIds.length) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide an array of service IDs'
      });
    }

    const result = await Service.updateMany(
      { _id: { $in: serviceIds } },
      { $set: { active } }
    );

    res.status(200).json({
      status: 'success',
      data: { modifiedCount: result.modifiedCount }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Bulk delete services
router.delete('/bulk', protect, isAdmin, async (req, res) => {
  try {
    const { serviceIds } = req.body;

    if (!Array.isArray(serviceIds) || !serviceIds.length) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide an array of service IDs'
      });
    }

    const result = await Service.deleteMany({ _id: { $in: serviceIds } });

    res.status(200).json({
      status: 'success',
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const query = {};
    
    // Filter by active status
    if (req.query.active !== undefined) {
      query.active = req.query.active === 'true';
    } else {
      query.active = true;
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Search by name or description
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Duration range filter
    if (req.query.minDuration || req.query.maxDuration) {
      query.duration = {};
      if (req.query.minDuration) query.duration.$gte = parseInt(req.query.minDuration);
      if (req.query.maxDuration) query.duration.$lte = parseInt(req.query.maxDuration);
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await Service.countDocuments(query);

    const services = await Service.find(query)
      .populate('category', 'name')
      .sort(req.query.sort || 'name')
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: 'success',
      data: { 
        services,
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

router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('category', 'name');
    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Service not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { service }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.patch('/:id', protect, isAdmin, validateService, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name');

    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Service not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { service }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Delete service
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Service not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Delete category
router.delete('/categories/:id', protect, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;