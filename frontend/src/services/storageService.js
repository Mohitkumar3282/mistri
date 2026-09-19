import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';
import { uploadToCloudinary } from './cloudinaryService';

/**
 * Upload a file with Cloud-first approach (Cloudinary CDN with Firebase Storage fallback)
 * @param {File|Blob} file - The file object to upload
 * @param {string} destinationPath - The full storage path (e.g. 'mistri/products/prod_1.jpg')
 * @param {function} [onProgress] - Optional callback receiving progress percentage (0-100)
 * @returns {Promise<{ downloadURL: string, path: string, name: string, size: number, provider: string }>}
 */
export const uploadCloudFile = async (file, destinationPath, onProgress = null) => {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  // 1. First attempt fast Cloudinary upload
  try {
    if (typeof onProgress === 'function') onProgress(25);
    const folder = destinationPath.includes('/')
      ? destinationPath.substring(0, destinationPath.lastIndexOf('/'))
      : 'mistri/general';

    const cloudRes = await uploadToCloudinary(file, folder);
    if (typeof onProgress === 'function') onProgress(100);
    return {
      downloadURL: cloudRes.url,
      path: cloudRes.public_id,
      name: file.name,
      size: file.size,
      provider: 'cloudinary',
    };
  } catch (cloudErr) {
    console.warn('Cloudinary upload fallback to Firebase Storage:', cloudErr.message);
  }

  // 2. Fallback to Firebase Storage
  return uploadFile(file, destinationPath, onProgress);
};

/**
 * Upload a file directly to Firebase Cloud Storage with optional progress callback
 * @param {File|Blob} file - The file object to upload
 * @param {string} destinationPath - The full storage path (e.g. 'products/prod_1_img.jpg')
 * @param {function} [onProgress] - Optional callback receiving progress percentage (0-100)
 * @returns {Promise<{ downloadURL: string, path: string, name: string, size: number, provider: string }>}
 */
export const uploadFile = (file, destinationPath, onProgress = null) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided for upload.'));
    }

    // Clean up filename and sanitize path
    const sanitizedPath = destinationPath.replace(/\s+/g, '_');
    const storageRef = ref(storage, sanitizedPath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (typeof onProgress === 'function') {
          onProgress(progress, snapshot);
        }
      },
      (error) => {
        console.error('Firebase Storage upload error:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            downloadURL,
            path: sanitizedPath,
            name: file.name,
            size: file.size,
            provider: 'firebase',
          });
        } catch (urlErr) {
          reject(urlErr);
        }
      }
    );
  });
};

/**
 * Upload a product image
 */
export const uploadProductImage = async (file, productId = 'generic', onProgress = null) => {
  const timestamp = Date.now();
  const cleanName = (file.name || 'product.jpg').replace(/[^a-zA-Z0-9.]/g, '_');
  const path = `mistri/products/${productId}_${timestamp}_${cleanName}`;
  return uploadCloudFile(file, path, onProgress);
};

/**
 * Upload a category or subcategory image
 */
export const uploadCategoryImage = async (file, categoryId = 'generic', onProgress = null) => {
  const timestamp = Date.now();
  const cleanName = (file.name || 'category.jpg').replace(/[^a-zA-Z0-9.]/g, '_');
  const path = `mistri/categories/${categoryId}_${timestamp}_${cleanName}`;
  return uploadCloudFile(file, path, onProgress);
};

/**
 * Upload a user avatar or profile picture
 */
export const uploadUserAvatar = async (file, userId = 'user', onProgress = null) => {
  const timestamp = Date.now();
  const cleanName = (file.name || 'avatar.jpg').replace(/[^a-zA-Z0-9.]/g, '_');
  const path = `mistri/avatars/${userId}_${timestamp}_${cleanName}`;
  return uploadCloudFile(file, path, onProgress);
};

/**
 * Upload a contractor BOQ or quotation document/drawing
 */
export const uploadQuotationDocument = async (file, quotationId = 'quote', onProgress = null) => {
  const timestamp = Date.now();
  const cleanName = (file.name || 'document.pdf').replace(/[^a-zA-Z0-9.]/g, '_');
  const path = `mistri/quotations/${quotationId}_${timestamp}_${cleanName}`;
  return uploadCloudFile(file, path, onProgress);
};

/**
 * Delete a file from Firebase Cloud Storage by path
 */
export const deleteStorageFile = async (pathOrUrl) => {
  try {
    const fileRef = ref(storage, pathOrUrl);
    await deleteObject(fileRef);
    return { success: true };
  } catch (err) {
    console.warn('Firebase Storage deletion error:', err.message);
    throw err;
  }
};

export default {
  uploadCloudFile,
  uploadFile,
  uploadProductImage,
  uploadCategoryImage,
  uploadUserAvatar,
  uploadQuotationDocument,
  deleteStorageFile,
};
