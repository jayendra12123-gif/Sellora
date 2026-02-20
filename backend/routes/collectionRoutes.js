const express = require('express');
const { getCollections } = require('../controllers/collectionController');
const { asyncHandler } = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/collections', asyncHandler(getCollections));

module.exports = router;
