const express = require('express');
const { upload, uploadToS3, generateSignedUrl } = require('../utils/fileUpload');
const { protect } = require('./auth');
const router = express.Router();

// Upload a document
router.post('/upload', protect, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    // Upload file to S3
    const key = await uploadToS3(req.file, 'documents');

    // Generate signed URL for immediate access
    const url = await generateSignedUrl(key);

    res.status(200).json({
      status: 'success',
      data: {
        name: req.file.originalname,
        url,
        key,
        type: req.file.mimetype,
        uploadedBy: req.user._id
      }
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ status: 'error', message: 'Error uploading document' });
  }
});

// Get document URL
router.get('/:key', protect, async (req, res) => {
  try {
    const url = await generateSignedUrl(req.params.key);
    res.status(200).json({ status: 'success', data: { url } });
  } catch (error) {
    console.error('Error generating document URL:', error);
    res.status(500).json({ status: 'error', message: 'Error accessing document' });
  }
});

module.exports = router;