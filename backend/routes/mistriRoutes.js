import mistriCrud from '../controllers/mistriController.js';
import { catalogRouter } from './routeFactory.js';

// /api/mistris - public read, admin write
export default catalogRouter(mistriCrud);
