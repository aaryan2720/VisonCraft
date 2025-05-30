const { User } = require('../models/User');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const generateToken = require('../utils/generateToken');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
  const { name, emailOrPhone, password, confirmPassword } = req.body;
  
  // 1) Check if passwords match
  if (password !== confirmPassword) {
    return next(new ApiError('Passwords do not match', 400));
  }

  // 2) Determine if input is email or phone
  let email, phone, userType;
  
  if (emailOrPhone.includes('@')) {
    email = emailOrPhone.toLowerCase().trim();
    userType = 'email';
    
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return next(new ApiError('Please provide a valid email address', 400));
    }
  } else {
    phone = emailOrPhone.trim();
    userType = 'phone';
    
    if (!/^\d{10}$/.test(phone)) {
      return next(new ApiError('Please provide a valid 10-digit phone number', 400));
    }
  }

  // 3) Check if user already exists
  const existingUser = await User.findOne({
    $or: [
      { email: userType === 'email' ? email : null },
      { phone: userType === 'phone' ? phone : null }
    ]
  });
  
  if (existingUser) {
    return next(new ApiError(
      userType === 'email' 
        ? 'Email already in use' 
        : 'Phone number already in use',
      400
    ));
  }

  // 4) Create new user
  const user = await User.create({
    name,
    email: userType === 'email' ? email : undefined,
    phone: userType === 'phone' ? phone : undefined,
    password,
    userType
  });

  // 5) Generate token and send response
  const token = generateToken(user._id);
  
  res.status(201).json({
    success: true,
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        isAdmin: user.isAdmin
      }
    }
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { emailOrPhone, password } = req.body;
  console.log('Login attempt with:', { emailOrPhone });

  // 1) Check if email/phone and password exist
  if (!emailOrPhone || !password) {
    return next(new ApiError('Please provide email/phone and password', 400));
  }

  // 2) Check if user exists
  const user = await User.findOne({
    $or: [
      { email: emailOrPhone.includes('@') ? emailOrPhone.toLowerCase() : null },
      { phone: emailOrPhone.match(/^\d+$/) ? emailOrPhone : null }
    ]
  }).select('+password');

  console.log('User found:', user ? 'Yes' : 'No');

  if (!user) {
    return next(new ApiError('Invalid credentials', 401));
  }

  // 3) Check if password is correct
  console.log('Comparing passwords...');
  const isPasswordCorrect = await user.comparePassword(password);
  console.log('Password correct:', isPasswordCorrect);

  if (!isPasswordCorrect) {
    return next(new ApiError('Invalid credentials', 401));
  }

  // 4) Generate token and send response
  const token = generateToken(user._id);
  console.log('Token generated successfully');

  res.status(200).json({
    success: true,
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        isAdmin: user.isAdmin
      }
    }
  });
});

module.exports = {
  register,
  login
};
