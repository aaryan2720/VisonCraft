const express = require('express');
const { Category, Service } = require('../models/Service');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Initialize default services
async function initializeDefaultServices() {
  try {
    // Create default category if not exists
    let documentCategory = await Category.findOne({ name: 'Document Services' });
    if (!documentCategory) {
      documentCategory = await Category.create({
        name: 'Document Services',
        description: 'Government document related services',
        active: true
      });
    }

    // Default services configuration
    const defaultServices = [
      {
        code: 'pancard',
        name: 'PAN Card Application',
        description: 'Apply for a new PAN card or make corrections to your existing PAN card details.',
        price: 500,
        duration: 20,
        features: [
          { name: 'Online Application', included: true },
          { name: 'Document Verification', included: true },
          { name: 'Digital Copy', included: true }
        ],
        requirements: ['Valid ID Proof', 'Address Proof', 'Passport Size Photo']
      },
      {
        code: 'aadharcard',
        name: 'Aadhar Card',
        description: 'Update your Aadhar card details or apply for a new Aadhar card.',
        price: 200,
        duration: 10,
        features: [
          { name: 'Online Application', included: true },
          { name: 'Biometric Verification', included: true },
          { name: 'Digital Copy', included: true }
        ],
        requirements: ['Valid ID Proof', 'Address Proof', 'Biometric Data']
      },
      {
        code: 'voterid',
        name: 'Voter ID',
        description: 'Register for a new Voter ID card or update your existing voter information.',
        price: 300,
        duration: 25,
        features: [
          { name: 'Online Registration', included: true },
          { name: 'Address Verification', included: true },
          { name: 'Digital Copy', included: true }
        ],
        requirements: ['Age Proof', 'Address Proof', 'Passport Size Photo']
      },
      {
        code: 'passport',
        name: 'Passport',
        description: 'Apply for a new passport, renew your existing passport or apply for passport services.',
        price: 1500,
        duration: 45,
        features: [
          { name: 'Online Application', included: true },
          { name: 'Document Verification', included: true },
          { name: 'Police Verification', included: true }
        ],
        requirements: ['Birth Certificate', 'Address Proof', 'ID Proof', 'Passport Size Photos']
      },
      {
        code: 'drivinglicense',
        name: 'Driving License',
        description: 'Apply for a new driving license or renew your existing driving license.',
        price: 800,
        duration: 20,
        features: [
          { name: 'Online Application', included: true },
          { name: 'Test Scheduling', included: true },
          { name: 'Digital Copy', included: true }
        ],
        requirements: ['Age Proof', 'Address Proof', 'Medical Certificate', 'Learner\'s License']
      },
      {
        code: 'incometax',
        name: 'Income Tax Return',
        description: 'File your income tax returns with expert assistance and guidance.',
        price: 1000,
        duration: 5,
        features: [
          { name: 'Online Filing', included: true },
          { name: 'Expert Review', included: true },
          { name: 'Digital Copy', included: true }
        ],
        requirements: ['PAN Card', 'Form 16', 'Investment Proofs', 'Bank Statements']
      },
      {
        code: 'birthcertificate',
        name: 'Birth Certificate',
        description: 'Apply for a birth certificate or get a duplicate copy of your birth certificate.',
        price: 400,
        duration: 15,
        features: [
          { name: 'Online Application', included: true },
          { name: 'Document Verification', included: true },
          { name: 'Digital Copy', included: true }
        ],
        requirements: ['Hospital Record', 'Parents\'s ID Proof', 'Address Proof']
      },
      {
        code: 'propertyregistration',
        name: 'Property Registration',
        description: 'Register your property documents and complete all legal formalities.',
        price: 2500,
        duration: 30,
        features: [
          { name: 'Document Review', included: true },
          { name: 'Legal Verification', included: true },
          { name: 'Registration Process', included: true }
        ],
        requirements: ['Property Documents', 'ID Proof', 'Address Proof', 'Tax Receipts']
      }
    ];

    // Create or update each service
    for (const serviceData of defaultServices) {
      const existingService = await Service.findOne({ code: serviceData.code });
      if (!existingService) {
        await Service.create({
          ...serviceData,
          category: documentCategory._id,
          active: true
        });
        console.log(`${serviceData.name} service created`);
      }
    }
  } catch (error) {
    console.error('Error initializing default services:', error);
  }
}

// Call initialization on startup
initializeDefaultServices();

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