/**
 * Generic MongoDB CRUD handlers for app-owned collections (see models/appModel.js).
 *
 * Records are addressed by their string business key (`id`, `code`, ...). Writes are
 * idempotent upserts so the admin panel can safely retry a save.
 *
 * Options:
 *  - sort:          sort order for list queries (default: newest first)
 *  - scopeToOwner:  non-admin callers only see and create their own records
 *  - onCreate:      async (doc, req) => void, runs after a new record is inserted
 */

const isAdmin = (req) => req.user?.role === 'admin';

// Strip Mongo internals and anything a client must not control.
const clean = (doc) => {
  if (!doc) return doc;
  const { _id, __v, ...rest } = doc;
  return rest;
};

const ownerFilter = (req) => {
  const clauses = [{ userId: String(req.user._id) }];
  if (req.user.email) clauses.push({ customerEmail: String(req.user.email).toLowerCase() });
  return { $or: clauses };
};

const sendError = (res, error) => {
  if (error?.name === 'CastError' || error?.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: error.message });
  }
  if (error?.code === 11000) {
    return res.status(409).json({ success: false, message: 'A record with this key already exists' });
  }
  console.error(error);
  return res.status(500).json({ success: false, message: error?.message || 'Server error' });
};

export const buildCrud = (Model, { sort = { _id: -1 }, scopeToOwner = false, onCreate } = {}) => {
  const key = Model.appKey || 'id';

  const scopedFilter = (req, extra = {}) =>
    scopeToOwner && !isAdmin(req) ? { $and: [extra, ownerFilter(req)] } : extra;

  const list = async (req, res) => {
    try {
      const docs = await Model.find(scopedFilter(req)).sort(sort).lean();
      res.json({ success: true, count: docs.length, data: docs.map(clean) });
    } catch (error) {
      sendError(res, error);
    }
  };

  const get = async (req, res) => {
    try {
      const doc = await Model.findOne(scopedFilter(req, { [key]: req.params.key })).lean();
      if (!doc) return res.status(404).json({ success: false, message: 'Record not found' });
      res.json({ success: true, data: clean(doc) });
    } catch (error) {
      sendError(res, error);
    }
  };

  // Full-document upsert. Admins may create or replace; other callers may only create.
  const upsert = async (req, res) => {
    try {
      const keyValue = String(req.params.key ?? req.body?.[key] ?? '').trim();
      if (!keyValue) {
        return res.status(400).json({ success: false, message: `Missing "${key}"` });
      }

      const existing = await Model.findOne({ [key]: keyValue }).lean();
      if (existing && !isAdmin(req)) {
        return res.status(409).json({ success: false, message: 'This record already exists' });
      }

      const doc = { ...clean(req.body || {}), [key]: keyValue };
      if (scopeToOwner && !isAdmin(req)) {
        // Stamp ownership server side so customers can find their own records later.
        doc.userId = String(req.user._id);
        if (req.user.email && !doc.customerEmail) doc.customerEmail = String(req.user.email).toLowerCase();
      } else if (existing?.userId && !doc.userId) {
        // An admin edit must not detach a record from the customer who owns it.
        doc.userId = existing.userId;
      }

      await Model.replaceOne({ [key]: keyValue }, doc, { upsert: true, runValidators: true });
      const saved = clean(await Model.findOne({ [key]: keyValue }).lean());

      if (!existing && onCreate) {
        Promise.resolve(onCreate(saved, req)).catch((err) =>
          console.warn(`${Model.modelName} onCreate hook failed:`, err.message)
        );
      }

      res.status(existing ? 200 : 201).json({ success: true, data: saved });
    } catch (error) {
      sendError(res, error);
    }
  };

  // Partial update: merges the given top-level fields into an existing record.
  const patch = async (req, res) => {
    try {
      const { [key]: _ignored, ...fields } = clean(req.body || {});
      const saved = await Model.findOneAndUpdate(
        { [key]: req.params.key },
        { $set: fields },
        { new: true, runValidators: true }
      ).lean();
      if (!saved) return res.status(404).json({ success: false, message: 'Record not found' });
      res.json({ success: true, data: clean(saved) });
    } catch (error) {
      sendError(res, error);
    }
  };

  // Deleting something already gone is not an error, so retried deletes stay harmless.
  const remove = async (req, res) => {
    try {
      const result = await Model.deleteOne({ [key]: req.params.key });
      res.json({ success: true, deleted: result.deletedCount });
    } catch (error) {
      sendError(res, error);
    }
  };

  return { list, get, upsert, patch, remove };
};

export default buildCrud;
