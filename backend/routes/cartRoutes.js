const express = require('express');
const { getCart, addToCart, removeFromCart, updateCartItem } = require('../controllers/cartController');
const { requireAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/cart', requireAuth, asyncHandler(getCart));
router.post('/cart', requireAuth, asyncHandler(addToCart));
router.delete('/cart/:id', requireAuth, asyncHandler(removeFromCart));
router.put('/cart/:id', requireAuth, asyncHandler(updateCartItem));

module.exports = router;
