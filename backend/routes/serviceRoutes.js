import serviceCrud from '../controllers/serviceController.js';
import { catalogRouter } from './routeFactory.js';

// /api/services - public read, admin write
export default catalogRouter(serviceCrud);
