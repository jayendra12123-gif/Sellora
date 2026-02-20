const { getUserAddresses, setUserAddresses } = require('./userService');
const { HttpError } = require('../utils/httpError');

const getAddresses = async (session) => getUserAddresses(session.userId);

const createAddress = async (session, payload) => {
  const { category, name, email, phone, street, city, state, zip, country, isDefault } = payload;

  if (!name || !street || !city || !zip) {
    throw new HttpError(400, 'Required fields: name, street, city, zip');
  }

  const newAddress = {
    id: `ADDR-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    category: category || 'home',
    name,
    email: email || '',
    phone: phone || '',
    street,
    city,
    state: state || '',
    zip,
    country: country || '',
    isDefault: isDefault || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  let userAddresses = await getUserAddresses(session.userId);

  if (newAddress.isDefault || userAddresses.length === 0) {
    newAddress.isDefault = true;
    userAddresses = userAddresses.map((a) => ({ ...a, isDefault: false }));
  }

  userAddresses.push(newAddress);
  await setUserAddresses(session.userId, userAddresses);

  return newAddress;
};

const updateAddress = async (session, addressId, payload) => {
  const { category, name, email, phone, street, city, state, zip, country, isDefault } = payload;

  let userAddresses = await getUserAddresses(session.userId);
  const addressIndex = userAddresses.findIndex((a) => a.id === addressId);

  if (addressIndex === -1) {
    throw new HttpError(404, 'Address not found');
  }

  const updated = {
    ...userAddresses[addressIndex],
    ...(name && { name }),
    ...(category && { category }),
    ...(email !== undefined && { email }),
    ...(phone !== undefined && { phone }),
    ...(street && { street }),
    ...(city && { city }),
    ...(state !== undefined && { state }),
    ...(zip && { zip }),
    ...(country !== undefined && { country }),
    ...(isDefault !== undefined && { isDefault }),
    updatedAt: new Date().toISOString(),
  };

  if (updated.isDefault) {
    userAddresses = userAddresses.map((a) => ({ ...a, isDefault: false }));
  }

  userAddresses[addressIndex] = updated;
  await setUserAddresses(session.userId, userAddresses);

  return updated;
};

const deleteAddress = async (session, addressId) => {
  let userAddresses = await getUserAddresses(session.userId);
  const addressIndex = userAddresses.findIndex((a) => a.id === addressId);

  if (addressIndex === -1) {
    throw new HttpError(404, 'Address not found');
  }

  const wasDefault = userAddresses[addressIndex].isDefault;
  userAddresses.splice(addressIndex, 1);

  if (wasDefault && userAddresses.length > 0) {
    userAddresses[0].isDefault = true;
  }

  await setUserAddresses(session.userId, userAddresses);
  return { success: true, message: 'Address deleted' };
};

const setDefaultAddress = async (session, addressId) => {
  let userAddresses = await getUserAddresses(session.userId);
  const addressIndex = userAddresses.findIndex((a) => a.id === addressId);

  if (addressIndex === -1) {
    throw new HttpError(404, 'Address not found');
  }

  userAddresses = userAddresses.map((a) => ({
    ...a,
    isDefault: a.id === addressId,
    updatedAt: new Date().toISOString(),
  }));

  await setUserAddresses(session.userId, userAddresses);
  return userAddresses[addressIndex];
};

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
