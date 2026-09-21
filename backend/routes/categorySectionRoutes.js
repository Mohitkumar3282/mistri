import { categorySectionCrud } from '../controllers/categoryController.js';
import { catalogRouter } from './routeFactory.js';

// /api/category-sections - public read, admin write
export default catalogRouter(categorySectionCrud);
