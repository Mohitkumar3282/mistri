import { createAppModel, Mixed } from './appModel.js';

// Bulk / project quotation requests from customers.
const Quotation = createAppModel('Quotation', {
  collection: 'quotations',
  fields: {
    userId: { type: String, index: true },
    customerName: Mixed,
    customerPhone: Mixed,
    customerEmail: { type: String, lowercase: true, trim: true, index: true },
    items: Mixed,
    status: Mixed,
    estimatedTotal: Mixed,
    adminNotes: Mixed,
    createdAt: Mixed,
  },
});

export default Quotation;
