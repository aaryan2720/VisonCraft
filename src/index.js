const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { apiLimiter, logRequest, logError } = require('./middleware');

const app = express();

// Security and standard middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Custom middleware
app.use(logRequest);
app.use('/api', apiLimiter);

// Route handlers
app.use('/api/auth', require('./routes/auth').router);
app.use('/api/services', require('./routes/services'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/crm', require('./routes/crm'));
app.use('/api/checkout', require('./routes/checkout'));
app.use('/api/applications', require('./routes/applications'));

// MongoDB connection configuration
const MAX_RETRY_ATTEMPTS = 5;
const INITIAL_RETRY_DELAY = 1000;
const MAX_RETRY_DELAY = 30000;

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('connected', () => {
  console.info('Successfully connected to MongoDB');
});

mongoose.connection.on('reconnected', () => {
  console.info('MongoDB reconnected');
});

// MongoDB connection with retry logic
const connectWithRetry = async (retryCount = 0) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/visioncraft', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  } catch (err) {
    if (retryCount >= MAX_RETRY_ATTEMPTS) {
      console.error('Failed to connect to MongoDB after maximum retry attempts');
      process.exit(1);
    }
    const delay = Math.min(INITIAL_RETRY_DELAY * Math.pow(2, retryCount), MAX_RETRY_DELAY);
    console.warn(`MongoDB connection attempt ${retryCount + 1} failed. Retrying in ${delay}ms...`);
    setTimeout(() => connectWithRetry(retryCount + 1), delay);
  }
};

connectWithRetry();

// Error logging middleware
app.use(logError);

// Fallback error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong! Please try again later.';

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
