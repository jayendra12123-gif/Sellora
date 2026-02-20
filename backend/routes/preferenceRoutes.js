const express = require('express');
const { getPreferences, updatePreferences } = require('../controllers/preferenceController');
const { requireAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/preferences', requireAuth, asyncHandler(getPreferences));
router.put('/preferences', requireAuth, asyncHandler(updatePreferences));

module.exports = router;
