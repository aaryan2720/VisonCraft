const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const applicationSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  customer: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    }
  },
  address: {
    postalCode: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit postal code']
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    fullAddress: {
      type: String,
      required: true,
      trim: true
    }
  },
  appointment: {
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    }
  },
  documents: [documentSchema],
  status: {
    type: String,
    enum: ['pending', 'document_verification', 'processing', 'completed', 'rejected'],
    default: 'pending'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  termsAccepted: {
    type: Boolean,
    required: true,
    default: false
  },
  policyAccepted: {
    type: Boolean,
    required: true,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
applicationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for frequently queried fields
applicationSchema.index({ 'customer.phoneNumber': 1 });
applicationSchema.index({ 'customer.email': 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ paymentStatus: 1 });
applicationSchema.index({ createdAt: 1 });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;