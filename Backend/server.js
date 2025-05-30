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
app.use(cors());
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
const applicationsRouter = require('./routes/applications');
const servicesRouter = require('./routes/services');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/applications', applicationsRouter);
app.use('/api/v1/services', servicesRouter);

// Handle undefined routes
// app.all('*', (req, res, next) => {
//   next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

// Global error handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

// Connect to database and then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed', err);
    process.exit(1);
  });