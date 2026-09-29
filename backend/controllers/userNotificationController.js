import UserNotification from '../models/UserNotification.js';
import User from '../models/User.js';
import DeviceToken from '../models/DeviceToken.js';
import { sendPushToTokens, ADMIN_OWNER_ID } from '../utils/push.js';

/**
 * @desc  Send a notification to every customer, or to one named customer. Persists it
 *        (so it still shows up for someone who opens the app later) and sends a real
 *        push to whatever devices are currently registered.
 * @route POST /api/admin/send-notification  { audience: 'all'|'user', userId?, title, message }
 * @access Admin
 */
export const sendNotification = async (req, res) => {
  try {
    const { audience, userId, title, message } = req.body || {};
    const cleanTitle = String(title || '').trim();
    const cleanMessage = String(message || '').trim();

    if (!cleanTitle || !cleanMessage) {
      return res.status(400).json({ success: false, message: 'Please provide a title and message' });
    }
    if (!['all', 'user'].includes(audience)) {
      return res.status(400).json({ success: false, message: 'audience must be "all" or "user"' });
    }

    let targetUser = null;
    if (audience === 'user') {
      if (!userId) return res.status(400).json({ success: false, message: 'Please choose a user' });
      targetUser = await User.findById(userId).lean().catch(() => null);
      if (!targetUser) return res.status(404).json({ success: false, message: 'User not found' });
    }

    const doc = await UserNotification.create({
      id: `unot_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      audience,
      userId: audience === 'user' ? String(userId) : undefined,
      userName: targetUser?.name,
      title: cleanTitle,
      message: cleanMessage,
      type: 'admin_broadcast',
      createdAt: new Date().toISOString(),
    });

    // Real push, to every registered customer device or just the chosen one's.
    const tokenFilter =
      audience === 'all' ? { ownerId: { $ne: ADMIN_OWNER_ID } } : { ownerId: String(userId) };
    const tokens = (await DeviceToken.find(tokenFilter).lean()).map((d) => d.id);
    const pushResult = await sendPushToTokens(tokens, {
      title: cleanTitle,
      body: cleanMessage,
      data: { url: '/notifications' },
    });
    if (pushResult.invalidTokens?.length) {
      await DeviceToken.deleteMany({ id: { $in: pushResult.invalidTokens } }).catch(() => {});
    }

    res.status(201).json({
      success: true,
      data: doc.toJSON(),
      recipientDevices: tokens.length,
      pushSent: pushResult.sent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc  A brief, recent send history for the admin composer (who got what).
 * @route GET /api/admin/send-notification
 * @access Admin
 */
export const listSentNotifications = async (req, res) => {
  try {
    const docs = await UserNotification.find().sort({ _id: -1 }).limit(50).lean();
    res.json({ success: true, count: docs.length, data: docs.map(({ _id, ...d }) => d) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc  Notifications visible to the signed-in person: broadcasts to everyone, plus
 *        anything sent to them by name.
 * @route GET /api/notifications
 * @access Private
 */
export const getMyNotifications = async (req, res) => {
  try {
    const docs = await UserNotification.find({
      $or: [{ audience: 'all' }, { userId: String(req.user._id) }],
    })
      .sort({ _id: -1 })
      .limit(100)
      .lean();
    res.json({ success: true, count: docs.length, data: docs.map(({ _id, ...d }) => d) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
