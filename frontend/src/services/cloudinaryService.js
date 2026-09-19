import api from './api';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'wj934vih';

/**
 * Upload an image to Cloudinary via backend API stream (secure and reliable)
 * @param {File|Blob} file - The file to upload
 * @param {string} folder - Folder in Cloudinary (e.g. 'mistri/products', 'mistri/categories')
 * @returns {Promise<{ url: string, public_id: string }>}
 */
export const uploadToCloudinary = async (file, folder = 'mistri/general') => {
  try {
    const res = await api.uploadImage(file, folder);
    if (res && res.success && res.data?.url) {
      return {
        url: res.data.url,
        public_id: res.data.public_id,
        bytes: res.data.bytes,
      };
    }
    throw new Error(res?.message || 'Failed to get image URL from Cloudinary response');
  } catch (error) {
    console.error('Cloudinary API upload error:', error);
    throw error;
  }
};

/**
 * Upload a Base64/DataURL image to Cloudinary
 * @param {string} base64DataUrl
 * @param {string} folder
 * @returns {Promise<{ url: string, public_id: string }>}
 */
export const uploadBase64ToCloudinary = async (base64DataUrl, folder = 'mistri/general') => {
  try {
    const res = await api.uploadBase64Image(base64DataUrl, folder);
    if (res && res.success && res.data?.url) {
      return {
        url: res.data.url,
        public_id: res.data.public_id,
      };
    }
    throw new Error(res?.message || 'Failed to upload base64 to Cloudinary');
  } catch (error) {
    console.error('Cloudinary Base64 upload error:', error);
    throw error;
  }
};

/**
 * Upload a product image specifically
 */
export const uploadProductImageToCloud = async (file, productId = 'prod') => {
  return uploadToCloudinary(file, 'mistri/products');
};

/**
 * Upload a category or subcategory image
 */
export const uploadCategoryImageToCloud = async (file, categoryId = 'cat') => {
  return uploadToCloudinary(file, 'mistri/categories');
};

/**
 * Upload a user or technician avatar
 */
export const uploadAvatarToCloud = async (file, userId = 'user') => {
  return uploadToCloudinary(file, 'mistri/avatars');
};

/**
 * Upload a banner / promotional graphic
 */
export const uploadBannerToCloud = async (file) => {
  return uploadToCloudinary(file, 'mistri/banners');
};

/**
 * Helper to generate optimized Cloudinary URL transformations
 * @param {string} url - Original Cloudinary image URL
 * @param {object} options - Transformation options { width, height, crop, quality, format }
 */
export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return url;
  }

  const { width, height, crop = 'fill', quality = 'auto', format = 'auto' } = options;
  const parts = [];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  if (crop && (width || height)) parts.push(`c_${crop}`);
  if (quality) parts.push(`q_${quality}`);
  if (format) parts.push(`f_${format}`);

  if (parts.length === 0) return url;

  const transformString = parts.join(',');
  return url.replace('/image/upload/', `/image/upload/${transformString}/`);
};

export default {
  uploadToCloudinary,
  uploadBase64ToCloudinary,
  uploadProductImageToCloud,
  uploadCategoryImageToCloud,
  uploadAvatarToCloud,
  uploadBannerToCloud,
  getOptimizedImageUrl,
  cloudName: CLOUD_NAME,
};
