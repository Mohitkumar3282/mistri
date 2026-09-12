import Mistri from '../models/Mistri.js';
import { initialMistris } from '../utils/mockData.js';

let inMemoryMistris = [...initialMistris];

/**
 * @desc    Get all verified Mistris / Technicians with filtering
 * @route   GET /api/mistris
 * @access  Public
 */
export const getMistris = async (req, res, next) => {
  try {
    const { city, profession, search } = req.query;

    try {
      let query = {};
      if (city) query.city = { $regex: city, $options: 'i' };
      if (profession) query.profession = { $regex: profession, $options: 'i' };
      if (search) {
        query.$or = [
          { fullName: { $regex: search, $options: 'i' } },
          { profession: { $regex: search, $options: 'i' } },
          { specializations: { $in: [new RegExp(search, 'i')] } },
        ];
      }

      const mistris = await Mistri.find(query);
      if (mistris && mistris.length > 0) {
        return res.json({ success: true, count: mistris.length, data: mistris });
      }
    } catch (dbErr) {
      // Fallback
    }

    let filtered = [...inMemoryMistris];
    if (city) {
      filtered = filtered.filter((m) => m.city.toLowerCase() === city.toLowerCase());
    }
    if (profession) {
      filtered = filtered.filter((m) => m.profession.toLowerCase().includes(profession.toLowerCase()));
    }
    if (search) {
      filtered = filtered.filter(
        (m) =>
          m.fullName.toLowerCase().includes(search.toLowerCase()) ||
          m.profession.toLowerCase().includes(search.toLowerCase()) ||
          m.specializations.some((s) => s.toLowerCase().includes(search.toLowerCase()))
      );
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single Mistri profile by ID
 * @route   GET /api/mistris/:id
 * @access  Public
 */
export const getMistriById = async (req, res, next) => {
  try {
    const { id } = req.params;

    try {
      const mistri = await Mistri.findById(id);
      if (mistri) {
        return res.json({ success: true, data: mistri });
      }
    } catch (dbErr) {}

    const mistri = inMemoryMistris.find((m) => m._id === id);
    if (!mistri) {
      return res.status(404).json({ success: false, message: 'Technician/Mistri profile not found' });
    }

    res.json({ success: true, data: mistri });
  } catch (error) {
    next(error);
  }
};
