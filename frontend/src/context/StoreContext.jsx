import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, MOCK_ORDERS, MOCK_ADDRESSES, MOCK_NOTIFICATIONS } from '../data/mockData';

const StoreContext = createContext(null);

const parseRouteFromUrl = () => {
  try {
    let rawPath = window.location.pathname || '/';
    let rawSearch = window.location.search || '';

    // Handle legacy hash URLs gracefully (e.g. if user opened #/orders or #/categories)
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

    // Normalizations
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
  } else {
    // Attach any simple string params
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
  // Navigation State initialized from current browser URL
  const initialRoute = parseRouteFromUrl();
  const [currentView, setCurrentView] = useState(initialRoute.view);
  const [viewParams, setViewParams] = useState(initialRoute.params);
  const [searchQuery, setSearchQuery] = useState(initialRoute.params.query || '');

  // Deliver to Location
  const [currentCity, setCurrentCity] = useState('Indore');
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
  // Alias for backward compatibility
  const isPriceDropOpen = isQuotationOpen;
  const setIsPriceDropOpen = setIsQuotationOpen;

  // Cart Drawer
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Authentication State
  const [user, setUser] = useState({
    name: 'Er. Rajesh Malviya',
    company: 'Malviya Infra & Buildtech Pvt. Ltd.',
    email: 'rajesh.malviya@malviyabuilders.com',
    phone: '+91 98260 11223',
    role: 'Commercial Contractor / Builder',
    gstin: '23AABCM9821K1ZM',
    tier: 'Gold Contractor Tier (5% Extra Rebate)',
  });

  // Cart State (Initialized with demo construction items)
  const [cart, setCart] = useState([
    {
      product: PRODUCTS[0], // UltraTech Cement
      quantity: 50,
      price: 405, // Bulk tier
    },
    {
      product: PRODUCTS[3], // Tata Tiscon TMT
      quantity: 1, // 1 Tonne
      price: 64500,
    },
  ]);

  const [appliedCoupon, setAppliedCoupon] = useState({
    code: 'BUILDMISTRI',
    discountPercentage: 5,
    discountAmount: 4237,
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState([
    PRODUCTS[10], // Kajaria Vitrified Tiles
    PRODUCTS[13], // Asian Paints Apex
    PRODUCTS[20], // Bosch Impact Drill
  ]);

  // Orders State
  const [orders, setOrders] = useState(MOCK_ORDERS);

  // Addresses State
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);

  // Notifications State
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  // Toast System
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // URL change listener for browser Back/Forward & popstate
  useEffect(() => {
    const handleLocationChange = () => {
      const { view, params } = parseRouteFromUrl();
      setCurrentView(view);
      setViewParams(params);
      if (params.query) setSearchQuery(params.query);
    };

    // If current URL contains legacy hash (e.g. #/ or #/orders), clean it up immediately
    if (window.location.hash) {
      const { view, params } = parseRouteFromUrl();
      const cleanUrl = buildUrlFromRoute(view, params);
      window.history.replaceState({ view, params }, '', cleanUrl);
    }

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Navigation Helper with instant HTML5 URL updates
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
    if (params.query) {
      setSearchQuery(params.query);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Operations
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      let newPrice = product.price;

      // Check for bulk tiers
      const newQty = existingIndex > -1 ? prev[existingIndex].quantity + quantity : quantity;
      if (product.id === 'prod_1' && newQty >= 50) newPrice = 405; // Cement 50+
      if (product.id === 'prod_4' && newQty >= 5) newPrice = 63200; // Steel 5T+

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

    addToast(`Added ${quantity}x ${product.name} to Cart`, 'success');
  };

  const removeFromCart = (productId) => {
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
    if (!code) return { success: false, message: 'Please enter coupon code' };
    const upper = code.trim().toUpperCase();
    if (upper === 'BUILDMISTRI' || upper === 'MISTRI50' || upper === 'SITE100') {
      const discountPercentage = upper === 'BUILDMISTRI' ? 5 : 8;
      setAppliedCoupon({
        code: upper,
        discountPercentage,
        discountAmount: Math.round(cartSubtotal * (discountPercentage / 100)),
      });
      addToast(`Coupon ${upper} applied! Saved extra ${discountPercentage}%`, 'success');
      return { success: true };
    }
    addToast('Invalid coupon code. Try BUILDMISTRI', 'danger');
    return { success: false, message: 'Invalid or expired promo code' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const discountAmount = appliedCoupon ? Math.round(cartSubtotal * (appliedCoupon.discountPercentage / 100)) : 0;
  const unloadingCharge = cartSubtotal > 50000 ? 0 : 500;
  const gstAmount = Math.round((cartSubtotal - discountAmount) * 0.18);
  const grandTotal = cartSubtotal - discountAmount + unloadingCharge + gstAmount;

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
  const placeOrder = (orderData) => {
    const newOrderId = `MST-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      id: newOrderId,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Order Confirmed',
      statusCode: 'confirmed',
      expectedDelivery: 'Tomorrow, by 12:00 PM',
      deliverySlot: orderData.deliverySlot || 'Express Morning',
      items: [...cart],
      summary: {
        subtotal: cartSubtotal,
        bulkDiscount: discountAmount,
        unloadingCharge,
        gstAmount,
        deliveryCharge: 0,
        totalAmount: grandTotal,
      },
      siteAddress: orderData.siteAddress || addresses[0],
      payment: {
        method: orderData.paymentMethod || 'UPI Instant',
        status: 'Paid',
        transactionId: `TXN-MST-${Date.now()}`,
      },
      tracking: {
        currentStep: 2,
        driverName: 'Assigned upon dispatch',
        driverPhone: '+91 98260 00000',
        vehicleNumber: 'MP 09 Logistics Truck',
        liveEtaMinutes: 720,
        steps: [
          { title: 'Order Placed', time: 'Just now', done: true, desc: 'Material order received & approved' },
          { title: 'Order Confirmed', time: 'In Progress', done: true, desc: 'Depot stock allocated' },
          { title: 'Warehouse Dispatch', time: 'Pending', done: false, desc: 'Will load on 10T crane vehicle' },
          { title: 'In Transit', time: 'Pending', done: false, desc: 'En route to construction site' },
          { title: 'Out for Delivery', time: 'Pending', done: false, desc: 'Driver will call 30 mins prior' },
          { title: 'Delivered & Unloaded', time: 'Pending', done: false, desc: 'Site sign-off required' },
        ],
      },
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    addToast(`Order ${newOrderId} placed successfully!`, 'success');
    return newOrder;
  };

  const getOrderById = (id) => {
    if (!id) return orders[0] || MOCK_ORDERS[0];
    const target = String(id).toLowerCase();
    return orders.find((o) => o.id?.toLowerCase() === target) ||
           MOCK_ORDERS.find((o) => o.id?.toLowerCase() === target) ||
           orders[0] ||
           MOCK_ORDERS[0];
  };

  const getProductById = (id) => {
    if (!id) return PRODUCTS[0];
    const target = String(id).toLowerCase();
    return PRODUCTS.find((p) => p.id?.toLowerCase() === target || p.id?.toLowerCase() === `prod_${target}`) || PRODUCTS[0];
  };

  // Address Operations
  const addAddress = (newAddr) => {
    const addrWithId = { ...newAddr, id: `addr_${Date.now()}` };
    setAddresses((prev) => [...prev, addrWithId]);
    addToast('New delivery site address added', 'success');
  };

  const deleteAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    addToast('Site address deleted', 'info');
  };

  const setDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    addToast('Default delivery site updated', 'success');
  };

  // Auth Operations
  const login = (emailOrPhone, password) => {
    setUser({
      name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Site Manager',
      company: 'Indore Prime Builders',
      email: emailOrPhone.includes('@') ? emailOrPhone : 'contractor@mistri.com',
      phone: emailOrPhone.includes('@') ? '+91 98260 11223' : emailOrPhone,
      role: 'Registered Contractor',
      gstin: '23AABCM9821K1ZM',
      tier: 'Gold Contractor Tier',
    });
    addToast('Welcome back to MISTRI!', 'success');
    return { success: true };
  };

  const signup = (formData) => {
    setUser({
      name: formData.name,
      company: formData.company || 'Private Construction Client',
      email: formData.email,
      phone: formData.phone,
      role: formData.role || 'Contractor',
      gstin: formData.gstin || '',
      tier: 'Standard Builder Tier',
    });
    addToast('Account created successfully! Welcome to MISTRI.', 'success');
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    addToast('Logged out of MISTRI account', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        // Navigation
        currentView,
        viewParams,
        navigateTo,
        searchQuery,
        setSearchQuery,

        // Location
        currentCity,
        setCurrentCity,
        currentPincode,
        setCurrentPincode,
        isLocationModalOpen,
        setIsLocationModalOpen,

        // Wallet
        walletBalance,
        setWalletBalance,
        isWalletVisible,
        toggleWalletVisibility,

        // Options Modal
        optionsModalProduct,
        isOptionsModalOpen,
        openOptionsModal,
        closeOptionsModal,

        // Quotation / WhatsApp Requirement
        isQuotationOpen,
        setIsQuotationOpen,
        isPriceDropOpen,
        setIsPriceDropOpen,

        // Cart Drawer
        isCartDrawerOpen,
        setIsCartDrawerOpen,

        // User Auth
        user,
        login,
        signup,
        logout,

        // Cart
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

        // Orders & Products
        orders,
        placeOrder,
        getOrderById,
        getProductById,

        // Addresses
        addresses,
        addAddress,
        deleteAddress,
        setDefaultAddress,

        // Notifications
        notifications,
        setNotifications,

        // Toasts
        toasts,
        addToast,
        removeToast,
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
