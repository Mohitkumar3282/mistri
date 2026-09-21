import crypto from 'crypto';

const API = 'https://api.razorpay.com/v1';

const keys = () => ({
  keyId: process.env.RAZORPAY_KEY_ID || '',
  keySecret: process.env.RAZORPAY_KEY_SECRET || '',
});

export const isConfigured = () => {
  const { keyId, keySecret } = keys();
  return Boolean(keyId && keySecret);
};

export const publicKey = () => keys().keyId;

// Opt-in development mode that accepts payments without a gateway signature.
export const sandboxAllowed = () => process.env.ALLOW_SANDBOX_PAYMENTS === 'true';

const call = async (path, { method = 'GET', body } = {}) => {
  const { keyId, keySecret } = keys();
  const response = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64'),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data?.error?.description || `Razorpay request failed (${response.status})`);
    err.status = response.status;
    throw err;
  }
  return data;
};

/** Create a Razorpay order for an amount in rupees. */
export const createGatewayOrder = ({ amountRupees, receipt, notes }) =>
  call('/orders', {
    method: 'POST',
    body: {
      amount: Math.round(Number(amountRupees) * 100),
      currency: 'INR',
      receipt,
      notes,
    },
  });

/** True when the checkout signature was produced by Razorpay for this order + payment. */
export const signatureIsValid = ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  const { keySecret } = keys();
  if (!keySecret || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) return false;
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(String(razorpaySignature));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

/**
 * Confirm a checkout payment really happened: the signature must be genuine and the
 * payment, fetched from Razorpay, must belong to the order, be authorised or captured,
 * and be for exactly the expected amount.
 * @returns {Promise<{ ok: boolean, reason?: string, payment?: object }>}
 */
export const confirmPayment = async ({ razorpayOrderId, razorpayPaymentId, razorpaySignature, expectedAmountPaise }) => {
  if (!signatureIsValid({ razorpayOrderId, razorpayPaymentId, razorpaySignature })) {
    return { ok: false, reason: 'Payment signature is invalid' };
  }

  let payment;
  try {
    payment = await call(`/payments/${encodeURIComponent(razorpayPaymentId)}`);
  } catch (err) {
    return { ok: false, reason: `Could not confirm the payment with Razorpay: ${err.message}` };
  }

  if (payment.order_id !== razorpayOrderId) return { ok: false, reason: 'Payment does not belong to this order' };
  if (!['captured', 'authorized'].includes(payment.status)) {
    return { ok: false, reason: `Payment is ${payment.status}, not completed` };
  }
  if (payment.currency !== 'INR' || Number(payment.amount) !== Number(expectedAmountPaise)) {
    return { ok: false, reason: 'Paid amount does not match the order total' };
  }
  return { ok: true, payment };
};
