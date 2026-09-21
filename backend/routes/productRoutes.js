import productCrud from '../controllers/productController.js';
import { catalogRouter } from './routeFactory.js';

// /api/products - public read, admin write
export default catalogRouter(productCrud);
