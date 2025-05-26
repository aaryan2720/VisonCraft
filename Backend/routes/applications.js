const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Application = require('../models/Application');
const { Service } = require('../models/Service');
const { protect } = require('./auth');
const { uploadToCloudinary } = require('../config/cloudinary');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, PDF, and DOC files are allowed.'));
    }
  }
});

// Create new application
router.post('/', upload.array('documents', 5), async (req, res) => {
  try {
    console.log('Received application submission:', {
      body: req.body,
      bodyType: typeof req.body,
      contentType: req.headers['content-type'],
      files: req.files ? req.files.length : 0
    });

    if (!req.body || typeof req.body !== 'object') {
      console.log('Invalid request body format:', {
        body: req.body,
        bodyType: typeof req.body
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid request format. Expected application data in request body.'
      });
    }
    const {
      serviceId,
      fullName,
      email,
      phoneNumber,
      postalCode,
      address,
      city,
      state,
      preferredDate,
      preferredTime,
      amount
    } = req.body;

    // Validate required fields
    const requiredFields = ['serviceId', 'fullName', 'phoneNumber', 'postalCode', 'address'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log('Validation failed - Missing fields:', {
        missingFields,
        receivedFields: Object.keys(req.body)
      });
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        receivedFields: Object.keys(req.body)
      });
    }

    // Validate phone number format
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format. Must be 10 digits.'
      });
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate date format
    if (preferredDate && isNaN(new Date(preferredDate).getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    // Find service by ID or code
    const service = await Service.findOne({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(serviceId) ? serviceId : null },
        { code: serviceId }
      ]
    });

    if (!service) {
      console.log('Service not found:', { 
        serviceId,
        isValidObjectId: mongoose.Types.ObjectId.isValid(serviceId)
      });
      return res.status(404).json({
        success: false,
        message: 'Service not found. Please check the service ID or code.',
        debug: {
          providedId: serviceId,
          isValidObjectId: mongoose.Types.ObjectId.isValid(serviceId)
        }
      });
    }

    // Upload documents to Cloudinary if present
    const uploadedDocuments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer);
        uploadedDocuments.push({
          name: file.originalname,
          url: result.url,
          type: file.mimetype
        });
      }
    }

    const application = new Application({
      service: service._id, // Use the found service's ObjectId
      customer: {
        fullName,
        email,
        phoneNumber
      },
      address: {
        postalCode,
        city,
        state,
        fullAddress: address
      },
      appointment: {
        date: new Date(preferredDate),
        time: preferredTime
      },
      documents: uploadedDocuments,
      amount: parseFloat(amount),
      termsAccepted: true,
      policyAccepted: true
    });

    await application.save();
    
    // Populate service details
    await application.populate('service');

    res.status(201).json({
      success: true,
      data: application,
      message: 'Application submitted successfully',
      redirect: {
        to: '/dashboard',
        message: 'Redirecting to dashboard...'
      }
    });
  } catch (error) {
    console.error('Application submission error:', {
      error: error.message,
      stack: error.stack,
      validationErrors: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : null
    });

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.keys(error.errors).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {})
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: error.message
    });
  }
});

// Get application by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('service');
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error retrieving application'
    });
  }
});

module.exports = router;