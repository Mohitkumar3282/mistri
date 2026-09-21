import { createAppModel, Mixed } from './appModel.js';

// Marketing banners shown on the storefront.
const Banner = createAppModel('Banner', {
  collection: 'banners',
  fields: {
    title: Mixed,
    subtitle: Mixed,
    image: Mixed,
    link: Mixed,
    isActive: Mixed,
  },
});

export default Banner;
