import { createAppModel, Mixed } from './appModel.js';

// Parent categories. Sub categories are stored inline in `subcategories`.
const Category = createAppModel('Category', {
  collection: 'categories',
  fields: {
    name: { type: String, trim: true },
    slug: { type: String, trim: true, index: true },
    section: Mixed,
    description: Mixed,
    image: Mixed,
    subcategories: [Mixed],
    subcategoryImages: Mixed,
    isActive: Mixed,
    createdOn: Mixed,
    lastUpdated: Mixed,
  },
});

export default Category;
