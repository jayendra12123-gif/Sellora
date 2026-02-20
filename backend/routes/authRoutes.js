const express = require('express');
const {
  signup,
  login,
  forgotPassword,
  logout,
  me,
  changePassword,
  deleteAccount,
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/asyncHandler');

const router = express.Router();

router.post('/auth/signup', asyncHandler(signup));
router.post('/auth/login', asyncHandler(login));
router.post('/auth/forgot-password', asyncHandler(forgotPassword));
router.post('/forgot-password', asyncHandler(forgotPassword));
router.post('/auth/logout', asyncHandler(logout));
router.get('/auth/me', requireAuth, asyncHandler(me));
router.post('/auth/change-password', requireAuth, asyncHandler(changePassword));
router.delete('/auth/account', requireAuth, asyncHandler(deleteAccount));

module.exports = router;
