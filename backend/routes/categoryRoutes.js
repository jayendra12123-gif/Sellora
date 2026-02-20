const express = require('express');
const { getCategories } = require('../controllers/categoryController');
const { asyncHandler } = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/categories', asyncHandler(getCategories));

module.exports = router;
