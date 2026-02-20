const express = require('express');
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favoriteController');
const { requireAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/favorites', requireAuth, asyncHandler(getFavorites));
router.post('/favorites/:id', requireAuth, asyncHandler(addFavorite));
router.delete('/favorites/:id', requireAuth, asyncHandler(removeFavorite));

module.exports = router;
