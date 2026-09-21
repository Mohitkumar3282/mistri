import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const adminOnly = [protect, authorize('admin')];

// Attach req.user when a valid Bearer token is present, but let anonymous requests through.
export const optionalProtect = (req, res, next) => {
  if (req.headers.authorization?.startsWith('Bearer')) return protect(req, res, next);
  next();
};

/**
 * Catalogue data everyone may read and only administrators may change
 * (products, categories, banners, ...).
 */
export const catalogRouter = (crud) => {
  const router = express.Router();
  router.get('/', crud.list);
  router.get('/:key', crud.get);
  router.post('/', ...adminOnly, crud.upsert);
  router.put('/:key', ...adminOnly, crud.upsert);
  router.patch('/:key', ...adminOnly, crud.patch);
  router.delete('/:key', ...adminOnly, crud.remove);
  return router;
};

/**
 * Records customers create and read for themselves while administrators manage all of
 * them (orders, bookings, quotations). The crud must be built with `scopeToOwner`.
 * `create` replaces the default create handler (orders price themselves on the server).
 */
export const ownedRouter = (crud, { create } = {}) => {
  const router = express.Router();
  router.get('/', protect, crud.list);
  router.get('/my', protect, crud.list);
  router.get('/:key', protect, crud.get);
  router.post('/', protect, create || crud.upsert);
  router.put('/:key', ...adminOnly, crud.upsert);
  router.patch('/:key', ...adminOnly, crud.patch);
  router.delete('/:key', ...adminOnly, crud.remove);
  return router;
};

/**
 * Records anyone may submit (including signed-out visitors) that only administrators
 * may read or manage (support messages).
 */
export const inboxRouter = (crud) => {
  const router = express.Router();
  router.post('/', optionalProtect, crud.upsert);
  router.get('/', ...adminOnly, crud.list);
  router.get('/:key', ...adminOnly, crud.get);
  router.put('/:key', ...adminOnly, crud.upsert);
  router.patch('/:key', ...adminOnly, crud.patch);
  router.delete('/:key', ...adminOnly, crud.remove);
  return router;
};

/** Administrator-only collections (admin notifications). */
export const adminRouter = (crud) => {
  const router = express.Router();
  router.use(...adminOnly);
  router.get('/', crud.list);
  router.get('/:key', crud.get);
  router.post('/', crud.upsert);
  router.put('/:key', crud.upsert);
  router.patch('/:key', crud.patch);
  router.delete('/:key', crud.remove);
  return router;
};
