const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const ApiError = require('./utils/apiError');
const globalErrorHandler = require('./middlewares/errorMiddleware');

// Load env vars
dotenv.config();

// Initialize app
const app = express();

// Middlewares
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (process.env.NODE_ENV === 'development') {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
    } else if (origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`, {
    body: req.body,
    query: req.query,
    params: req.params
  });
  next();
});

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
const applicationsRouter = require('./routes/applications');
const servicesRouter = require('./routes/services');
const { protect, authorizeEmail } = require('./middlewares/authMiddleware');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/applications', applicationsRouter);
app.use('/api/v1/services', servicesRouter);

// Protected routes with email-based access control
app.use('/api/v1/crm', protect, authorizeEmail('crmdocnish24@visioncraft.com'), applicationsRouter);
app.use('/api/v1/admin', protect, authorizeEmail('admindocnish24@visioncraft.com'), servicesRouter);

// Handle undefined routes
app.all('*', (req, res, next) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

// Connect to database and then start server
connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log('API Routes:');
      console.log('- Auth:', '/api/v1/auth');
      console.log('- Applications:', '/api/v1/applications');
      console.log('- Services:', '/api/v1/services');
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      }
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Promise Rejection:', err);
      server.close(() => {
        process.exit(1);
      });
    });
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });