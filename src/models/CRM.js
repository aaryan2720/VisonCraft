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
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  stage: {
    type: String,
    required: true,
    enum: ['confirm', 'process', 'second_stage', 'final_stage']
  }
});

const stageHistorySchema = new mongoose.Schema({
  stage: {
    type: String,
    required: true,
    enum: ['confirm', 'process', 'second_stage', 'final_stage']
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  remarks: String,
  changedAt: {
    type: Date,
    default: Date.now
  }
});

const crmSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['inquiry', 'feedback', 'complaint', 'support', 'other']
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  currentStage: {
    type: String,
    required: true,
    enum: ['confirm', 'process', 'second_stage', 'final_stage'],
    default: 'confirm'
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  relatedService: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: false
  },
  documents: [documentSchema],
  stageHistory: [stageHistorySchema],
  stageData: {
    confirm: {
      verifiedAt: Date,
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    process: {
      processedAt: Date,
      processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      processNotes: String
    },
    second_stage: {
      reviewedAt: Date,
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      reviewNotes: String
    },
    final_stage: {
      completedAt: Date,
      completedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      completionNotes: String
    }
  },
  notes: [{
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  resolution: {
    content: String,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date
  }
}, {
  timestamps: true
});

// Create indexes for frequently queried fields
crmSchema.index({ customer: 1, status: 1 });
crmSchema.index({ assignedTo: 1, status: 1 });
crmSchema.index({ type: 1, priority: 1, status: 1 });

const CRM = mongoose.model('CRM', crmSchema);

module.exports = CRM;