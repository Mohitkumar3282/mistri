import express from 'express';
import multer from 'multer';
import {
  uploadImage,
  uploadBase64,
  deleteImage,
  getCloudinaryStatus,
} from '../controllers/uploadController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Configure multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image files and PDF documents are supported'), false);
    }
  },
});

// Routes
router.get('/status', getCloudinaryStatus);

// Uploads consume paid storage, so they require a signed-in user.
router.post('/image', protect, upload.single('file'), uploadImage);
router.post('/base64', protect, uploadBase64);
router.delete('/', protect, authorize('admin'), deleteImage);

export default router;
