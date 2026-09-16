import {
  PRODUCTS,
  MOCK_ORDERS,
  CATEGORIES,
} from '../../frontend/src/data/mockData.js';

let couponsDatabase = [
  {
    code: 'BUILDMISTRI',
    discountPercentage: 5,
    maxDiscount: 10000,
    minOrderValue: 2000,
    description: 'Flat 5% instant discount on all structural materials and bulk cement orders.',
    isActive: true,
    usageCount: 142,
    expiryDate: '2026-12-31',
  },
  {
    code: 'MISTRI50',
    discountPercentage: 8,
    maxDiscount: 15000,
    minOrderValue: 25000,
    description: 'Mega Contractor Rebate: 8% off on TMT Steel Rebars & Heavy Civil Supplies.',
    isActive: true,
    usageCount: 89,
    expiryDate: '2026-11-30',
  },
  {
    code: 'SITE100',
    discountPercentage: 10,
    maxDiscount: 25000,
    minOrderValue: 50000,
    description: 'Site Launch Offer: 10% instant rebate on full truckload purchases.',
    isActive: true,
    usageCount: 63,
    expiryDate: '2026-12-31',
  },
  {
    code: 'SUPERBUILD',
    discountPercentage: 12,
    maxDiscount: 35000,
    minOrderValue: 100000,
    description: 'Exclusive Wholesale VIP tier for commercial construction projects.',
    isActive: true,
    usageCount: 27,
    expiryDate: '2027-03-31',
  },
];

let quotationsDatabase = [
  {
    id: 'QUO-8801',
    clientName: 'Er. Rajesh Malviya',
    company: 'Malviya Infra & Buildtech Pvt. Ltd.',
    phone: '+91 98260 11223',
    email: 'rajesh.malviya@malviyabuilders.com',
    siteCity: 'Indore',
    projectType: 'Commercial Complex (G+7 Floors)',
    requiredMaterials: '300 Bags UltraTech PPC Cement, 12 Tonnes Tata Tiscon Fe 550D TMT, 2000 Sq.Ft Kajaria Tiles',
    deliveryDate: '2026-09-22',
    notes: 'Need official stamped BOQ quote with GST breakdown for client bank disbursement.',
    estimatedTotal: 985000,
    status: 'Quotation Sent',
    adminNotes: 'Formal quotation PDF dispatched via WhatsApp with 6.5% tiered bulk rebate.',
    createdAt: '2026-09-13T11:20:00Z',
  },
  {
    id: 'QUO-8802',
    clientName: 'Manish Choudhary',
    company: 'Skyline Heights Construction',
    phone: '+91 98270 55443',
    email: 'manish@skylineindore.com',
    siteCity: 'Bhopal',
    projectType: 'Residential Row Houses (14 Units)',
    requiredMaterials: '500 Bags ACC Gold Cement, 8 Tonne Jindal Panther Steel, Asian Paints Apex Exterior Putty',
    deliveryDate: '2026-09-25',
    notes: 'Require crane-assisted unloading truck access on site.',
    estimatedTotal: 840000,
    status: 'Under Review',
    adminNotes: 'Logistics team verifying 12-wheeler truck turning radius near site entrance.',
    createdAt: '2026-09-14T09:45:00Z',
  },
];

let settingsDatabase = {
  storeName: 'MISTRI – Construction Material & Technician Booking Platform',
  tagline: 'From Foundation to Finish',
  supportPhone: '+91 98260 11223',
  whatsappNumber: '+91 98260 11223',
  supportEmail: 'care@mistri.com',
  depotAddress: 'Central Depot #14, Super Corridor Logistics Park, Indore, MP - 452005',
  gstRatePercent: 18,
  unloadingChargeStandard: 500,
  freeUnloadingThreshold: 50000,
  minFreeDeliveryOrder: 500,
  tickerMessage: '🚚 EXPRESS SITE DISPATCH IN 60 MINS • OFFICIAL MTC LAB TEST CERTIFICATES INCLUDED WITH EVERY STEEL & CEMENT ORDER • GST 100% ITC COMPLIANT',
  isMaintenanceMode: false,
};

/**
 * @desc Get Admin Dashboard KPI Metrics
 * @route GET /api/admin/stats
 */
export const getAdminStats = async (req, res) => {
  try {
    const totalRevenue = MOCK_ORDERS.reduce((acc, o) => acc + (o.grandTotal || o.total || 0), 0);
    const totalOrders = MOCK_ORDERS.length;
    const activeProducts = PRODUCTS.length;
    const pendingQuotes = quotationsDatabase.filter((q) => q.status !== 'Closed').length;

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        activeProducts,
        pendingQuotes,
        activeMistris: 4,
        registeredContractors: 3,
        serviceableCities: ['Indore', 'Bhopal', 'Ujjain', 'Dewas', 'Jabalpur'],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get all coupons
 * @route GET /api/admin/coupons
 */
export const getCoupons = async (req, res) => {
  try {
    res.json({ success: true, count: couponsDatabase.length, data: couponsDatabase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Create coupon
 * @route POST /api/admin/coupons
 */
export const createCoupon = async (req, res) => {
  try {
    const newCoupon = {
      usageCount: 0,
      isActive: true,
      ...req.body,
    };
    couponsDatabase.push(newCoupon);
    res.status(201).json({ success: true, data: newCoupon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Update coupon
 * @route PUT /api/admin/coupons/:code
 */
export const updateCoupon = async (req, res) => {
  try {
    const { code } = req.params;
    const index = couponsDatabase.findIndex((c) => c.code.toUpperCase() === code.toUpperCase());
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    couponsDatabase[index] = { ...couponsDatabase[index], ...req.body };
    res.json({ success: true, data: couponsDatabase[index] });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Delete coupon
 * @route DELETE /api/admin/coupons/:code
 */
export const deleteCoupon = async (req, res) => {
  try {
    const { code } = req.params;
    couponsDatabase = couponsDatabase.filter((c) => c.code.toUpperCase() !== code.toUpperCase());
    res.json({ success: true, message: 'Coupon removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get quotations
 * @route GET /api/admin/quotations
 */
export const getQuotations = async (req, res) => {
  try {
    res.json({ success: true, count: quotationsDatabase.length, data: quotationsDatabase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Update quotation status or admin notes
 * @route PUT /api/admin/quotations/:id
 */
export const updateQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const index = quotationsDatabase.findIndex((q) => q.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }
    quotationsDatabase[index] = { ...quotationsDatabase[index], ...req.body };
    res.json({ success: true, data: quotationsDatabase[index] });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get platform settings
 * @route GET /api/admin/settings
 */
export const getSettings = async (req, res) => {
  try {
    res.json({ success: true, data: settingsDatabase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Update platform settings
 * @route PUT /api/admin/settings
 */
export const updateSettings = async (req, res) => {
  try {
    settingsDatabase = { ...settingsDatabase, ...req.body };
    res.json({ success: true, data: settingsDatabase });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
