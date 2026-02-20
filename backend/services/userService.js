const { User } = require('../db/models');

const DEFAULT_PREFERENCES = {
  emailNotifications: true,
  smsNotifications: false,
  theme: 'light',
};

const getUserCart = async (userId) => {
  const user = await User.findById(userId).select('cart').lean();
  return Array.isArray(user?.cart) ? user.cart : [];
};

const setUserCart = async (userId, items) => {
  const normalized = Array.isArray(items)
    ? items
      .map((item) => ({
        id: Number.parseInt(item.id, 10),
        quantity: Number.parseInt(item.quantity, 10),
      }))
      .filter((item) => Number.isInteger(item.id) && Number.isInteger(item.quantity) && item.quantity > 0)
    : [];

  await User.updateOne({ _id: userId }, { $set: { cart: normalized } });
  return normalized;
};

const getUserAddresses = async (userId) => {
  const user = await User.findById(userId).select('addresses').lean();
  return Array.isArray(user?.addresses) ? user.addresses : [];
};

const setUserAddresses = async (userId, userAddresses) => {
  await User.updateOne({ _id: userId }, { $set: { addresses: userAddresses } });
};

const getUserPreferences = async (userId) => {
  const user = await User.findById(userId).select('preferences').lean();
  return { ...DEFAULT_PREFERENCES, ...(user?.preferences || {}) };
};

const setUserPreferences = async (userId, userPreferences) => {
  const current = await getUserPreferences(userId);
  const merged = { ...current, ...userPreferences };
  await User.updateOne({ _id: userId }, { $set: { preferences: merged } });
  return merged;
};

const getUserFavorites = async (userId) => {
  const user = await User.findById(userId).select('favorites').lean();
  return Array.isArray(user?.favorites) ? user.favorites : [];
};

const setUserFavorites = async (userId, userFavorites) => {
  await User.updateOne({ _id: userId }, { $set: { favorites: userFavorites } });
};

module.exports = {
  DEFAULT_PREFERENCES,
  getUserCart,
  setUserCart,
  getUserAddresses,
  setUserAddresses,
  getUserPreferences,
  setUserPreferences,
  getUserFavorites,
  setUserFavorites,
};
