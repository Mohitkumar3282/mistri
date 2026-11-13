import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import {
  couponCrud,
  listCoupons,
  bannerCrud,
  faqCrud,
  cityCrud,
  quotationCrud,
  supportMessageCrud,
  getSettings,
  updateSettings,
} from '../controllers/adminController.js';
import { catalogRouter, ownedRouter, inboxRouter, optionalProtect } from './routeFactory.js';
import { validateCouponCode, createCoupon, updateCoupon, deleteCoupon } from '../controllers/couponController.js';

const adminOnly = [protect, authorize('admin')];

// /api/coupons - shoppers see active coupons, admins see and manage all
const coupons = express.Router();
coupons.post('/validate', optionalProtect, validateCouponCode);
coupons.get('/', optionalProtect, listCoupons);
coupons.get('/:key', ...adminOnly, couponCrud.get);
coupons.post('/', ...adminOnly, createCoupon);
coupons.put('/:key', ...adminOnly, updateCoupon);
coupons.patch('/:key', ...adminOnly, updateCoupon);
coupons.delete('/:key', ...adminOnly, deleteCoupon);

// /api/settings - public read, admin write
const settings = express.Router();
settings.get('/', getSettings);
settings.put('/', ...adminOnly, updateSettings);

export const couponRoutes = coupons;
export const settingsRoutes = settings;
export const bannerRoutes = catalogRouter(bannerCrud);
export const faqRoutes = catalogRouter(faqCrud);
export const cityRoutes = catalogRouter(cityCrud);
export const quotationRoutes = ownedRouter(quotationCrud);
export const supportMessageRoutes = inboxRouter(supportMessageCrud);
