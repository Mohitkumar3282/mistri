import { createAppModel } from './appModel.js';

// Platform settings. A single document with key "site" holds the whole settings object.
const Setting = createAppModel('Setting', {
  key: 'key',
  collection: 'settings',
});

export default Setting;
