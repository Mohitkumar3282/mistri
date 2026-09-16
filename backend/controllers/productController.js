import { PRODUCTS } from '../../frontend/src/data/mockData.js';

// In-memory / MongoDB data store
let productsDatabase = [...PRODUCTS];

/**
 * @desc Get all products with filtering & search
 * @route GET /api/products
 */
export const getProducts = async (req, res) => {
  try {
    const { category, search, brand, inStock } = req.query;
    let result = [...productsDatabase];

    if (category && category !== 'all') {
      result = result.filter(
        (p) => p.categorySlug === category || p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (brand) {
      result = result.filter((p) => p.brand?.toLowerCase() === brand.toLowerCase());
    }

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(lower) ||
          p.brand?.toLowerCase().includes(lower) ||
          p.category?.toLowerCase().includes(lower)
      );
    }

    if (inStock === 'true') {
      result = result.filter((p) => p.inStock);
    }

    res.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get single product by ID or slug
 * @route GET /api/products/:id
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = productsDatabase.find(
      (p) => p.id === id || p.slug === id || p.id === `prod_${id}`
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Create a new product (Admin)
 * @route POST /api/products
 */
export const createProduct = async (req, res) => {
  try {
    const name = req.body.name || 'New Construction Material';
    const slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const price = Number(req.body.price) >= 0 ? Number(req.body.price) : 300;
    const mrp = Number(req.body.mrp) > 0 ? Number(req.body.mrp) : Math.round(price * 1.25);
    const stockCount = req.body.stockCount !== undefined && req.body.stockCount !== '' ? Number(req.body.stockCount) : 500;
    const inStock = req.body.status !== 'OUT_OF_STOCK' && stockCount > 0;
    const category = req.body.category || 'Cement';
    const categorySlug = req.body.categorySlug || category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newProduct = {
      rating: 4.8,
      reviewsCount: 0,
      freeDelivery: true,
      freeDeliveryMin: 500,
      cashbackText: 'Assured 2% Cashback',
      cashbackMinPurchase: 50000,
      minOrderQty: 1,
      brand: req.body.brand || 'UltraTech',
      unit: req.body.unit || 'Standard Unit',
      image: req.body.image || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
      isPopular: true,
      ...req.body,
      id: req.body.id || `prod_${Date.now()}`,
      name,
      slug,
      price,
      mrp,
      stockCount,
      inStock,
      category,
      categorySlug,
    };

    productsDatabase.unshift(newProduct);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Update a product (Admin)
 * @route PUT /api/products/:id
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const index = productsDatabase.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    productsDatabase[index] = { ...productsDatabase[index], ...req.body };
    res.json({ success: true, data: productsDatabase[index] });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Delete a product (Admin)
 * @route DELETE /api/products/:id
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const initialLen = productsDatabase.length;
    productsDatabase = productsDatabase.filter((p) => p.id !== id);

    if (productsDatabase.length === initialLen) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
