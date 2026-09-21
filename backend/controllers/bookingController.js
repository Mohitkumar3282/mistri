import Booking from '../models/Booking.js';
import buildCrud from './crudFactory.js';
import { notifyNewBooking } from './notificationHooks.js';

/**
 * Technician bookings
 * @route /api/bookings  - customers create/read their own, admins manage all
 */
export default buildCrud(Booking, { scopeToOwner: true, onCreate: notifyNewBooking });
