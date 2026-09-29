import { createAppModel } from './appModel.js';

/**
 * FCM device tokens for push notifications, one document per token (a person may have
 * several: phone, desktop browser, ...). Kept in its own collection rather than on the
 * Setting document, because Settings is fully replaced on every save and would silently
 * drop tokens stored there.
 */
const DeviceToken = createAppModel('DeviceToken', {
  key: 'id', // the FCM token itself
  collection: 'device_tokens',
  fields: {
    ownerId: { type: String, index: true }, // a User's _id, or 'usr_admin_root' for the admin
    role: String,
    createdAt: { type: Date, default: Date.now },
  },
});

export default DeviceToken;
