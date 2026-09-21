import { createAppModel, Mixed } from './appModel.js';

/**
 * What the server priced and asked Razorpay to collect for one checkout, keyed by the
 * Razorpay order id. When the order is placed, the payment is checked against this
 * amount and the order uses these lines and totals, so it matches what was paid even
 * if prices change in between.
 */
const PaymentIntent = createAppModel('PaymentIntent', {
  collection: 'payment_intents',
  fields: {
    userId: { type: String, index: true },
    amount: Number, // rupees
    amountPaise: Number,
    lines: [Mixed],
    totals: Mixed,
    couponCode: Mixed,
    status: { type: String, default: 'created' }, // created | used
    orderId: String,
    createdAt: { type: Date, default: Date.now },
  },
});

export default PaymentIntent;
