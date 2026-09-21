import { createAppModel, Mixed } from './appModel.js';

// Technician services offered on the platform.
const Service = createAppModel('Service', {
  collection: 'services',
  fields: {
    title: { type: String, trim: true },
    slug: { type: String, trim: true },
    category: Mixed,
    description: Mixed,
    basePrice: Mixed,
    durationHours: Mixed,
    icon: Mixed,
    image: Mixed,
    features: [Mixed],
    rating: Mixed,
    reviewCount: Mixed,
    isPopular: Mixed,
  },
});

export default Service;
