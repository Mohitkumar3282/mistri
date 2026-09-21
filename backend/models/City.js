import { createAppModel } from './appModel.js';

// Serviceable delivery cities.
const City = createAppModel('City', {
  key: 'name',
  collection: 'cities',
});

export default City;
