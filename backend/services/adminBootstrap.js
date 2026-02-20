const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { User } = require('../db/models');
const { BCRYPT_SALT_ROUNDS } = require('../config/constants');
const { normalizeEmail } = require('../utils/validators');

const ADMIN_EMAIL = 'admin@sellora.com';
const ADMIN_PASSWORD = 'Sellora123';
const ADMIN_NAME = 'Sellora Admin';

const ensureAdminUser = async () => {
  const normalizedEmail = normalizeEmail(ADMIN_EMAIL);
  let user = await User.findOne({ email: normalizedEmail });
  const passwordHash = await bcrypt.hash(String(ADMIN_PASSWORD), BCRYPT_SALT_ROUNDS);

  if (!user) {
    user = await User.create({
      _id: crypto.randomUUID(),
      email: normalizedEmail,
      name: ADMIN_NAME,
      passwordHash,
      role: 'admin',
      status: 'active',
    });
    return { created: true, updated: false, userId: user._id };
  }

  let updated = false;

  if (user.role !== 'admin') {
    user.role = 'admin';
    updated = true;
  }

  if (user.status !== 'active') {
    user.status = 'active';
    updated = true;
  }

  const passwordMatches = await bcrypt.compare(String(ADMIN_PASSWORD), user.passwordHash);
  if (!passwordMatches) {
    user.passwordHash = passwordHash;
    updated = true;
  }

  if (updated) {
    await user.save();
  }

  return { created: false, updated, userId: user._id };
};

module.exports = {
  ensureAdminUser,
};
