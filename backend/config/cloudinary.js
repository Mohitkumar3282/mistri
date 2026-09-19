import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'wj934vih',
  api_key: process.env.CLOUDINARY_API_KEY || '951352839961256',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'ENaD5cmuOkaztf-MFjNKSKnO3WM',
  secure: true,
});

export default cloudinary;
