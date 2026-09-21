import bookingCrud from '../controllers/bookingController.js';
import { ownedRouter } from './routeFactory.js';

// /api/bookings - customers create/read their own, admins manage all
export default ownedRouter(bookingCrud);
