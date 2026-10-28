import { createAppModel, Mixed } from './appModel.js';

// Parent categories. Sub categories are stored inline in `subcategories`.
const Category = createAppModel('Category', {
  collection: 'categories',
  fields: {
    name: { type: String, trim: true },
    slug: { type: String, trim: true, index: true },
    section: Mixed,
    description: Mixed,
    // Must be a Cloudinary (or other hosted) URL, never raw inline image data - a past
    // incident left two categories with multi-MB base64 images saved directly here,
    // which made every page that lists categories take 50-70s to load.
    image: {
      type: Mixed,
      validate: {
        validator: (v) => !(typeof v === 'string' && v.startsWith('data:') && v.length > 50000),
        message: 'Image must be a hosted URL, not inline image data - upload it to Cloudinary first.',
      },
    },
    subcategories: [Mixed],
    subcategoryImages: Mixed,
    isActive: Mixed,
    createdOn: Mixed,
    lastUpdated: Mixed,
  },
});

export default Category;
