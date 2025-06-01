const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: [
      validator.isEmail,
      'Please provide a valid email address'
    ]
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  userType: {
    type: String,
    required: [true, 'User type is required'],
    enum: ['email', 'phone']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create compound index for email and phone
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  console.log('Pre-save middleware running, password modified:', this.isModified('password'));
  
  if (!this.isModified('password')) {
    console.log('Password not modified, skipping hashing');
    return next();
  }
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  console.log('Password hashed successfully, new length:', this.password.length);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  console.log('Password comparison details:', {
    candidatePassword,
    hashedPassword: this.password,
    candidateLength: candidatePassword.length,
    hashedLength: this.password.length,
    passwordField: Object.keys(this).includes('password'),
    passwordType: typeof this.password
  });

  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password comparison result:', {
      isMatch,
      bcryptVersion: bcrypt.version || 'unknown'
    });
    return isMatch;
  } catch (error) {
    console.error('Error during password comparison:', error);
    return false;
  }
};

// Add pre-find hooks for debugging queries
userSchema.pre(['find', 'findOne'], function() {
  console.log('Executing query:', {
    operation: this.op,
    conditions: this.getQuery(),
    collection: this.model.collection.name,
    timestamp: new Date().toISOString()
  });
});

// Create compound index for email/phone lookup optimization
userSchema.index({ email: 1, phone: 1 }, { sparse: true });

const User = mongoose.model('User', userSchema);

// Create default admin if not exists
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'crmdocnish24@visioncraft.com' }).select('+password');
    if (!adminExists) {
      const plainPassword = '123456789';
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(plainPassword, salt);
      console.log('Creating CRM_Manager with:', {
        plainPassword,
        salt,
        hashedPassword,
        hashedLength: hashedPassword.length
      });
      
      await User.create({
        name: 'Crm Docnish',
        email: 'crmdocnish24@visioncraft.com',
        password: hashedPassword,
        userType: 'email',
        isAdmin: true
      });
      console.log('Default CRM_Manager user created successfully');
    } else {
      console.log('CRM_Manager user exists:', {
        id: adminExists._id,
        email: adminExists.email,
        passwordLength: adminExists.password?.length,
        hashedPassword: adminExists.password
      });
    }
  } catch (error) {
    console.error('Error creating default CRM_Manager:', error);
  }
};

// Export both the User model and createDefaultAdmin function
module.exports = {
  User,
  createDefaultAdmin
};