const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
  
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only PDF and JPG files are allowed'), false);
  }
  cb(null, true);
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Middleware to handle file upload errors
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'File size exceeds 10MB limit'
      });
    }
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
  
  if (err) {
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
  next();
};

module.exports = {
  upload,
  handleUploadError
};