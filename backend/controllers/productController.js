import Product from '../models/Product.js';
import buildCrud from './crudFactory.js';

/**
 * Products (construction materials)
 * @route /api/products  - public read, admin write
 */
export default buildCrud(Product);
