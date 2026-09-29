import { createAppModel, Mixed } from './appModel.js';

/**
 * Notifications the admin sends to customers - either everyone ("all") or one named
 * person ("user"). Read/unread state is tracked client-side only, the same way the
 * order-confirmation notifications this feed is merged with already work.
 */
const UserNotification = createAppModel('UserNotification', {
  collection: 'user_notifications',
  fields: {
    audience: String, // 'all' | 'user'
    userId: { type: String, index: true }, // set only when audience === 'user'
    userName: Mixed,
    title: Mixed,
    message: Mixed,
    type: Mixed,
    createdAt: Mixed,
  },
});

export default UserNotification;
