import { createAppModel, Mixed } from './appModel.js';

// Contact / support messages sent from the storefront.
const SupportMessage = createAppModel('SupportMessage', {
  collection: 'support_messages',
  fields: {
    userId: { type: String, index: true },
    name: Mixed,
    email: Mixed,
    phone: Mixed,
    subject: Mixed,
    message: Mixed,
    status: Mixed,
    createdAt: Mixed,
  },
});

export default SupportMessage;
