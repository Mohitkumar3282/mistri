import { CATEGORIES, CATEGORY_SECTIONS } from '../../frontend/src/data/mockData.js';

let categoriesDatabase = [...CATEGORIES];
let sectionsDatabase = [...CATEGORY_SECTIONS];

/**
 * @desc Get all categories
 * @route GET /api/categories
 */
export const getCategories = async (req, res) => {
  try {
    res.json({
      success: true,
      count: categoriesDatabase.length,
      data: categoriesDatabase,
      sections: sectionsDatabase,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get category by slug or id
 * @route GET /api/categories/:idOrSlug
 */
export const getCategoryByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const cat = categoriesDatabase.find(
      (c) => c.slug === idOrSlug || c.id === idOrSlug
    );

    if (!cat) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, data: cat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Create new category (Admin)
 * @route POST /api/categories
 */
export const createCategory = async (req, res) => {
  try {
    const sectionName = req.body.section || 'Civil & Interiors';
    const newCategory = {
      id: `cat_${Date.now()}`,
      slug: req.body.slug || req.body.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      itemCount: 0,
      section: sectionName,
      ...req.body,
    };

    categoriesDatabase.push(newCategory);

    // Sync sections
    const existingSec = sectionsDatabase.find(
      (s) => (s.title || s.name)?.toLowerCase() === sectionName.toLowerCase()
    );
    if (existingSec) {
      if (!existingSec.categories) existingSec.categories = [];
      existingSec.categories.push(newCategory);
    } else {
      sectionsDatabase.push({
        id: `sec_${Date.now()}`,
        title: sectionName,
        categories: [newCategory],
        isActive: true,
      });
    }

    res.status(201).json({ success: true, data: newCategory, sections: sectionsDatabase });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Update category (Admin)
 * @route PUT /api/categories/:id
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const index = categoriesDatabase.findIndex((c) => c.id === id || c.slug === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    categoriesDatabase[index] = { ...categoriesDatabase[index], ...req.body };
    res.json({ success: true, data: categoriesDatabase[index] });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Delete category (Admin)
 * @route DELETE /api/categories/:id
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const initialLen = categoriesDatabase.length;
    categoriesDatabase = categoriesDatabase.filter((c) => c.id !== id && c.slug !== id);

    if (categoriesDatabase.length === initialLen) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, message: 'Category removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
