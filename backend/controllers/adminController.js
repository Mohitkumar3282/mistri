import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Quotation from '../models/Quotation.js';
import Mistri from '../models/Mistri.js';
import City from '../models/City.js';
import User from '../models/User.js';
import Coupon from '../models/Coupon.js';
import Banner from '../models/Banner.js';
import Faq from '../models/Faq.js';
import SupportMessage from '../models/SupportMessage.js';
import Notification from '../models/Notification.js';
import Setting from '../models/Setting.js';
import buildCrud from './crudFactory.js';
import { notifyNewQuotation, notifyNewSupportMessage } from './notificationHooks.js';

// ---------------------------------------------------------------------------
// Collection handlers
// ---------------------------------------------------------------------------

export const couponCrud = buildCrud(Coupon);
export const bannerCrud = buildCrud(Banner);
export const faqCrud = buildCrud(Faq, { sort: { _id: 1 } });
export const cityCrud = buildCrud(City, { sort: { _id: 1 } });
export const notificationCrud = buildCrud(Notification);
export const supportMessageCrud = buildCrud(SupportMessage, { onCreate: notifyNewSupportMessage });
export const quotationCrud = buildCrud(Quotation, { scopeToOwner: true, onCreate: notifyNewQuotation });

/**
 * @desc Coupons. Shoppers need active coupons to apply them at checkout; the admin
 *       panel sees every coupon.
 * @route GET /api/coupons
 */
export const listCoupons = async (req, res) => {
  if (req.user?.role === 'admin') return couponCrud.list(req, res);
  try {
    const docs = await Coupon.find({ isActive: { $ne: false } }).sort({ _id: -1 }).lean();
    res.json({
      success: true,
      count: docs.length,
      data: docs.map(({ _id, ...rest }) => rest),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------------------------------
// Platform settings (single document)
// ---------------------------------------------------------------------------

const SETTINGS_KEY = 'site';

/**
 * @desc Get platform settings. Empty until an administrator saves them, in which case
 *       the storefront keeps its built-in defaults.
 * @route GET /api/settings
 */
export const getSettings = async (req, res) => {
  try {
    const doc = await Setting.findOne({ key: SETTINGS_KEY }).lean();
    const { _id, key, ...settings } = doc || {};
    res.json({ success: true, data: doc ? settings : null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Replace platform settings (admin)
 * @route PUT /api/settings
 */
export const updateSettings = async (req, res) => {
  try {
    const { _id, key, ...settings } = req.body || {};
    await Setting.replaceOne({ key: SETTINGS_KEY }, { key: SETTINGS_KEY, ...settings }, { upsert: true });
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------------------------------
// Registered users (read-only directory for the admin panel)
// ---------------------------------------------------------------------------

const capitalize = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * @desc List registered accounts in the shape the admin Users table expects
 * @route GET /api/admin/users
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 }).lean();
    const data = users.map((u) => ({
      id: u.clientId || String(u._id),
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: capitalize(u.role),
      company: u.company,
      gstin: u.gstin,
      city: u.city || u.address?.city || '',
      tier: u.tier,
      status: u.status,
      totalOrders: u.totalOrders,
      totalSpend: u.totalSpend,
      createdAt: u.createdAt,
    }));
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------------------------------
// Dashboard stats
// ---------------------------------------------------------------------------

/**
 * @desc Get admin dashboard statistics
 * @route GET /api/admin/stats
 */
export const getAdminStats = async (req, res) => {
  try {
    const [revenue, totalOrders, activeProducts, pendingQuotes, activeMistris, registeredContractors, cities] =
      await Promise.all([
        Order.aggregate([
          { $match: { statusCode: { $ne: 'cancelled' } } },
          { $group: { _id: null, total: { $sum: { $ifNull: ['$grandTotal', { $ifNull: ['$total', 0] }] } } } },
        ]),
        Order.countDocuments(),
        Product.countDocuments(),
        Quotation.countDocuments({ status: { $nin: ['Closed', 'Rejected'] } }),
        Mistri.countDocuments({ isAvailable: { $ne: false } }),
        User.countDocuments({ role: { $ne: 'admin' } }),
        City.find().sort({ _id: 1 }).lean(),
      ]);

    res.json({
      success: true,
      data: {
        totalRevenue: revenue[0]?.total || 0,
        totalOrders,
        activeProducts,
        pendingQuotes,
        activeMistris,
        registeredContractors,
        serviceableCities: cities.map((c) => c.name),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
