const express = require('express');
const { getContent, getContentBySlug } = require('../controllers/contentController');
const { asyncHandler } = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/content', asyncHandler(getContent));
router.get('/content/:slug', asyncHandler(getContentBySlug));
router.get('/terms', asyncHandler((req, res) => getContentBySlug({ ...req, params: { slug: 'terms' } }, res)));
router.get('/privacy', asyncHandler((req, res) => getContentBySlug({ ...req, params: { slug: 'privacy' } }, res)));
router.get('/privacy-policy', asyncHandler((req, res) => getContentBySlug({ ...req, params: { slug: 'privacy-policy' } }, res)));

module.exports = router;
