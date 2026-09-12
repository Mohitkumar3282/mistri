import Service from '../models/Service.js';
import { initialServices } from '../utils/mockData.js';

let inMemoryServices = [...initialServices];

/**
 * @desc    Fetch all available services with optional search & category filter
 * @route   GET /api/services
 * @access  Public
 */
export const getServices = async (req, res, next) => {
  try {
    const { category, search, popular } = req.query;

    try {
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }
      if (popular === 'true') {
        query.isPopular = true;
      }

      const services = await Service.find(query);
      if (services && services.length > 0) {
        return res.json({ success: true, count: services.length, data: services });
      }
    } catch (dbErr) {
      // Fallback to in-memory
    }

    let filtered = [...inMemoryServices];
    if (category && category !== 'All') {
      filtered = filtered.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (popular === 'true') {
      filtered = filtered.filter((s) => s.isPopular);
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single service by ID or Slug
 * @route   GET /api/services/:id
 * @access  Public
 */
export const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    try {
      const service = await Service.findOne({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { slug: id }],
      });
      if (service) {
        return res.json({ success: true, data: service });
      }
    } catch (dbErr) {}

    const service = inMemoryServices.find((s) => s._id === id || s.slug === id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new service
 * @route   POST /api/services
 * @access  Private (Admin)
 */
export const createService = async (req, res, next) => {
  try {
    const { title, category, description, basePrice, durationHours, icon, features, image } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newService = {
      title,
      slug,
      category,
      description,
      basePrice: Number(basePrice),
      durationHours: Number(durationHours) || 1,
      icon: icon || 'Wrench',
      image: image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
      features: features || [],
      rating: 5.0,
      reviewCount: 0,
      isPopular: false,
    };

    try {
      const created = await Service.create(newService);
      return res.status(201).json({ success: true, data: created });
    } catch (dbErr) {
      const mockCreated = { ...newService, _id: `srv_${Date.now()}` };
      inMemoryServices.push(mockCreated);
      return res.status(201).json({ success: true, data: mockCreated });
    }
  } catch (error) {
    next(error);
  }
};
