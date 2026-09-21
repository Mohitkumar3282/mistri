import Category from '../models/Category.js';
import CategorySection from '../models/CategorySection.js';
import buildCrud from './crudFactory.js';

/**
 * Parent categories (with inline sub categories)
 * @route /api/categories  - public read, admin write
 */
export const categoryCrud = buildCrud(Category);

/**
 * Storefront category sections
 * @route /api/category-sections  - public read, admin write
 */
export const categorySectionCrud = buildCrud(CategorySection);
