import { createAppModel, Mixed } from './appModel.js';

// Marketing banners shown on the storefront.
const Banner = createAppModel('Banner', {
  collection: 'banners',
  fields: {
    title: Mixed,
    subtitle: Mixed,
    image: Mixed,
    link: Mixed,
    badge: Mixed,
    position: Mixed, // 'hero' | 'bottom'
    ctaText: Mixed,
    target: Mixed,
    gradient: Mixed,
    accent: Mixed,
    showTextOverlay: Mixed,
    imageFit: Mixed,
    sortOrder: Mixed,
    isActive: Mixed,
  },
});

export default Banner;
