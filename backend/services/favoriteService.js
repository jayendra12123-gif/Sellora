const { loadProducts } = require('./productService');
const { getUserFavorites, setUserFavorites } = require('./userService');
const { HttpError } = require('../utils/httpError');

const getFavorites = async (session) => getUserFavorites(session.userId);

const addFavorite = async (session, productId) => {
  const parsedProductId = Number.parseInt(productId, 10);
  if (!Number.isInteger(parsedProductId)) {
    throw new HttpError(400, 'Invalid product id');
  }

  const products = await loadProducts();
  const productExists = products.some((product) => product.id === parsedProductId);
  if (!productExists) {
    throw new HttpError(404, 'Product not found');
  }

  const userFavorites = await getUserFavorites(session.userId);
  if (!userFavorites.includes(parsedProductId)) {
    userFavorites.push(parsedProductId);
  }

  await setUserFavorites(session.userId, userFavorites);
  return userFavorites;
};

const removeFavorite = async (session, productId) => {
  const parsedProductId = Number.parseInt(productId, 10);
  if (!Number.isInteger(parsedProductId)) {
    throw new HttpError(400, 'Invalid product id');
  }

  const userFavorites = (await getUserFavorites(session.userId)).filter((id) => id !== parsedProductId);
  await setUserFavorites(session.userId, userFavorites);
  return userFavorites;
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
