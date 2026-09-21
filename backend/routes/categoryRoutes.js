import { categoryCrud } from '../controllers/categoryController.js';
import { catalogRouter } from './routeFactory.js';

// /api/categories - public read, admin write
export default catalogRouter(categoryCrud);
