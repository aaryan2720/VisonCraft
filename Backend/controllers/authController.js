const { User } = require('../models/User');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const generateToken = require('../utils/generateToken');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
  console.log('Registration attempt:', {
    name: req.body.name,
    emailOrPhone: req.body.emailOrPhone,
    userType: req.body.userType
  });

  const { name, emailOrPhone, password, confirmPassword, userType: requestedUserType } = req.body;
  
  // 1) Validate user type matches email/phone format
  let email, phone, userType;
  const isEmail = emailOrPhone.includes('@');
  const isPhone = /^\d{10}$/.test(emailOrPhone);

  if (isEmail && requestedUserType !== 'email') {
    return next(new ApiError('User type does not match email format', 400));
  }

  if (isPhone && requestedUserType !== 'phone') {
    return next(new ApiError('User type does not match phone format', 400));
  }

  // 2) Process and validate email/phone format
  if (isEmail) {
    email = emailOrPhone.toLowerCase().trim();
    userType = 'email';
    
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return next(new ApiError('Please provide a valid email address', 400));
    }
    console.log('Validated email format:', email);
  } else if (isPhone) {
    phone = emailOrPhone.trim();
    userType = 'phone';
    console.log('Validated phone format:', phone);
  } else {
    return next(new ApiError('Invalid email or phone format', 400));
  }

  // 3) Check if user already exists
  console.log('Checking for existing user with:', { email, phone, userType });
  
  const query = userType === 'email' 
    ? { email: email }
    : { phone: phone };
  
  console.log('Executing query:', query);
  const existingUser = await User.findOne(query);
  
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
  console.log('Login attempt:', { emailOrPhone });

  // 1) Check if email/phone and password exist
  if (!emailOrPhone || !password) {
    console.log('Missing credentials');
    return next(new ApiError('Please provide email/phone and password', 400));
  }

  // 2) Determine input type and format query
  const isEmail = emailOrPhone.includes('@');
  const isPhone = /^\d{10}$/.test(emailOrPhone);
  
  let query;
  if (isEmail) {
    query = { email: emailOrPhone.toLowerCase().trim() };
    console.log('Searching by email:', query);
  } else if (isPhone) {
    query = { phone: emailOrPhone.trim() };
    console.log('Searching by phone:', query);
  } else {
    console.log('Invalid email/phone format');
    return next(new ApiError('Invalid email or phone format', 400));
  }

  // 3) Check if user exists
  console.log('Executing user query:', query);
  const user = await User.findOne(query).select('+password');

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
