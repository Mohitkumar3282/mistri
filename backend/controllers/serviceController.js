import Service from '../models/Service.js';
import buildCrud from './crudFactory.js';

/**
 * Technician services
 * @route /api/services  - public read, admin write
 */
export default buildCrud(Service);
