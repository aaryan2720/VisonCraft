const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const serviceSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    min: 0,
    comment: 'Duration in minutes'
  },
  image: {
    type: String,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  },
  features: [{
    name: String,
    included: Boolean
  }],
  requirements: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Create indexes for frequently queried fields
serviceSchema.index({ code: 1 });
serviceSchema.index({ name: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ active: 1 });
serviceSchema.index({ category: 1, active: 1 });
serviceSchema.index({ name: 'text', description: 'text' });

const Category = mongoose.model('Category', categorySchema);
const Service = mongoose.model('Service', serviceSchema);

module.exports = {
  Service,
  Category
};