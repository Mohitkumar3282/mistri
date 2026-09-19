import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { auth, googleProvider } from '../config/firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  trackPageView,
  trackAddToCart,
  trackRemoveFromCart,
  trackPurchase,
  trackUserLogin,
  trackUserSignUp,
} from '../services/analyticsService';
import {
  registerServiceWorker,
  sendCustomerOrderNotification,
  sendAdminNewOrderNotification,
  requestNotificationPermission,
  getNotificationPermission,
} from '../services/pushNotificationService';
import {
  PRODUCTS as INITIAL_PRODUCTS,
  CATEGORIES as INITIAL_CATEGORIES,
  CATEGORY_SECTIONS as INITIAL_CATEGORY_SECTIONS,
  MOCK_ORDERS as INITIAL_ORDERS,
  MOCK_ADDRESSES,
  MOCK_NOTIFICATIONS,
  MOCK_FAQS as INITIAL_FAQS,
  TOP_BRANDS,
  CITIES as INITIAL_CITIES,
} from '../data/mockData';

const StoreContext = createContext(null);

// Initial Service Catalogue
const INITIAL_SERVICES = [
  {
    id: 'srv_1',
    title: 'Complete Plumbing & Leakage Repair',
    slug: 'plumbing-repair',
    category: 'Plumbing',
    description: 'Expert repair for pipes, leaky faucets, blocked drains, bathroom fittings, and water motor installation.',
    basePrice: 299,
    durationHours: 1.5,
    icon: 'Droplets',
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=800',
    features: ['Pipe leakage fixing', 'Drain unblocking', 'Tap & shower replacement', '30-day warranty'],
    rating: 4.9,
    reviewCount: 142,
    isPopular: true,
  },
  {
    id: 'srv_2',
    title: 'Home Electrical Wiring & Fixtures',
    slug: 'electrical-wiring',
    category: 'Electrical',
    description: 'Short-circuit fixing, ceiling fan installation, switchboard replacement, fuse box & MCB setup.',
    basePrice: 349,
    durationHours: 1,
    icon: 'Zap',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
    features: ['Short-circuit resolution', 'Fan & light installation', 'Inverter setup', 'Certified safety checks'],
    rating: 4.8,
    reviewCount: 98,
    isPopular: true,
  },
  {
    id: 'srv_3',
    title: 'AC Deep Service & Gas Refilling',
    slug: 'ac-service',
    category: 'AC Repair',
    description: 'Jet-pump indoor & outdoor AC cleaning, cooling coil check, gas charging, filter sanitization.',
    basePrice: 499,
    durationHours: 2,
    icon: 'Wind',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=800',
    features: ['Foam-jet deep wash', 'Gas leakage check', 'Thermostat testing', '90-day cooling guarantee'],
    rating: 4.95,
    reviewCount: 230,
    isPopular: true,
  },
  {
    id: 'srv_4',
    title: 'Custom Carpentry & Furniture Repair',
    slug: 'carpentry-service',
    category: 'Carpentry',
    description: 'Door lock replacement, hinge repair, custom modular wardrobe fixing, table and chair restoration.',
    basePrice: 399,
    durationHours: 2.5,
    icon: 'Hammer',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
    features: ['Door hinge & lock fixes', 'Wood polishing', 'Custom shelf mounting', 'Precision craftsmanship'],
    rating: 4.7,
    reviewCount: 86,
    isPopular: false,
  },
  {
    id: 'srv_5',
    title: 'Full House Waterproofing & Painting',
    slug: 'house-painting',
    category: 'Painting',
    description: 'Wall putty, primer application, texture painting, anti-dampness waterproofing coats.',
    basePrice: 1299,
    durationHours: 8,
    icon: 'Paintbrush',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800',
    features: ['Laser wall inspection', 'Dust-free sanding', 'Premium Asian/Nippon paint', 'Color consultation'],
    rating: 4.9,
    reviewCount: 75,
    isPopular: true,
  },
  {
    id: 'srv_6',
    title: 'Washing Machine & Refrigerator Repair',
    slug: 'appliance-repair',
    category: 'Appliance Repair',
    description: 'Drum motor repair, PCB diagnostic, cooling issue resolution, microwave oven and RO servicing.',
    basePrice: 399,
    durationHours: 1.5,
    icon: 'Wrench',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    features: ['Genuine spare parts', 'On-spot diagnostic', 'All top brands supported', 'Transparent bill'],
    rating: 4.85,
    reviewCount: 164,
    isPopular: false,
  },
];

// Initial Technicians (Mistris)
const INITIAL_MISTRIS = [
  {
    id: 'mst_1',
    fullName: 'Rajesh Kumar Mistri',
    profession: 'Senior Electrician',
    specializations: ['Wiring', 'Fuse Repair', 'Inverter Setup', 'Smart Lights'],
    experienceYears: 9,
    hourlyRate: 349,
    city: 'Indore',
    serviceAreas: ['Vijay Nagar', 'Palasia', 'Bhawarkua', 'Rau'],
    rating: 4.9,
    reviewCount: 128,
    jobsCompleted: 340,
    isVerified: true,
    isAvailable: true,
    bio: 'Certified electrical expert with 9+ years handling residential towers and commercial complex wiring.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    phone: '+91 98260 11988',
  },
  {
    id: 'mst_2',
    fullName: 'Mukesh Sharma Mistri',
    profession: 'Master Plumber',
    specializations: ['Piping', 'Leakage Sealing', 'Motor Installation', 'Sanitaryware'],
    experienceYears: 12,
    hourlyRate: 299,
    city: 'Indore',
    serviceAreas: ['Chhotigwaltoli', 'Rajwada', 'Annapurna', 'Bengali Square'],
    rating: 4.95,
    reviewCount: 215,
    jobsCompleted: 580,
    isVerified: true,
    isAvailable: true,
    bio: 'Specialist in concealed CPVC plumbing, high pressure pumps, and bathroom remodeling.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    phone: '+91 98261 22877',
  },
  {
    id: 'mst_3',
    fullName: 'Anil Vishwakarma',
    profession: 'Expert Carpenter',
    specializations: ['Modular Kitchens', 'Wardrobe Sliding', 'Door Fitting', 'Wood Polish'],
    experienceYears: 8,
    hourlyRate: 399,
    city: 'Indore',
    serviceAreas: ['Super Corridor', 'Nipania', 'Mahalaxmi Nagar', 'Khandwa Road'],
    rating: 4.8,
    reviewCount: 94,
    jobsCompleted: 210,
    isVerified: true,
    isAvailable: false,
    bio: 'Precision woodworker crafting customized wardrobes, modular storage, and acoustic doors.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
    phone: '+91 98262 33766',
  },
  {
    id: 'mst_4',
    fullName: 'Sunil Rathore',
    profession: 'HVAC & AC Specialist',
    specializations: ['Jet AC Cleaning', 'Inverter PCB Repair', 'Gas Charging', 'Ducting'],
    experienceYears: 7,
    hourlyRate: 499,
    city: 'Indore',
    serviceAreas: ['Bypass Road', 'Bicholi Mardana', 'LIG Colony', 'Scheme 78'],
    rating: 4.9,
    reviewCount: 172,
    jobsCompleted: 430,
    isVerified: true,
    isAvailable: true,
    bio: 'Authorised AC technician for Daikin, Voltas, BlueStar & LG VRF and Split systems.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300',
    phone: '+91 98263 44655',
  },
];

// Initial Technician Bookings
const INITIAL_BOOKINGS = [
  {
    id: 'BKG-99201',
    customerName: 'Er. Rajesh Malviya',
    customerPhone: '+91 98260 11223',
    serviceId: 'srv_1',
    serviceTitle: 'Complete Plumbing & Leakage Repair',
    mistriId: 'mst_2',
    mistriName: 'Mukesh Sharma Mistri',
    date: '2026-09-15',
    timeSlot: '09:00 AM - 11:00 AM',
    address: 'Plot 42, Super Corridor Tech Zone, Indore - 452005',
    problemDescription: 'Main water inlet pipe pressure drop and overhead tank float valve overflow repair.',
    amount: 598,
    paymentMethod: 'UPI / Online',
    paymentStatus: 'Paid',
    status: 'In Progress',
    createdAt: '2026-09-14T08:30:00Z',
  },
  {
    id: 'BKG-99202',
    customerName: 'Amit Verma (Civil Engg)',
    customerPhone: '+91 97555 43210',
    serviceId: 'srv_2',
    serviceTitle: 'Home Electrical Wiring & Fixtures',
    mistriId: 'mst_1',
    mistriName: 'Rajesh Kumar Mistri',
    date: '2026-09-16',
    timeSlot: '02:00 PM - 04:00 PM',
    address: 'Site #12, Treasure Fantasy, Rau, Indore',
    problemDescription: 'Distribution box 63A MCB tripping continuously upon heavy machine startup.',
    amount: 698,
    paymentMethod: 'Cash on Service',
    paymentStatus: 'Pending',
    status: 'Confirmed',
    createdAt: '2026-09-13T14:15:00Z',
  },
  {
    id: 'BKG-99203',
    customerName: 'Pooja Agrawal',
    customerPhone: '+91 94250 88990',
    serviceId: 'srv_3',
    serviceTitle: 'AC Deep Service & Gas Refilling',
    mistriId: null,
    mistriName: 'Unassigned',
    date: '2026-09-17',
    timeSlot: '11:00 AM - 01:00 PM',
    address: 'Flat 402, Royal Residency, Vijay Nagar, Indore',
    problemDescription: '2 Ton Inverter Split AC cooling coil frozen and water dripping inside bedroom.',
    amount: 499,
    paymentMethod: 'UPI / Online',
    paymentStatus: 'Pending',
    status: 'Pending',
    createdAt: '2026-09-14T10:00:00Z',
  },
];

// Initial Registered Users & Contractors
const INITIAL_USERS_LIST = [
  {
    id: 'usr_1',
    name: 'Er. Rajesh Malviya',
    company: 'Malviya Infra & Buildtech Pvt. Ltd.',
    email: 'rajesh.malviya@malviyabuilders.com',
    phone: '+91 98260 11223',
    role: 'Commercial Contractor / Builder',
    tier: 'Gold Contractor Tier (5% Extra Rebate)',
    gstin: '23AABCM9821K1ZM',
    status: 'Active',
    totalOrders: 18,
    totalSpend: 1420500,
    city: 'Indore',
  },
  {
    id: 'usr_2',
    name: 'Vikramaditya Solanki',
    company: 'Solanki Infrastructure & Developers',
    email: 'vikram.solanki@solankigroup.in',
    phone: '+91 98261 44556',
    role: 'Infrastructure Contractor',
    tier: 'VIP Infrastructure Partner (8% Extra Rebate)',
    gstin: '23AAECS4490P1ZQ',
    status: 'Active',
    totalOrders: 32,
    totalSpend: 4890000,
    city: 'Bhopal',
  },
  {
    id: 'usr_3',
    name: 'Sunita Chauhan',
    company: 'Chauhan Interiors & Modular Studios',
    email: 'sunita@chauhaninteriors.com',
    phone: '+91 98930 77122',
    role: 'Interior Architect',
    tier: 'Silver Designer Tier (3% Extra Rebate)',
    gstin: '23AACFC1120M1ZX',
    status: 'Active',
    totalOrders: 9,
    totalSpend: 620000,
    city: 'Indore',
  },
  {
    id: 'usr_4',
    name: 'Admin Supervisor',
    company: 'MISTRI Platform Admin Headquarters',
    email: 'admin@gmail.com',
    phone: '+91 98260 00001',
    role: 'Admin',
    tier: 'Root Administrator',
    gstin: '23AABCM0000A1Z0',
    status: 'Active',
    totalOrders: 0,
    totalSpend: 0,
    city: 'Indore',
  },
];

// Initial Coupons
const INITIAL_COUPONS = [
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

// Initial Quotation Requests
const INITIAL_QUOTATIONS = [
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

// Initial Marketing Banners
const INITIAL_BANNERS = [
  {
    id: 'bnr_1',
    title: 'DIRECT FROM DEPOT TO YOUR SITE',
    subtitle: 'UltraTech, Tata Tiscon & Kajaria at Wholesale Bulk Rates',
    badge: '⚡ GUARANTEED 60-MIN SITE DISPATCH',
    ctaText: 'Order Building Materials',
    link: 'categories',
    bgGradient: 'linear-gradient(135deg, #08274C 0%, #0F3A6E 60%, #F15A24 100%)',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&q=80&w=1200',
    isActive: true,
  },
  {
    id: 'bnr_2',
    title: 'CERTIFIED MISTRI & TECHNICIANS',
    subtitle: 'Verified Electricians, Plumbers, AC Specialists & Carpenters at Flat Rates',
    badge: '🛡️ 30-DAY WORKMANSHIP WARRANTY',
    ctaText: 'Book a Mistri Technician',
    link: 'services',
    bgGradient: 'linear-gradient(135deg, #04162C 0%, #08274C 50%, #D84A16 100%)',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1200',
    isActive: true,
  },
];

// Initial Site Settings
const INITIAL_SETTINGS = {
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

// Storage helper with fallback
const getStored = (key, fallback) => {
  try {
    const item = localStorage.getItem(`mistri_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.warn(`Error reading localStorage for ${key}`, err);
    return fallback;
  }
};

const setStored = (key, value) => {
  try {
    localStorage.setItem(`mistri_${key}`, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing localStorage for ${key}`, err);
  }
};

// URL Router helpers
const parseRouteFromUrl = () => {
  try {
    let rawPath = window.location.pathname || '/';
    let rawSearch = window.location.search || '';

    let rawHash = window.location.hash || '';
    if (rawHash) {
      if (rawHash.startsWith('#/')) {
        rawHash = rawHash.slice(2);
      } else if (rawHash.startsWith('#')) {
        rawHash = rawHash.slice(1);
      }
      if (rawHash) {
        const [hashPath, hashQuery] = rawHash.split('?');
        if (hashPath) {
          rawPath = '/' + hashPath.replace(/^\/+/, '');
        }
        if (hashQuery && !rawSearch) {
          rawSearch = '?' + hashQuery;
        }
      }
    }

    const cleanPath = rawPath.replace(/^\/+/, '').replace(/\/+$/, '');
    const viewName = cleanPath || 'home';

    const params = {};
    if (rawSearch) {
      const searchParams = new URLSearchParams(rawSearch);
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }
    }

    if (params.id && !params.orderId && (viewName === 'order-details' || viewName === 'order-tracking')) {
      params.orderId = params.id;
    }
    if (params.id && !params.productId && viewName === 'product-details') {
      params.productId = params.id;
    }
    if (params.q && !params.query) {
      params.query = params.q;
    }

    return { view: viewName, params };
  } catch (err) {
    console.error('Failed to parse route from URL', err);
    return { view: 'home', params: {} };
  }
};

const buildUrlFromRoute = (view, params = {}) => {
  if (!view || view === 'home') return '/';

  const queryParams = new URLSearchParams();

  if (view === 'order-details') {
    const id = params.order?.id || params.orderId || params.id;
    if (id) queryParams.set('id', id);
  } else if (view === 'order-tracking') {
    const id = params.orderId || params.id || params.order?.id;
    if (id) queryParams.set('id', id);
  } else if (view === 'product-details') {
    const id = params.product?.id || params.productId || params.id;
    if (id) queryParams.set('id', id);
  } else if (view === 'category-products') {
    const slug = params.slug || params.categorySlug;
    if (slug) queryParams.set('slug', slug);
  } else if (view === 'search') {
    const q = params.query || params.q || '';
    if (q) queryParams.set('query', q);
  } else if (view === 'admin') {
    if (params.tab) queryParams.set('tab', params.tab);
  } else {
    Object.keys(params).forEach((key) => {
      if (typeof params[key] === 'string' || typeof params[key] === 'number') {
        queryParams.set(key, String(params[key]));
      }
    });
  }

  const queryString = queryParams.toString();
  return queryString ? `/${view}?${queryString}` : `/${view}`;
};

export const StoreProvider = ({ children }) => {
  // Navigation State
  const initialRoute = parseRouteFromUrl();
  const [currentView, setCurrentView] = useState(initialRoute.view);
  const [viewParams, setViewParams] = useState(initialRoute.params);
  const [searchQuery, setSearchQuery] = useState(initialRoute.params.query || '');

  // Admin Active Tab
  const [adminActiveTab, setAdminActiveTab] = useState(initialRoute.params.tab || 'dashboard');

  // Dynamic Reactive Entities (Initialized from LocalStorage with fallback)
  const [products, setProducts] = useState(() => getStored('products', INITIAL_PRODUCTS));
  const [categories, setCategories] = useState(() => getStored('categories', INITIAL_CATEGORIES));
  const [categorySections, setCategorySections] = useState(() => getStored('category_sections', INITIAL_CATEGORY_SECTIONS));
  const [orders, setOrders] = useState(() => getStored('orders', INITIAL_ORDERS));
  const [services, setServices] = useState(() => getStored('services', INITIAL_SERVICES));
  const [mistris, setMistris] = useState(() => getStored('mistris', INITIAL_MISTRIS));
  const [bookings, setBookings] = useState(() => getStored('bookings', INITIAL_BOOKINGS));
  const [usersList, setUsersList] = useState(() => getStored('users_list', INITIAL_USERS_LIST));
  const [coupons, setCoupons] = useState(() => getStored('coupons', INITIAL_COUPONS));
  const [quotations, setQuotations] = useState(() => getStored('quotations', INITIAL_QUOTATIONS));
  const [banners, setBanners] = useState(() => getStored('banners', INITIAL_BANNERS));
  const [faqs, setFaqs] = useState(() => getStored('faqs', INITIAL_FAQS));
  const [supportMessages, setSupportMessages] = useState(() => getStored('support_messages', []));
  const [siteSettings, setSiteSettings] = useState(() => getStored('settings', INITIAL_SETTINGS));
  const [cities, setCities] = useState(() => getStored('cities', INITIAL_CITIES));

  // Deliver to Location
  const [currentCity, setCurrentCity] = useState(cities[0] || 'Indore');
  const [currentPincode, setCurrentPincode] = useState('452005');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Wallet / Cashback Balance
  const [walletBalance, setWalletBalance] = useState(2450);
  const [isWalletVisible, setIsWalletVisible] = useState(false);
  const toggleWalletVisibility = () => setIsWalletVisible((prev) => !prev);

  // Product Options Modal
  const [optionsModalProduct, setOptionsModalProduct] = useState(null);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  const openOptionsModal = (product) => {
    setOptionsModalProduct(product);
    setIsOptionsModalOpen(true);
  };

  const closeOptionsModal = () => {
    setIsOptionsModalOpen(false);
    setOptionsModalProduct(null);
  };

  // Quotation / WhatsApp Requirement Modal
  const [isQuotationOpen, setIsQuotationOpen] = useState(false);
  const isPriceDropOpen = isQuotationOpen;
  const setIsPriceDropOpen = setIsQuotationOpen;

  // Login & Registration Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState('login'); // 'login' | 'register'
  const [authSuccessCallback, setAuthSuccessCallback] = useState(null);

  const openLoginModal = (mode = 'login', callback = null) => {
    setLoginModalMode(mode);
    setAuthSuccessCallback(() => (typeof callback === 'function' ? callback : null));
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setAuthSuccessCallback(null);
  };

  // Cart Drawer
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Current Logged-in User (Defaults to null for new visitors / guests)
  const [user, setUser] = useState(() => getStored('current_user', null));

  // Exclusive Admin Authentication State
  const [adminUser, setAdminUser] = useState(() => getStored('admin_user', null));

  // Cart State (Initialized from storage or starts empty for real shopping)
  const [cart, setCart] = useState(() => getStored('cart', []));

  const [appliedCoupon, setAppliedCoupon] = useState(() => getStored('applied_coupon', null));

  // Wishlist State
  const [wishlist, setWishlist] = useState(() => getStored('wishlist', []));

  // Addresses State
  const [addresses, setAddresses] = useState(() => getStored('saved_addresses', MOCK_ADDRESSES));
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Notifications State (Customer)
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  // Admin Real-time Notifications State
  const INITIAL_ADMIN_NOTIFICATIONS = [
    {
      id: 'anot_1',
      type: 'new_order',
      title: 'New Online Order #MST-99201',
      message: 'Er. Rajesh Malviya placed an order for ₹45,200 (Paid via UPI)',
      orderId: 'MST-99201',
      amount: 45200,
      paymentMethod: 'UPI Instant Transfer',
      customerName: 'Er. Rajesh Malviya',
      time: '5 mins ago',
      unread: true,
    },
    {
      id: 'anot_2',
      type: 'new_order',
      title: 'New Cash Order #MST-99202',
      message: 'Amit Verma placed a COD order for ₹18,400 (Pay on Site)',
      orderId: 'MST-99202',
      amount: 18400,
      paymentMethod: 'Cash on Delivery',
      customerName: 'Amit Verma',
      time: '25 mins ago',
      unread: false,
    },
  ];
  const [adminNotifications, setAdminNotifications] = useState(() => getStored('admin_notifications', INITIAL_ADMIN_NOTIFICATIONS));

  // Web Audio Synthesizer for instant Order Alert Chime
  const playOrderNotificationSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 -> E5 -> G5 -> C6 chime
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.11);

        gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.11);
        gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + index * 0.11 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.11 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + index * 0.11);
        osc.stop(ctx.currentTime + index * 0.11 + 0.36);
      });
    } catch (e) {
      console.log('Audio chime error:', e);
    }
  };

  const markAdminNotificationRead = (id) => {
    setAdminNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllAdminNotificationsRead = () => {
    setAdminNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const clearAdminNotifications = () => {
    setAdminNotifications([]);
  };

  // Toast System
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Persistent storage sync effects
  useEffect(() => { setStored('current_user', user); }, [user]);
  useEffect(() => { setStored('admin_user', adminUser); }, [adminUser]);
  useEffect(() => { setStored('admin_notifications', adminNotifications); }, [adminNotifications]);
  useEffect(() => { setStored('cart', cart); }, [cart]);
  useEffect(() => { setStored('applied_coupon', appliedCoupon); }, [appliedCoupon]);
  useEffect(() => { setStored('wishlist', wishlist); }, [wishlist]);
  useEffect(() => { setStored('products', products); }, [products]);
  useEffect(() => { setStored('categories', categories); }, [categories]);
  useEffect(() => { setStored('category_sections', categorySections); }, [categorySections]);
  useEffect(() => { setStored('orders', orders); }, [orders]);
  useEffect(() => { setStored('services', services); }, [services]);
  useEffect(() => { setStored('mistris', mistris); }, [mistris]);
  useEffect(() => { setStored('bookings', bookings); }, [bookings]);
  useEffect(() => { setStored('users_list', usersList); }, [usersList]);
  useEffect(() => { setStored('coupons', coupons); }, [coupons]);
  useEffect(() => { setStored('quotations', quotations); }, [quotations]);
  useEffect(() => { setStored('banners', banners); }, [banners]);
  useEffect(() => { setStored('faqs', faqs); }, [faqs]);
  useEffect(() => { setStored('support_messages', supportMessages); }, [supportMessages]);
  useEffect(() => { setStored('settings', siteSettings); }, [siteSettings]);
  useEffect(() => { setStored('cities', cities); }, [cities]);

  // URL change listener for browser Back/Forward & popstate
  useEffect(() => {
    const handleLocationChange = () => {
      const { view, params } = parseRouteFromUrl();
      setCurrentView(view);
      setViewParams(params);
      if (params.query) setSearchQuery(params.query);
      if (params.tab) setAdminActiveTab(params.tab);
    };

    if (window.location.hash) {
      const { view, params } = parseRouteFromUrl();
      const cleanUrl = buildUrlFromRoute(view, params);
      window.history.replaceState({ view, params }, '', cleanUrl);
    }

    window.addEventListener('popstate', handleLocationChange);
    // Initialize push notification service worker
    registerServiceWorker();

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Navigation Helper
  const navigateTo = (view, params = {}, replace = false) => {
    const targetUrl = buildUrlFromRoute(view, params);
    const currentUrl = window.location.pathname + (window.location.search || '');

    if (currentUrl !== targetUrl || window.location.hash) {
      if (replace) {
        window.history.replaceState({ view, params }, '', targetUrl);
      } else {
        window.history.pushState({ view, params }, '', targetUrl);
      }
    }

    setCurrentView(view);
    setViewParams(params);
    if (params.query) setSearchQuery(params.query);
    if (params.tab) setAdminActiveTab(params.tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackPageView(view, params);
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const discountAmount = appliedCoupon ? Math.round(cartSubtotal * (appliedCoupon.discountPercentage / 100)) : 0;
  const unloadingCharge = cartSubtotal > (siteSettings.freeUnloadingThreshold || 50000) ? 0 : (siteSettings.unloadingChargeStandard || 500);
  const gstRate = (siteSettings.gstRatePercent || 18) / 100;
  const gstAmount = Math.round((cartSubtotal - discountAmount) * gstRate);
  const grandTotal = cartSubtotal - discountAmount + unloadingCharge + gstAmount;

  // Cart Operations
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      let newPrice = product.price;

      const newQty = existingIndex > -1 ? prev[existingIndex].quantity + quantity : quantity;
      if (product.id === 'prod_1' && newQty >= 50) newPrice = 405;
      if (product.id === 'prod_4' && newQty >= 5) newPrice = 63200;

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          price: newPrice,
        };
        return updated;
      }
      return [...prev, { product, quantity, price: newPrice }];
    });

    trackAddToCart(product, quantity);
    addToast(`Added ${quantity}x ${product.name} to Cart`, 'success');
  };

  const removeFromCart = (productId) => {
    trackRemoveFromCart(productId);
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addToast('Item removed from cart', 'info');
  };

  const updateCartQty = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          let price = item.product.price;
          if (item.product.id === 'prod_1' && newQty >= 50) price = 405;
          if (item.product.id === 'prod_4' && newQty >= 5) price = 63200;
          return { ...item, quantity: newQty, price };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Coupon Application
  const applyCoupon = (code) => {
    if (!code) return { success: false, message: 'Please enter promo code' };
    const upper = code.trim().toUpperCase();

    const foundCoupon = coupons.find((c) => c.code.toUpperCase() === upper && c.isActive);

    if (foundCoupon) {
      if (cartSubtotal < (foundCoupon.minOrderValue || 0)) {
        const msg = `Minimum order amount of ₹${foundCoupon.minOrderValue.toLocaleString('en-IN')} required for ${upper}`;
        addToast(msg, 'warning');
        return { success: false, message: msg };
      }

      let calculatedDiscount = Math.round(cartSubtotal * (foundCoupon.discountPercentage / 100));
      if (foundCoupon.maxDiscount && calculatedDiscount > foundCoupon.maxDiscount) {
        calculatedDiscount = foundCoupon.maxDiscount;
      }

      setAppliedCoupon({
        code: upper,
        discountPercentage: foundCoupon.discountPercentage,
        discountAmount: calculatedDiscount,
      });

      addToast(`Coupon ${upper} applied! Saved ₹${calculatedDiscount.toLocaleString('en-IN')}`, 'success');
      return { success: true };
    }

    addToast('Invalid or expired coupon code.', 'danger');
    return { success: false, message: 'Invalid or expired promo code' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  // Wishlist Operations
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        addToast(`Removed ${product.name} from Wishlist`, 'info');
        return prev.filter((item) => item.id !== product.id);
      } else {
        addToast(`Saved ${product.name} to Wishlist`, 'success');
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Order Operations
  const placeOrder = (orderData = {}) => {
    const newOrderId = `MST-${Math.floor(100000 + Math.random() * 900000)}`;
    const isOnline =
      orderData.paymentMethod?.toLowerCase().includes('online') ||
      orderData.paymentMethod?.toLowerCase().includes('upi') ||
      orderData.paymentMethod?.toLowerCase().includes('card') ||
      orderData.paymentMethod?.toLowerCase().includes('net banking') ||
      orderData.paymentMethod?.toLowerCase().includes('wallet');

    const paymentStatus = orderData.paymentStatus || (isOnline ? 'Paid' : 'Pending (Pay on Site)');
    const customerName = user?.name || orderData.siteAddress?.recipientName || 'Er. Rajesh Malviya';
    const customerPhone = user?.phone || orderData.siteAddress?.phone || '+91 98260 11223';
    const orderItems = orderData.items && orderData.items.length > 0 ? orderData.items : [...cart];
    const orderSubtotal = orderData.subtotal !== undefined ? orderData.subtotal : cartSubtotal;
    const orderDiscount = orderData.discount !== undefined ? orderData.discount : discountAmount;
    const orderTotal = orderData.totalAmount !== undefined ? orderData.totalAmount : grandTotal;

    const newOrder = {
      id: newOrderId,
      orderNumber: newOrderId,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
      customerName,
      customerPhone,
      customerEmail: user?.email || 'builder@mistri.com',
      status: 'Confirmed',
      statusCode: 'confirmed',
      expectedDelivery: 'Tomorrow, by 12:00 PM',
      deliverySlot: orderData.deliverySlot || 'Express Morning (08:00 AM - 12:00 PM)',
      vehicleAccess: orderData.siteVehicleAccess || 'Heavy 10-Wheeler Truck Access',
      unloadingNotes: orderData.unloadingNotes || '',
      items: orderItems,
      itemCount: orderItems.reduce((acc, item) => acc + (item.quantity || 1), 0),
      grandTotal: orderTotal,
      total: orderTotal,
      summary: {
        subtotal: orderSubtotal,
        bulkDiscount: orderDiscount,
        unloadingCharge: orderData.unloadingCharge !== undefined ? orderData.unloadingCharge : unloadingCharge,
        gstAmount: orderData.gstAmount !== undefined ? orderData.gstAmount : gstAmount,
        deliveryCharge: 0,
        totalAmount: orderTotal,
      },
      siteAddress: orderData.siteAddress || addresses[0],
      shippingAddress: orderData.siteAddress || addresses[0],
      payment: {
        method: orderData.paymentMethod || (isOnline ? 'Online Payment (UPI/Card)' : 'Cash on Delivery'),
        status: paymentStatus,
        transactionId: orderData.transactionId || `TXN-MST-${Date.now()}`,
        gateway: orderData.gateway || (isOnline ? 'Razorpay Direct' : 'Cash On Site'),
      },
      paymentMethod: orderData.paymentMethod || (isOnline ? 'Online Payment (UPI/Card)' : 'Cash on Delivery'),
      paymentStatus: paymentStatus,
      driverName: 'Ramesh Patel',
      driverPhone: '+91 98260 99881',
      vehicleNumber: 'MP-09-TR-4421',
      tracking: {
        currentStep: 2,
        driverName: 'Ramesh Patel',
        driverPhone: '+91 98260 99881',
        vehicleNumber: 'MP-09-TR-4421',
        liveEtaMinutes: 720,
        steps: [
          { title: 'Order Placed', time: 'Just now', done: true, desc: 'Material order received & approved' },
          { title: 'Order Confirmed', time: 'In Progress', done: true, desc: 'Depot stock allocated' },
          { title: 'Warehouse Dispatch', time: 'Pending', done: false, desc: 'Will load on crane vehicle' },
          { title: 'In Transit', time: 'Pending', done: false, desc: 'En route to construction site' },
          { title: 'Out for Delivery', time: 'Pending', done: false, desc: 'Driver will call 30 mins prior' },
          { title: 'Delivered & Unloaded', time: 'Pending', done: false, desc: 'Site sign-off required' },
        ],
      },
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Customer notification
    const customerNotification = {
      id: `notif_${Date.now()}`,
      type: 'delivery',
      title: `Order Placed Successfully (${newOrderId})`,
      message: `Your material order for ₹${orderTotal.toLocaleString('en-IN')} is confirmed for delivery. Payment: ${newOrder.payment.method}.`,
      time: 'Just now',
      unread: true,
      orderId: newOrderId,
    };
    setNotifications((prev) => [customerNotification, ...prev]);

    // Admin Real-Time Notification & Audio Alert
    const adminNotification = {
      id: `anot_${Date.now()}`,
      type: 'new_order',
      title: `New ${isOnline ? 'Online' : 'Cash'} Order #${newOrderId}`,
      message: `${customerName} placed an order for ₹${orderTotal.toLocaleString('en-IN')} (${newOrder.payment.method})`,
      orderId: newOrderId,
      amount: orderTotal,
      paymentMethod: newOrder.payment.method,
      customerName,
      time: 'Just now',
      unread: true,
      createdAt: new Date().toISOString(),
    };
    setAdminNotifications((prev) => [adminNotification, ...prev]);
    playOrderNotificationSound();

    // Trigger Native Device & Browser Push Notifications (Customer & Admin)
    sendCustomerOrderNotification(newOrder).catch((err) =>
      console.debug('Customer push notification note:', err)
    );
    sendAdminNewOrderNotification(newOrder).catch((err) =>
      console.debug('Admin push notification note:', err)
    );

    clearCart();

    // Track e-commerce purchase in Firebase Analytics
    trackPurchase(newOrder);

    // Sync to backend API asynchronously
    api.post('/orders', newOrder).catch((err) => {
      console.log('Order created locally. (Backend sync note:', err.message || err, ')');
    });

    addToast(`Order #${newOrderId} placed successfully! (${isOnline ? 'Online Paid' : 'Cash on Delivery'})`, 'success');
    return newOrder;
  };

  const getOrderById = (id) => {
    if (!id) return orders[0] || INITIAL_ORDERS[0];
    const target = String(id).toLowerCase();
    return orders.find((o) => o.id?.toLowerCase() === target) ||
           INITIAL_ORDERS.find((o) => o.id?.toLowerCase() === target) ||
           orders[0] ||
           INITIAL_ORDERS[0];
  };

  const getProductById = (id) => {
    if (!id) return products[0] || INITIAL_PRODUCTS[0];
    const target = String(id).toLowerCase();
    return products.find((p) => p.id?.toLowerCase() === target || p.id?.toLowerCase() === `prod_${target}`) ||
           INITIAL_PRODUCTS.find((p) => p.id?.toLowerCase() === target) ||
           products[0] ||
           INITIAL_PRODUCTS[0];
  };



  // Auth Operations
  const loginWithGoogle = async (callback = null) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      let loggedInUser = {
        id: fbUser.uid,
        name: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Contractor User'),
        company: 'Indore Prime Builders',
        email: fbUser.email || 'builder@mistri.com',
        phone: fbUser.phoneNumber || '+91 98260 11223',
        avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        role: 'Commercial Contractor / Builder',
        gstin: '23AABCM9821K1ZM',
        tier: 'Gold Contractor Tier (5% Extra Rebate)',
        status: 'Active',
        authProvider: 'firebase_google',
        city: currentCity,
      };

      // Try backend authentication bridge
      try {
        const res = await api.login(fbUser.email, 'google_oauth_firebase_token');
        if (res && res.data && res.data.token) {
          localStorage.setItem('mistri_token', res.data.token);
        }
      } catch (backendErr) {
        console.debug('Backend JWT sync note for Google Auth:', backendErr.message);
      }

      setUsersList((prev) => {
        const existingIdx = prev.findIndex((u) => u.email?.toLowerCase() === fbUser.email?.toLowerCase());
        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx] = { ...updated[existingIdx], ...loggedInUser };
          return updated;
        }
        return [loggedInUser, ...prev];
      });

      setUser(loggedInUser);
      setIsLoginModalOpen(false);
      addToast(`Welcome to MISTRI, ${loggedInUser.name}! (Signed in via Google)`, 'success');
      trackUserLogin('google');

      const execCb = callback || authSuccessCallback;
      if (typeof execCb === 'function') {
        execCb(loggedInUser);
        setAuthSuccessCallback(null);
      }

      return { success: true, user: loggedInUser };
    } catch (err) {
      console.error('Google Sign-In error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        addToast('Google Sign-In was cancelled.', 'warning');
      } else if (err.code === 'auth/popup-blocked') {
        addToast('Google popup was blocked by browser. Please allow popups.', 'error');
      } else {
        addToast(err.message || 'Google Sign-In failed', 'error');
      }
      throw err;
    }
  };

  const login = async (emailOrPhone, password, callback = null) => {
    const trimmed = String(emailOrPhone || '').trim().toLowerCase();
    const existing = usersList.find(
      (u) => u.email?.toLowerCase() === trimmed || u.phone?.replace(/\s+/g, '') === trimmed.replace(/\s+/g, '')
    );

    let loggedInUser = existing || {
      id: `usr_${Date.now()}`,
      name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Site Manager',
      company: 'Indore Prime Builders',
      email: emailOrPhone.includes('@') ? emailOrPhone : 'customer@mistri.com',
      phone: emailOrPhone.includes('@') ? '+91 98260 11223' : emailOrPhone,
      role: 'Commercial Contractor / Builder',
      gstin: '23AABCM9821K1ZM',
      tier: 'Gold Contractor Tier (5% Extra Rebate)',
      status: 'Active',
    };

    // Attempt Firebase Email/Password Auth if email format
    if (trimmed.includes('@')) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, trimmed, password);
        if (userCredential?.user) {
          loggedInUser = {
            ...loggedInUser,
            id: userCredential.user.uid,
            email: userCredential.user.email,
            name: userCredential.user.displayName || loggedInUser.name,
            authProvider: 'firebase_email',
          };
        }
      } catch (fbAuthErr) {
        console.debug('Firebase direct email auth note:', fbAuthErr.code || fbAuthErr.message);
      }
    }

    try {
      const res = await api.login(emailOrPhone, password);
      if (res && res.data) {
        if (res.data.token) {
          localStorage.setItem('mistri_token', res.data.token);
        }
        loggedInUser = {
          ...loggedInUser,
          id: res.data._id || loggedInUser.id,
          name: res.data.name || loggedInUser.name,
          email: res.data.email || loggedInUser.email,
          phone: res.data.phone || loggedInUser.phone,
          role: res.data.role || loggedInUser.role,
        };
      }
    } catch (apiErr) {
      console.warn('Backend login notice (using profile):', apiErr.message);
    }

    if (!existing) {
      setUsersList((prev) => [loggedInUser, ...prev]);
    }

    setUser(loggedInUser);
    setIsLoginModalOpen(false);
    addToast(`Welcome back, ${loggedInUser.name}!`, 'success');
    trackUserLogin(trimmed.includes('@') ? 'email' : 'phone');

    // Execute callback if queued
    const execCb = callback || authSuccessCallback;
    if (typeof execCb === 'function') {
      execCb(loggedInUser);
      setAuthSuccessCallback(null);
    }

    return { success: true, user: loggedInUser };
  };

  const signup = async (formData, callback = null) => {
    let newUser = {
      id: `usr_${Date.now()}`,
      name: formData.name,
      company: formData.company || 'Indore Prime Builders',
      email: formData.email,
      phone: formData.phone,
      role: formData.role || 'Customer',
      gstin: formData.gstin || '',
      tier: 'Standard Builder Tier',
      status: 'Active',
      totalOrders: 0,
      totalSpend: 0,
      city: currentCity,
    };

    // Attempt Firebase Registration
    if (formData.email && formData.password) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        if (userCredential?.user) {
          newUser = {
            ...newUser,
            id: userCredential.user.uid,
            authProvider: 'firebase_email',
          };
        }
      } catch (fbRegErr) {
        console.debug('Firebase signup note:', fbRegErr.code || fbRegErr.message);
      }
    }

    try {
      const res = await api.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password || 'password123',
        role: 'customer',
      });

      if (res && res.data) {
        if (res.data.token) {
          localStorage.setItem('mistri_token', res.data.token);
        }
        newUser = {
          ...newUser,
          id: res.data._id || newUser.id,
          name: res.data.name || newUser.name,
          email: res.data.email || newUser.email,
          phone: res.data.phone || newUser.phone,
          role: res.data.role || newUser.role,
        };
      }
    } catch (apiErr) {
      console.warn('Backend registration notice (saved locally):', apiErr.message);
    }

    setUser(newUser);
    setUsersList((prev) => [newUser, ...prev]);
    setIsLoginModalOpen(false);
    addToast(`Account created successfully! Welcome to MISTRI, ${newUser.name}.`, 'success');
    trackUserSignUp('email_or_form');

    // Execute callback if queued
    const execCb = callback || authSuccessCallback;
    if (typeof execCb === 'function') {
      execCb(newUser);
      setAuthSuccessCallback(null);
    }

    return { success: true, user: newUser };
  };

  const logout = () => {
    signOut(auth).catch(() => {});
    setUser(null);
    try {
      localStorage.removeItem('mistri_current_user');
      localStorage.removeItem('mistri_token');
    } catch (e) {}
    addToast('Logged out of your MISTRI account', 'info');
  };

  // Exclusive Admin Authentication Handler
  const adminLogin = async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      addToast('Please enter both Administrator Email and Password', 'warning');
      return { success: false, message: 'Please enter both email and password' };
    }

    if (cleanEmail === 'admin@gmail.com' && cleanPassword === 'Admin!@#123') {
      const authAdmin = {
        id: 'usr_admin_root',
        name: 'Root Administrator',
        company: 'MISTRI Platform Admin HQ',
        email: 'admin@gmail.com',
        phone: '+91 98260 00001',
        role: 'Admin',
        tier: 'Root Administrator (Full Access)',
        status: 'Active',
      };

      try {
        const res = await api.login(cleanEmail, cleanPassword);
        if (res?.data?.token) {
          localStorage.setItem('mistri_admin_token', res.data.token);
        }
      } catch (err) {
        console.warn('Backend admin auth fallback:', err.message);
      }

      setAdminUser(authAdmin);
      addToast('Administrator authenticated successfully! Welcome back.', 'success');
      return { success: true, user: authAdmin };
    } else {
      addToast('Access Denied: Invalid administrator email or password', 'error');
      return { success: false, message: 'Invalid administrator email or password' };
    }
  };

  const adminLogout = () => {
    setAdminUser(null);
    try {
      localStorage.removeItem('mistri_admin_token');
      localStorage.removeItem('mistri_admin_user');
    } catch (e) {}
    addToast('Administrator session ended', 'info');
  };

  // Auth Gate: Checks if user is logged in before proceeding with ordering / bookings
  const requireAuth = (actionCallback) => {
    if (user) {
      if (typeof actionCallback === 'function') actionCallback(user);
      return true;
    }

    addToast('Please sign in or create an account to proceed with your order', 'warning');
    openLoginModal('login', actionCallback);
    return false;
  };

  // =========================================================================
  // ADMIN PANEL DYNAMIC MANAGEMENT CRUD FUNCTIONS
  // =========================================================================

  // 1. PRODUCT CRUD
  const addProduct = (newProduct) => {
    const id = newProduct.id || `prod_${Date.now()}`;
    const name = newProduct.name || 'New Construction Material';
    const slug = newProduct.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const price = Number(newProduct.price) >= 0 ? Number(newProduct.price) : 0;
    const mrp = Number(newProduct.mrp) > 0 ? Number(newProduct.mrp) : Math.round((price || 300) * 1.25);
    const stockCount = newProduct.stockCount !== undefined && newProduct.stockCount !== '' && !isNaN(newProduct.stockCount) ? Number(newProduct.stockCount) : 500;
    const inStock = newProduct.status === 'OUT_OF_STOCK' || stockCount <= 0 ? false : (newProduct.inStock !== undefined ? Boolean(newProduct.inStock) : true);
    const category = newProduct.category || categories[0]?.name || 'Cement';
    const matchedCategory = categories.find((c) => c.name?.toLowerCase() === category.toLowerCase() || c.slug === newProduct.categorySlug);
    const categorySlug = newProduct.categorySlug || matchedCategory?.slug || category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const image = newProduct.image || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=800';

    const created = {
      rating: 4.8,
      reviewsCount: 0,
      freeDelivery: true,
      freeDeliveryMin: 500,
      cashbackText: 'Assured 2% Cashback',
      cashbackMinPurchase: 50000,
      minOrderQty: 1,
      hasOptions: false,
      optionsCount: 0,
      isFeatured: true,
      isPopular: true,
      section: matchedCategory?.section || matchedCategory?.sectionName || 'Civil & Interiors',
      brand: newProduct.brand || 'UltraTech',
      unit: newProduct.unit || 'Standard Unit',
      description: newProduct.description || `${name} - High performance genuine building material supplied with manufacturer certificate.`,
      ...newProduct,
      id,
      name,
      slug,
      price,
      mrp,
      stockCount,
      inStock,
      category,
      categorySlug,
      image,
      gallery: Array.isArray(newProduct.gallery) && newProduct.gallery.length > 0 ? newProduct.gallery : [image],
    };

    setProducts((prev) => [created, ...prev.filter((p) => p.id !== id)]);
    addToast(`Product "${created.name}" added to catalog!`, 'success');
    return created;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updatedFields };
          if (updatedFields.price !== undefined) updated.price = Number(updatedFields.price) || 0;
          if (updatedFields.mrp !== undefined) updated.mrp = Number(updatedFields.mrp) || 0;
          if (updatedFields.stockCount !== undefined) updated.stockCount = Number(updatedFields.stockCount) || 0;
          if (updatedFields.status === 'OUT_OF_STOCK') updated.inStock = false;
          return updated;
        }
        return p;
      })
    );
    addToast('Product updated successfully', 'success');
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast('Product removed from catalog', 'info');
  };

  const toggleProductStock = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
    addToast('Product stock status toggled', 'success');
  };

  const toggleProductFeatured = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p))
    );
    addToast('Product featured status toggled', 'success');
  };

  // 2. CATEGORY CRUD
  const addCategory = (newCat) => {
    const id = newCat.id || `cat_${Date.now()}`;
    const slug = newCat.slug || newCat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const sectionName = newCat.section || 'Civil & Interiors';
    const created = {
      id,
      slug,
      itemCount: '25+ Products',
      subcategories: newCat.subcategories || [newCat.name, 'Accessories', 'Premium Grade', 'Fast Dispatch'],
      ...newCat,
      section: sectionName,
    };
    setCategories((prev) => [created, ...prev]);

    // Also update or create matching category section
    setCategorySections((prev) => {
      const existing = prev.find(
        (sec) =>
          sec.id === newCat.sectionId ||
          (sec.title && sec.title.toLowerCase() === sectionName.toLowerCase()) ||
          (sec.name && sec.name.toLowerCase() === sectionName.toLowerCase())
      );
      if (existing) {
        return prev.map((sec) =>
          sec.id === existing.id
            ? { ...sec, categories: [...(sec.categories || []), created] }
            : sec
        );
      } else {
        const newSecObj = {
          id: newCat.sectionId || `sec_${Date.now()}`,
          title: sectionName,
          slug: sectionName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: `All products under ${sectionName}`,
          image: newCat.image || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&q=80&w=600',
          categories: [created],
          isActive: true,
        };
        return [newSecObj, ...prev];
      }
    });

    addToast(`Category "${created.name}" added!`, 'success');
    return created;
  };

  const updateCategory = (id, updatedFields) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
    addToast('Category updated successfully', 'success');
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id && c.slug !== id));
    addToast('Category deleted', 'info');
  };

  // Parent Categories / Sections CRUD
  const addCategorySection = (newSec) => {
    const id = newSec.id || `sec_${Date.now()}`;
    const title = newSec.title || newSec.name;
    const slug = newSec.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const created = {
      id,
      title,
      slug,
      description: newSec.description || '',
      image: newSec.image || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&q=80&w=600',
      categories: newSec.categories || [],
      isActive: newSec.isActive !== false,
      ...newSec,
    };
    setCategorySections((prev) => [created, ...prev]);

    // Also create parent category in `categories` list
    const catEntry = {
      id: `cat_${Date.now()}`,
      name: title,
      slug,
      section: title,
      sectionId: id,
      description: created.description,
      image: created.image,
      subcategories: newSec.subcategories || ['Standard Grade', 'Premium Grade', 'Accessories'],
      isActive: true,
      createdOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      lastUpdated: 'Just now',
    };
    setCategories((prev) => {
      if (prev.some((c) => c.name.toLowerCase() === title.toLowerCase() || c.slug === slug)) {
        return prev;
      }
      return [catEntry, ...prev];
    });

    addToast(`Parent Category "${created.title}" created successfully!`, 'success');
    return created;
  };

  const updateCategorySection = (id, updatedFields) => {
    setCategorySections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );
    addToast('Parent Category updated successfully', 'success');
  };

  const deleteCategorySection = (id) => {
    setCategorySections((prev) => prev.filter((s) => s.id !== id));
    addToast('Parent Category removed', 'info');
  };

  // Subcategories CRUD
  const addSubCategory = (categoryIdentifier, subName, subImage = '') => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryIdentifier || cat.slug === categoryIdentifier || cat.name.toLowerCase() === categoryIdentifier.toLowerCase()) {
          const currentSubs = Array.isArray(cat.subcategories) ? cat.subcategories : [];
          if (!currentSubs.includes(subName)) {
            return {
              ...cat,
              subcategories: [...currentSubs, subName],
              subcategoryImages: {
                ...(cat.subcategoryImages || {}),
                [subName]: subImage,
              },
            };
          }
        }
        return cat;
      })
    );
    addToast(`Subcategory "${subName}" added!`, 'success');
  };

  const updateSubCategory = (categoryIdentifier, oldName, newName, newImage = null) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryIdentifier || cat.slug === categoryIdentifier || cat.name.toLowerCase() === categoryIdentifier.toLowerCase()) {
          const currentSubs = Array.isArray(cat.subcategories) ? cat.subcategories : [];
          const updatedSubs = currentSubs.map((s) => (s === oldName ? newName : s));
          const subImages = { ...(cat.subcategoryImages || {}) };
          if (newImage !== null) {
            delete subImages[oldName];
            subImages[newName] = newImage;
          } else if (subImages[oldName]) {
            subImages[newName] = subImages[oldName];
            delete subImages[oldName];
          }
          return {
            ...cat,
            subcategories: updatedSubs,
            subcategoryImages: subImages,
          };
        }
        return cat;
      })
    );
    addToast(`Subcategory updated!`, 'success');
  };

  const deleteSubCategory = (categoryIdentifier, subName) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryIdentifier || cat.slug === categoryIdentifier || cat.name.toLowerCase() === categoryIdentifier.toLowerCase()) {
          const currentSubs = Array.isArray(cat.subcategories) ? cat.subcategories : [];
          const subImages = { ...(cat.subcategoryImages || {}) };
          delete subImages[subName];
          return {
            ...cat,
            subcategories: currentSubs.filter((s) => s !== subName),
            subcategoryImages: subImages,
          };
        }
        return cat;
      })
    );
    addToast(`Subcategory "${subName}" deleted`, 'info');
  };

  // 3. ORDERS & LIVE LOGISTICS CRUD
  const updateOrderStatus = (orderId, status, statusCode) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status,
            statusCode: statusCode || status.toLowerCase().replace(/\s+/g, '-'),
          };
        }
        return o;
      })
    );
    addToast(`Order ${orderId} status set to "${status}"`, 'success');
  };

  const updateOrderTracking = (orderId, currentStep, customSteps = null) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updatedSteps = customSteps || o.tracking?.steps?.map((step, idx) => ({
            ...step,
            done: idx < currentStep,
            time: idx === currentStep - 1 ? 'Updated Live' : (idx < currentStep ? 'Completed' : 'Pending'),
          })) || [];

          return {
            ...o,
            tracking: {
              ...(o.tracking || {}),
              currentStep,
              steps: updatedSteps,
            },
          };
        }
        return o;
      })
    );
    addToast(`Live tracking step for ${orderId} set to step ${currentStep}`, 'success');
  };

  const updateOrderDriver = (orderId, driverData) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            tracking: {
              ...(o.tracking || {}),
              driverName: driverData.driverName || o.tracking?.driverName,
              driverPhone: driverData.driverPhone || o.tracking?.driverPhone,
              vehicleNumber: driverData.vehicleNumber || o.tracking?.vehicleNumber,
              liveEtaMinutes: driverData.liveEtaMinutes || o.tracking?.liveEtaMinutes,
            },
          };
        }
        return o;
      })
    );
    addToast(`Driver & Logistics for ${orderId} updated`, 'success');
  };

  const updateOrderPayment = (orderId, paymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            payment: {
              ...(o.payment || {}),
              status: paymentStatus,
            },
          };
        }
        return o;
      })
    );
    addToast(`Payment status for ${orderId} set to "${paymentStatus}"`, 'success');
  };

  const deleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    addToast(`Order ${orderId} deleted from records`, 'info');
  };

  // 4. SERVICES & MISTRIS CRUD
  const addService = (newService) => {
    const id = `srv_${Date.now()}`;
    const slug = newService.slug || newService.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const created = {
      id,
      slug,
      rating: 4.9,
      reviewCount: 0,
      isPopular: false,
      features: ['Genuine parts', '30-day warranty', 'Verified technician'],
      ...newService,
    };
    setServices((prev) => [created, ...prev]);
    addToast(`Service "${created.title}" added!`, 'success');
    return created;
  };

  const updateService = (id, updatedFields) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );
    addToast('Service updated successfully', 'success');
  };

  const deleteService = (id) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    addToast('Service removed', 'info');
  };

  const addMistri = (newMistri) => {
    const id = `mst_${Date.now()}`;
    const created = {
      id,
      rating: 4.9,
      reviewCount: 0,
      jobsCompleted: 0,
      isVerified: true,
      isAvailable: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      serviceAreas: ['Vijay Nagar', 'Super Corridor', 'Palasia'],
      specializations: ['General Repairs', 'Installation'],
      ...newMistri,
    };
    setMistris((prev) => [created, ...prev]);
    addToast(`Mistri "${created.fullName}" registered!`, 'success');
    return created;
  };

  const updateMistri = (id, updatedFields) => {
    setMistris((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedFields } : m))
    );
    addToast('Technician profile updated', 'success');
  };

  const deleteMistri = (id) => {
    setMistris((prev) => prev.filter((m) => m.id !== id));
    addToast('Technician removed from directory', 'info');
  };

  const toggleMistriAvailability = (id) => {
    setMistris((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isAvailable: !m.isAvailable } : m))
    );
    addToast('Technician availability toggled', 'success');
  };

  const toggleMistriVerified = (id) => {
    setMistris((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isVerified: !m.isVerified } : m))
    );
    addToast('Technician verification status updated', 'success');
  };

  // 5. BOOKINGS CRUD
  const addBooking = (bookingData) => {
    const id = `BKG-${Math.floor(10000 + Math.random() * 90000)}`;
    const created = {
      id,
      createdAt: new Date().toISOString(),
      status: 'Pending',
      paymentStatus: 'Pending',
      mistriName: 'Unassigned',
      ...bookingData,
    };
    setBookings((prev) => [created, ...prev]);
    addToast(`Service booking ${id} scheduled!`, 'success');
    return created;
  };

  const updateBookingStatus = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    addToast(`Booking ${id} status set to "${newStatus}"`, 'success');
  };

  const assignMistriToBooking = (bookingId, mistriId, mistriName) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, mistriId, mistriName, status: 'Confirmed' } : b))
    );
    addToast(`Assigned ${mistriName} to booking ${bookingId}`, 'success');
  };

  const deleteBooking = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    addToast(`Booking ${id} removed`, 'info');
  };

  // 6. USERS & CONTRACTORS CRUD
  const addUser = (newUserData) => {
    const id = `usr_${Date.now()}`;
    const created = {
      id,
      status: 'Active',
      totalOrders: 0,
      totalSpend: 0,
      tier: newUserData.tier || 'Standard Builder Tier',
      ...newUserData,
    };
    setUsersList((prev) => [created, ...prev]);
    addToast(`User account for "${created.name}" created!`, 'success');
    return created;
  };

  const updateUser = (id, updatedFields) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updatedFields } : u))
    );
    // If updating current active user
    if (user && user.id === id) {
      setUser((prev) => ({ ...prev, ...updatedFields }));
    }
    addToast('User details updated', 'success');
  };

  const deleteUser = (id) => {
    setUsersList((prev) => prev.filter((u) => u.id !== id));
    addToast('User account removed', 'info');
  };

  const updateUserTier = (id, newTier) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, tier: newTier } : u))
    );
    if (user && user.id === id) {
      setUser((prev) => ({ ...prev, tier: newTier }));
    }
    addToast(`Contractor tier updated to "${newTier}"`, 'success');
  };

  // 7. COUPONS CRUD
  const addCoupon = (newCoupon) => {
    const created = {
      isActive: true,
      usageCount: 0,
      ...newCoupon,
      code: newCoupon.code.toUpperCase().trim(),
    };
    setCoupons((prev) => [created, ...prev]);
    addToast(`Coupon "${created.code}" created!`, 'success');
    return created;
  };

  const updateCoupon = (code, updatedFields) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code.toUpperCase() === code.toUpperCase() ? { ...c, ...updatedFields } : c))
    );
    addToast(`Coupon "${code}" updated`, 'success');
  };

  const deleteCoupon = (code) => {
    setCoupons((prev) => prev.filter((c) => c.code.toUpperCase() !== code.toUpperCase()));
    addToast(`Coupon "${code}" deleted`, 'info');
  };

  const toggleCouponStatus = (code) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code.toUpperCase() === code.toUpperCase() ? { ...c, isActive: !c.isActive } : c))
    );
    addToast(`Coupon status toggled`, 'success');
  };

  // 8. QUOTATIONS CRUD
  const addQuotation = (quoteData) => {
    const id = `QUO-${Math.floor(1000 + Math.random() * 9000)}`;
    const created = {
      id,
      createdAt: new Date().toISOString(),
      status: 'Received',
      estimatedTotal: 0,
      adminNotes: 'Awaiting engineering assessment',
      ...quoteData,
    };
    setQuotations((prev) => [created, ...prev]);
    addToast(`Quotation inquiry ${id} submitted! Specialist will call shortly.`, 'success');
    return created;
  };

  const updateQuotationStatus = (id, status, adminNotes = '', estimatedTotal = null) => {
    setQuotations((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            status,
            adminNotes: adminNotes || q.adminNotes,
            estimatedTotal: estimatedTotal !== null ? estimatedTotal : q.estimatedTotal,
          };
        }
        return q;
      })
    );
    addToast(`Quotation ${id} updated to "${status}"`, 'success');
  };

  const deleteQuotation = (id) => {
    setQuotations((prev) => prev.filter((q) => q.id !== id));
    addToast(`Quotation ${id} removed`, 'info');
  };

  // 9. BANNERS CRUD
  const addBanner = (newBanner) => {
    const id = `bnr_${Date.now()}`;
    const created = { id, isActive: true, ...newBanner };
    setBanners((prev) => [created, ...prev]);
    addToast('Hero banner added to homepage slider', 'success');
    return created;
  };

  const updateBanner = (id, updatedFields) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b))
    );
    addToast('Banner updated', 'success');
  };

  const deleteBanner = (id) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    addToast('Banner removed', 'info');
  };

  // 10. FAQS CRUD
  const addFaq = (categoryName, newQuestion) => {
    setFaqs((prev) => {
      const catIndex = prev.findIndex((c) => c.category === categoryName);
      if (catIndex > -1) {
        const updated = [...prev];
        updated[catIndex] = {
          ...updated[catIndex],
          questions: [...updated[catIndex].questions, newQuestion],
        };
        return updated;
      } else {
        return [...prev, { category: categoryName, questions: [newQuestion] }];
      }
    });
    addToast('FAQ item added', 'success');
  };

  const updateFaq = (categoryName, qIndex, updatedFaq) => {
    setFaqs((prev) =>
      prev.map((cat) => {
        if (cat.category === categoryName) {
          const updatedQs = [...cat.questions];
          updatedQs[qIndex] = updatedFaq;
          return { ...cat, questions: updatedQs };
        }
        return cat;
      })
    );
    addToast('FAQ updated', 'success');
  };

  const deleteFaq = (categoryName, qIndex) => {
    setFaqs((prev) =>
      prev.map((cat) => {
        if (cat.category === categoryName) {
          return {
            ...cat,
            questions: cat.questions.filter((_, idx) => idx !== qIndex),
          };
        }
        return cat;
      })
    );
    addToast('FAQ deleted', 'info');
  };

  // 11. SUPPORT MESSAGES CRUD
  const addSupportMessage = (msgData) => {
    const id = `msg_${Date.now()}`;
    const created = {
      id,
      createdAt: new Date().toISOString(),
      status: 'Open',
      ...msgData,
    };
    setSupportMessages((prev) => [created, ...prev]);
    addToast('Your message has been sent to our customer care team!', 'success');
    return created;
  };

  const updateSupportMessageStatus = (id, status) => {
    setSupportMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
    addToast('Support inquiry status updated', 'success');
  };

  // 12. STORE SETTINGS & RESET TO FACTORY DEFAULTS
  const updateSiteSettings = (newSettings) => {
    setSiteSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('Platform settings saved successfully!', 'success');
  };

  const addCity = (newCity) => {
    if (!newCity || cities.includes(newCity)) return;
    setCities((prev) => [...prev, newCity]);
    addToast(`City "${newCity}" added to delivery network`, 'success');
  };

  const removeCity = (cityToRemove) => {
    setCities((prev) => prev.filter((c) => c !== cityToRemove));
    addToast(`City "${cityToRemove}" removed`, 'info');
  };

  // Site Address Management
  const addAddress = (addr) => {
    const newAddrObj = {
      id: addr.id || `addr_${Date.now()}`,
      title: addr.title || 'Site Location',
      recipientName: addr.recipientName || user?.name || 'Site In-Charge',
      phone: addr.phone || user?.phone || '+91 98260 11223',
      addressLine: addr.addressLine || '',
      locality: addr.locality || '',
      city: addr.city || currentCity || 'Indore',
      state: addr.state || 'Madhya Pradesh',
      pincode: addr.pincode || currentPincode || '452001',
      unloadingNotes: addr.unloadingNotes || '',
      isDefault: addr.isDefault || false,
      ...addr,
    };
    setAddresses((prev) => {
      const updated = newAddrObj.isDefault
        ? [newAddrObj, ...prev.map((a) => ({ ...a, isDefault: false }))]
        : [newAddrObj, ...prev];
      setStored('saved_addresses', updated);
      return updated;
    });
    addToast('Site address saved successfully!', 'success');
    return newAddrObj;
  };

  const deleteAddress = (id) => {
    setAddresses((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      setStored('saved_addresses', updated);
      return updated;
    });
    addToast('Address removed', 'info');
  };

  const setDefaultAddress = (id) => {
    setAddresses((prev) => {
      const updated = prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }));
      setStored('saved_addresses', updated);
      return updated;
    });
    addToast('Default delivery site address updated', 'success');
  };

  // Real-time GPS Geolocation Fetcher with high accuracy reverse geocoding
  const fetchCurrentGpsLocation = async () => {
    setIsDetectingLocation(true);
    addToast('📍 Requesting GPS satellite coordinates...', 'info');

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setIsDetectingLocation(false);
        addToast('Geolocation is not supported by your browser', 'error');
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            let detectedCity = currentCity || 'Indore';
            let detectedPincode = currentPincode || '452001';
            let detectedState = 'Madhya Pradesh';
            let detectedRoad = '';
            let detectedArea = '';
            let formattedAddress = `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;

            // 1. Try reverse geocoding via OpenStreetMap Nominatim
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
                { headers: { 'Accept-Language': 'en' } }
              );
              if (res.ok) {
                const data = await res.json();
                if (data && data.address) {
                  const addr = data.address;
                  detectedCity = addr.city || addr.town || addr.county || addr.state_district || addr.village || detectedCity;
                  detectedPincode = addr.postcode ? addr.postcode.replace(/\D/g, '').slice(0, 6) : detectedPincode;
                  detectedState = addr.state || detectedState;
                  detectedRoad = addr.road || addr.suburb || addr.neighbourhood || addr.residential || '';
                  detectedArea = addr.suburb || addr.neighbourhood || addr.commercial || addr.industrial || '';
                  formattedAddress = data.display_name || `${detectedRoad}, ${detectedArea}, ${detectedCity}`;
                }
              }
            } catch (geoErr) {
              console.warn('Nominatim reverse geocode fallback:', geoErr);
              try {
                const bdcRes = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                );
                if (bdcRes.ok) {
                  const bdcData = await bdcRes.json();
                  detectedCity = bdcData.city || bdcData.locality || detectedCity;
                  detectedPincode = (bdcData.postcode || detectedPincode).replace(/\D/g, '').slice(0, 6);
                  detectedState = bdcData.principalSubdivision || detectedState;
                  formattedAddress = `${bdcData.locality || ''}, ${detectedCity}, ${detectedState}`;
                }
              } catch (bdcErr) {
                console.warn('BDC reverse geocode error:', bdcErr);
              }
            }

            // Create GPS Address Object
            const addressLineText = detectedRoad
              ? `${detectedRoad}${detectedArea ? ', ' + detectedArea : ''}`
              : formattedAddress.split(',').slice(0, 3).join(',');

            const gpsAddress = {
              id: `addr_gps_${Date.now()}`,
              title: 'Current Location (GPS)',
              recipientName: user?.name || 'Site In-Charge',
              phone: user?.phone || '+91 98260 11223',
              addressLine: addressLineText || 'Current Site Location',
              city: detectedCity,
              state: detectedState,
              pincode: detectedPincode,
              isDefault: true,
              isGps: true,
              coordinates: { latitude, longitude },
            };

            // Update state
            setCurrentCity(detectedCity);
            if (detectedPincode && detectedPincode.length === 6) {
              setCurrentPincode(detectedPincode);
            }
            setAddresses((prev) => {
              const updated = [gpsAddress, ...prev.filter((a) => !a.isGps)];
              setStored('saved_addresses', updated);
              return updated;
            });

            setIsDetectingLocation(false);
            addToast(`📍 Location fetched: ${detectedCity} (${detectedPincode})`, 'success');
            resolve(gpsAddress);
          } catch (err) {
            console.error('Error processing GPS coordinates:', err);
            setIsDetectingLocation(false);
            addToast('Could not convert GPS to address. Location fallback applied.', 'warning');
            resolve(null);
          }
        },
        (error) => {
          console.warn('Geolocation error:', error);
          setIsDetectingLocation(false);
          let errMsg = 'Failed to get location';
          if (error.code === 1) {
            errMsg = 'Location permission denied. Please allow GPS access in browser settings.';
          } else if (error.code === 2) {
            errMsg = 'Position unavailable. Checking network location...';
          } else if (error.code === 3) {
            errMsg = 'Location request timed out.';
          }
          addToast(errMsg, 'error');

          // Fallback to IP-based location
          fetch('https://ipapi.co/json/')
            .then((r) => r.json())
            .then((ipData) => {
              if (ipData && ipData.city) {
                const ipCity = ipData.city;
                const ipPin = (ipData.postal || '452001').replace(/\D/g, '').slice(0, 6) || '452001';
                const ipAddress = {
                  id: `addr_ip_${Date.now()}`,
                  title: 'Network Location',
                  recipientName: user?.name || 'Site In-Charge',
                  phone: user?.phone || '+91 98260 11223',
                  addressLine: `${ipData.region || ipCity} Area`,
                  city: ipCity,
                  state: ipData.region || 'Madhya Pradesh',
                  pincode: ipPin,
                  isDefault: true,
                };
                setCurrentCity(ipCity);
                setCurrentPincode(ipPin);
                setAddresses((prev) => [ipAddress, ...prev]);
                addToast(`📍 Network location applied: ${ipCity} (${ipPin})`, 'success');
                resolve(ipAddress);
              }
            })
            .catch(() => {
              reject(error);
            });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  const resetToDefaultData = () => {
    localStorage.removeItem('mistri_products');
    localStorage.removeItem('mistri_categories');
    localStorage.removeItem('mistri_category_sections');
    localStorage.removeItem('mistri_orders');
    localStorage.removeItem('mistri_services');
    localStorage.removeItem('mistri_mistris');
    localStorage.removeItem('mistri_bookings');
    localStorage.removeItem('mistri_users_list');
    localStorage.removeItem('mistri_coupons');
    localStorage.removeItem('mistri_quotations');
    localStorage.removeItem('mistri_banners');
    localStorage.removeItem('mistri_faqs');
    localStorage.removeItem('mistri_support_messages');
    localStorage.removeItem('mistri_settings');
    localStorage.removeItem('mistri_cities');

    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setCategorySections(INITIAL_CATEGORY_SECTIONS);
    setOrders(INITIAL_ORDERS);
    setServices(INITIAL_SERVICES);
    setMistris(INITIAL_MISTRIS);
    setBookings(INITIAL_BOOKINGS);
    setUsersList(INITIAL_USERS_LIST);
    setCoupons(INITIAL_COUPONS);
    setQuotations(INITIAL_QUOTATIONS);
    setBanners(INITIAL_BANNERS);
    setFaqs(INITIAL_FAQS);
    setSupportMessages([]);
    setSiteSettings(INITIAL_SETTINGS);
    setCities(INITIAL_CITIES);

    addToast('Factory default demo data restored!', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        // Navigation & Admin Tab
        currentView,
        viewParams,
        navigateTo,
        searchQuery,
        setSearchQuery,
        adminActiveTab,
        setAdminActiveTab,

        // Location & Cities
        currentCity,
        setCurrentCity,
        currentPincode,
        setCurrentPincode,
        cities,
        addCity,
        removeCity,
        isLocationModalOpen,
        setIsLocationModalOpen,

        // Wallet
        walletBalance,
        setWalletBalance,
        isWalletVisible,
        toggleWalletVisibility,

        // Modals
        optionsModalProduct,
        isOptionsModalOpen,
        openOptionsModal,
        closeOptionsModal,
        isQuotationOpen,
        setIsQuotationOpen,
        isPriceDropOpen,
        setIsPriceDropOpen,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        loginModalMode,
        setLoginModalMode,
        openLoginModal,
        closeLoginModal,
        requireAuth,

        // Current Auth
        user,
        setUser,
        login,
        loginWithGoogle,
        signup,
        logout,

        // Admin Auth
        adminUser,
        setAdminUser,
        adminLogin,
        adminLogout,

        // Cart State & Calculations
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartSubtotal,
        cartItemCount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        unloadingCharge,
        gstAmount,
        grandTotal,

        // Wishlist
        wishlist,
        toggleWishlist,
        isInWishlist,

        // Addresses & Notifications
        addresses,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        fetchCurrentGpsLocation,
        isDetectingLocation,
        notifications,
        setNotifications,
        adminNotifications,
        setAdminNotifications,
        markAdminNotificationRead,
        markAllAdminNotificationsRead,
        clearAdminNotifications,
        playOrderNotificationSound,
        requestNotificationPermission,
        getNotificationPermission,

        // Toast
        toasts,
        addToast,
        removeToast,

        // DYNAMIC PLATFORM DATA & ADMIN CRUD OPERATIONS
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStock,
        toggleProductFeatured,
        getProductById,

        categories,
        categorySections,
        addCategory,
        updateCategory,
        deleteCategory,
        addCategorySection,
        updateCategorySection,
        deleteCategorySection,
        addSubCategory,
        updateSubCategory,
        deleteSubCategory,

        orders,
        placeOrder,
        getOrderById,
        updateOrderStatus,
        updateOrderTracking,
        updateOrderDriver,
        updateOrderPayment,
        deleteOrder,

        services,
        addService,
        updateService,
        deleteService,

        mistris,
        addMistri,
        updateMistri,
        deleteMistri,
        toggleMistriAvailability,
        toggleMistriVerified,

        bookings,
        addBooking,
        updateBookingStatus,
        assignMistriToBooking,
        deleteBooking,

        usersList,
        addUser,
        updateUser,
        deleteUser,
        updateUserTier,

        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponStatus,

        quotations,
        addQuotation,
        updateQuotationStatus,
        deleteQuotation,

        banners,
        addBanner,
        updateBanner,
        deleteBanner,

        faqs,
        addFaq,
        updateFaq,
        deleteFaq,

        supportMessages,
        addSupportMessage,
        updateSupportMessageStatus,

        siteSettings,
        updateSiteSettings,
        resetToDefaultData,

        topBrands: TOP_BRANDS,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export default StoreContext;
