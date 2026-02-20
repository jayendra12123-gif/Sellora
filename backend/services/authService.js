const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { User, Session, PasswordReset, Order } = require('../db/models');
const { SESSION_TTL_DAYS, BCRYPT_SALT_ROUNDS, PASSWORD_RESET_TTL_MINUTES } = require('../config/constants');
const { invalidateOrderStatsCache } = require('./orderStatsService');
const { normalizeEmail, isValidEmail } = require('../utils/validators');
const { HttpError } = require('../utils/httpError');

const createSession = async (user) => {
  const token = crypto.randomBytes(32).toString('hex');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

  await Session.create({
    token,
    userId: user._id,
    email: user.email,
    name: user.name,
    createdAt: now,
    lastSeenAt: now,
    expiresAt,
  });

  return token;
};

const signup = async ({ email, password, name }) => {
  if (!email || !password || !name) {
    throw new HttpError(400, 'Email, password, and name are required');
  }

  const normalizedEmail = normalizeEmail(email);
  if (!isValidEmail(normalizedEmail)) {
    throw new HttpError(400, 'Please provide a valid email address');
  }

  if (String(password).length < 6) {
    throw new HttpError(400, 'Password must be at least 6 characters');
  }

  const existingUser = await User.findOne({ email: normalizedEmail }).lean();
  if (existingUser) {
    throw new HttpError(400, 'User already exists with this email');
  }

  const passwordHash = await bcrypt.hash(String(password), BCRYPT_SALT_ROUNDS);
  const userId = crypto.randomUUID();

  const user = await User.create({
    _id: userId,
    email: normalizedEmail,
    name: String(name).trim(),
    passwordHash,
  });

  const token = await createSession(user);

  return {
    success: true,
    message: 'Account created successfully',
    user: { id: user._id, email: user.email, name: user.name, role: user.role, status: user.status, createdAt: user.createdAt },
    token,
  };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new HttpError(400, 'Email and password are required');
  }

  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail }).lean();

  if (!user) {
    throw new HttpError(401, 'Invalid email or password');
  }

  if (user.status && user.status !== 'active') {
    throw new HttpError(403, 'Account is disabled. Contact support.');
  }

  const passwordMatch = await bcrypt.compare(String(password), user.passwordHash);
  if (!passwordMatch) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const token = await createSession(user);

  return {
    success: true,
    message: 'Login successful',
    user: { id: user._id, email: user.email, name: user.name, role: user.role, status: user.status, createdAt: user.createdAt },
    token,
  };
};

const forgotPassword = async ({ email }) => {
  if (!email || typeof email !== 'string') {
    throw new HttpError(400, 'Email is required');
  }

  const normalizedEmail = normalizeEmail(email);
  const matchedUser = await User.findOne({ email: normalizedEmail }).lean();

  if (matchedUser) {
    const resetToken = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MINUTES * 60 * 1000);

    await PasswordReset.create({
      token: resetToken,
      userId: matchedUser._id,
      email: matchedUser.email,
      expiresAt,
    });
  }

  return {
    success: true,
    message: 'If this email exists, password reset instructions have been sent.',
  };
};

const logout = async ({ token }) => {
  if (token) {
    await Session.deleteOne({ token }).catch(() => {});
  }
  return { success: true, message: 'Logout successful' };
};

const getMe = async (session) => {
  const user = await User.findById(session.userId).lean();
  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  return {
    success: true,
    user: {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    },
  };
};

const changePassword = async (session, { currentPassword, newPassword }) => {
  if (!currentPassword || !newPassword) {
    throw new HttpError(400, 'Current password and new password are required');
  }

  if (currentPassword === newPassword) {
    throw new HttpError(400, 'New password must be different from current password');
  }

  if (String(newPassword).length < 6) {
    throw new HttpError(400, 'New password must be at least 6 characters');
  }

  const user = await User.findById(session.userId);
  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  const passwordMatch = await bcrypt.compare(String(currentPassword), user.passwordHash);
  if (!passwordMatch) {
    throw new HttpError(401, 'Current password is incorrect');
  }

  user.passwordHash = await bcrypt.hash(String(newPassword), BCRYPT_SALT_ROUNDS);
  await user.save();

  return {
    success: true,
    message: 'Password changed successfully',
  };
};

const deleteAccount = async (session) => {
  const userId = session.userId;
  const userExists = await User.exists({ _id: userId });
  if (!userExists) {
    throw new HttpError(404, 'User not found');
  }

  const result = await Order.updateMany(
    { userId, status: { $nin: ['cancelled', 'delivered'] } },
    { $set: { status: 'cancelled', updatedAt: new Date() } }
  );

  await Session.deleteMany({ userId }).catch(() => {});
  await PasswordReset.deleteMany({ userId }).catch(() => {});
  await User.deleteOne({ _id: userId });

  invalidateOrderStatsCache();

  return {
    success: true,
    message: 'Account deleted successfully',
    ordersCancelled: result?.modifiedCount ?? result?.nModified ?? 0,
  };
};

module.exports = {
  createSession,
  signup,
  login,
  forgotPassword,
  logout,
  getMe,
  changePassword,
  deleteAccount,
};
