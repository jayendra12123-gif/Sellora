const express = require('express');
const { getProducts, getProductById } = require('../controllers/productController');
const { asyncHandler } = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/products', asyncHandler(getProducts));
router.get('/products/:id', asyncHandler(getProductById));

module.exports = router;
