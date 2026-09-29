/**
 * Real cross-device push notifications via Firebase Cloud Messaging.
 *
 * Requires FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY (a
 * service account - see backend/.env.example). Without them, sends are silently
 * skipped, so the rest of the app still works.
 */
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import DeviceToken from '../models/DeviceToken.js';

export const ADMIN_OWNER_ID = 'usr_admin_root';

export const isPushConfigured = () =>
  Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);

let firebaseApp = null;
const getFirebaseApp = () => {
  if (!isPushConfigured()) return null;
  if (!firebaseApp) {
    firebaseApp =
      getApps()[0] ||
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // .env stores the key with literal \n sequences (real newlines break .env parsing).
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
  }
  return firebaseApp;
};

if (!isPushConfigured()) {
  console.warn('⚠️ Firebase Admin credentials are not set - push notifications will be skipped.');
}

// Errors that mean this specific token will never work again - safe to stop storing it.
const TOKEN_ERROR_CODES = new Set([
  'messaging/invalid-registration-token',
  'messaging/registration-token-not-registered',
  'messaging/invalid-argument', // malformed token (e.g. a stale or corrupted value)
]);

/**
 * Send a push notification to one or more FCM device tokens.
 * @returns {Promise<{ sent: number, failed: number, invalidTokens: string[] }>}
 *          invalidTokens are tokens FCM reports as dead - the caller should stop storing them.
 */
export const sendPushToTokens = async (tokens, { title, body, data = {} } = {}) => {
  const list = [...new Set((Array.isArray(tokens) ? tokens : [tokens]).filter(Boolean))];
  if (!list.length) return { sent: 0, failed: 0, invalidTokens: [] };

  const app = getFirebaseApp();
  if (!app) return { sent: 0, failed: 0, invalidTokens: [], skipped: 'not_configured' };

  // Sent as a data-only message (no top-level `notification` field) so our own
  // service worker (sw.js) is always the one deciding how to display it, on every
  // browser, foreground or background - a mixed notification+data payload is handled
  // inconsistently across browsers and was silently overriding our title/body with a
  // generic fallback. FCM's `data` payload must be flat string key/values.
  const stringData = Object.fromEntries(
    Object.entries({ ...data, title, body }).map(([k, v]) => [k, String(v ?? '')])
  );

  try {
    const response = await getMessaging(app).sendEachForMulticast({
      tokens: list,
      data: stringData,
      webpush: {
        fcmOptions: { link: data.url || '/' },
      },
    });

    const invalidTokens = [];
    response.responses.forEach((r, i) => {
      if (!r.success && TOKEN_ERROR_CODES.has(r.error?.code)) invalidTokens.push(list[i]);
      else if (!r.success) console.warn('Push send failed:', r.error?.code, r.error?.message);
    });

    return { sent: response.successCount, failed: response.failureCount, invalidTokens };
  } catch (error) {
    console.warn('Push send error:', error.message);
    return { sent: 0, failed: list.length, invalidTokens: [] };
  }
};

/** Register a device token for a person (a User's _id, or ADMIN_OWNER_ID). */
export const saveDeviceToken = (token, ownerId, role = 'customer') =>
  DeviceToken.updateOne({ id: token }, { $set: { id: token, ownerId: String(ownerId), role } }, { upsert: true });

const tokensFor = async (ownerId) =>
  (await DeviceToken.find({ ownerId: String(ownerId) }).lean()).map((d) => d.id);

/** Send a push to everyone registered for an owner id, then drop any tokens FCM rejects. */
export const sendPushToOwner = async (ownerId, message) => {
  const tokens = await tokensFor(ownerId);
  const result = await sendPushToTokens(tokens, message);
  if (result.invalidTokens?.length) {
    await DeviceToken.deleteMany({ id: { $in: result.invalidTokens } }).catch(() => {});
  }
  return result;
};

/** Send a push to every device the admin has registered. */
export const sendPushToAdmin = (message) => sendPushToOwner(ADMIN_OWNER_ID, message);
