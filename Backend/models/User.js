const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { USER_TYPES } = require('../config/constants');

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
    unique: true,
    sparse: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please provide a valid email address'
    }
  },
  phone: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: 'Please provide a valid 10-digit phone number'
    }
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  userType: {
    type: String,
    enum: Object.values(USER_TYPES),
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

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

const User = mongoose.model('User', userSchema);

// Create default admin if not exists
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admindocnish24@visioncraft.com' }).select('+password');
    if (!adminExists) {
      const plainPassword = '123456789';
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(plainPassword, salt);
      console.log('Creating admin with:', {
        plainPassword,
        salt,
        hashedPassword,
        hashedLength: hashedPassword.length
      });
      
      await User.create({
        name: 'Admin',
        email: 'admindocnish24@visioncraft.com',
        password: hashedPassword,
        userType: 'email',
        isAdmin: true
      });
      console.log('Default admin user created successfully');
    } else {
      console.log('Admin user exists:', {
        id: adminExists._id,
        email: adminExists.email,
        passwordLength: adminExists.password?.length,
        hashedPassword: adminExists.password
      });
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

// Export both the User model and createDefaultAdmin function
module.exports = {
  User,
  createDefaultAdmin
};