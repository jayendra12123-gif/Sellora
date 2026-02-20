const express = require('express');
const {
  getSummary,
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  listOrders,
  updateOrderStatus,
  listUsers,
  updateUser,
  deleteUser,
  listCollections,
  createCollection,
  updateCollection,
  deleteCollection,
  listContent,
  upsertContent,
} = require('../controllers/adminController');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const { asyncHandler } = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/admin/summary', requireAuth, requireAdmin, asyncHandler(getSummary));

router.get('/admin/products', requireAuth, requireAdmin, asyncHandler(listProducts));
router.post('/admin/products', requireAuth, requireAdmin, asyncHandler(createProduct));
router.put('/admin/products/:id', requireAuth, requireAdmin, asyncHandler(updateProduct));
router.delete('/admin/products/:id', requireAuth, requireAdmin, asyncHandler(deleteProduct));

router.get('/admin/orders', requireAuth, requireAdmin, asyncHandler(listOrders));
router.put('/admin/orders/:id/status', requireAuth, requireAdmin, asyncHandler(updateOrderStatus));

router.get('/admin/users', requireAuth, requireAdmin, asyncHandler(listUsers));
router.put('/admin/users/:id', requireAuth, requireAdmin, asyncHandler(updateUser));
router.delete('/admin/users/:id', requireAuth, requireAdmin, asyncHandler(deleteUser));

router.get('/admin/collections', requireAuth, requireAdmin, asyncHandler(listCollections));
router.post('/admin/collections', requireAuth, requireAdmin, asyncHandler(createCollection));
router.put('/admin/collections/:slug', requireAuth, requireAdmin, asyncHandler(updateCollection));
router.delete('/admin/collections/:slug', requireAuth, requireAdmin, asyncHandler(deleteCollection));

router.get('/admin/content', requireAuth, requireAdmin, asyncHandler(listContent));
router.put('/admin/content/:key', requireAuth, requireAdmin, asyncHandler(upsertContent));

module.exports = router;
