const express = require('express');
const {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require('../controllers/addressController');
const { requireAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/addresses', requireAuth, asyncHandler(getAddresses));
router.post('/addresses', requireAuth, asyncHandler(createAddress));
router.put('/addresses/:id', requireAuth, asyncHandler(updateAddress));
router.delete('/addresses/:id', requireAuth, asyncHandler(deleteAddress));
router.patch('/addresses/:id/default', requireAuth, asyncHandler(setDefaultAddress));

module.exports = router;
