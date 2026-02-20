const express = require('express');
const { searchProducts } = require('../controllers/searchController');
const { asyncHandler } = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/search', asyncHandler(searchProducts));

module.exports = router;
