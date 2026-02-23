const express = require('express');
const {
  createPaymentOrder,
  verifyPayment,
  listTransactions,
  refundPayment,
} = require('../controllers/payment.controller');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const { asyncHandler } = require('../middleware/asyncHandler');

const router = express.Router();

router.post('/payments/create-order', requireAuth, asyncHandler(createPaymentOrder));
router.post('/payments/verify-payment', requireAuth, asyncHandler(verifyPayment));
router.get('/admin/transactions', requireAuth, requireAdmin, asyncHandler(listTransactions));
router.post('/admin/refund', requireAuth, requireAdmin, asyncHandler(refundPayment));

module.exports = router;
