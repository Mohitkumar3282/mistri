import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

/**
 * @desc    Upload image file to Cloudinary via buffer stream
 * @route   POST /api/upload/image
 * @access  Public
 */
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded. Please provide an image file.' });
    }

    const folder = req.body.folder || 'mistri/general';

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary stream upload error:', error);
          return res.status(500).json({
            success: false,
            message: 'Image upload failed on Cloudinary',
            error: error.message || error,
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Image uploaded successfully to Cloudinary',
          data: {
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
            created_at: result.created_at,
          },
        });
      }
    );

    // Pipe the multer buffer stream natively
    const readableStream = Readable.from(req.file.buffer);
    readableStream.pipe(uploadStream);
  } catch (error) {
    console.error('uploadImage controller error:', error);
    next(error);
  }
};

/**
 * @desc    Upload base64/data URL or remote URL string directly to Cloudinary
 * @route   POST /api/upload/base64
 * @access  Public
 */
export const uploadBase64 = async (req, res, next) => {
  try {
    const { image, folder = 'mistri/general' } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'No image data provided' });
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: folder,
      resource_type: 'auto',
    });

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully to Cloudinary',
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        created_at: result.created_at,
      },
    });
  } catch (error) {
    console.error('uploadBase64 controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Base64 image upload failed on Cloudinary',
      error: error.message || error,
    });
  }
};

/**
 * @desc    Delete an asset from Cloudinary
 * @route   DELETE /api/upload
 * @access  Public
 */
export const deleteImage = async (req, res, next) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ success: false, message: 'public_id is required for deletion' });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    return res.status(200).json({
      success: true,
      message: 'Image deleted from Cloudinary',
      result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Cloudinary status and credentials info (masked)
 * @route   GET /api/upload/status
 * @access  Public
 */
export const getCloudinaryStatus = async (req, res) => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'wj934vih';
    const apiKey = process.env.CLOUDINARY_API_KEY || '951352839961256';
    const isConfigured = Boolean(cloudName && apiKey);

    res.json({
      success: true,
      status: isConfigured ? 'configured' : 'missing_credentials',
      provider: 'Cloudinary Media CDN',
      cloudName: cloudName,
      apiKeyMasked: apiKey ? `${apiKey.substring(0, 4)}***${apiKey.slice(-3)}` : null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
