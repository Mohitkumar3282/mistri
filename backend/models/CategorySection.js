import { createAppModel, Mixed } from './appModel.js';

// Storefront sections that group categories (e.g. "Civil & Interiors").
const CategorySection = createAppModel('CategorySection', {
  collection: 'category_sections',
  fields: {
    title: { type: String, trim: true },
    slug: { type: String, trim: true },
    description: Mixed,
    image: Mixed,
    categories: [Mixed],
    isActive: Mixed,
  },
});

export default CategorySection;
