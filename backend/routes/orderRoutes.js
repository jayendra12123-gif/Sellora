const express = require('express');
const { getOrders, createOrder, cancelOrder, getOrderById } = require('../controllers/orderController');
const { requireAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/orders', requireAuth, asyncHandler(getOrders));
router.post('/orders', requireAuth, asyncHandler(createOrder));
router.post('/orders/:id/cancel', requireAuth, asyncHandler(cancelOrder));
router.get('/orders/:id', requireAuth, asyncHandler(getOrderById));

module.exports = router;
