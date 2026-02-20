const { loadProducts, createDecoratorContext, findDecoratedProductById } = require('./productService');
const { getCartWithDecoratedProducts } = require('./enrichmentService');
const { getUserCart, setUserCart } = require('./userService');
const { HttpError } = require('../utils/httpError');

const getCart = async (session) => {
  const userCart = await getUserCart(session.userId);
  const products = await loadProducts();
  const context = await createDecoratorContext(products);
  return getCartWithDecoratedProducts(userCart, context, products);
};

const addToCart = async (session, { productId, quantity }) => {
  const parsedProductId = parseInt(productId, 10);
  const qty = Number.parseInt(quantity, 10) || 1;

  const products = await loadProducts();
  const context = await createDecoratorContext(products);
  const product = findDecoratedProductById(parsedProductId, context, products);

  if (!product) {
    throw new HttpError(404, 'Product not found');
  }

  const userCart = await getUserCart(session.userId);
  const existingItemIndex = userCart.findIndex((item) => item.id === parsedProductId);

  if (existingItemIndex > -1) {
    userCart[existingItemIndex].quantity += qty;
  } else {
    userCart.push({ id: product.id, quantity: qty });
  }

  await setUserCart(session.userId, userCart);
  return getCartWithDecoratedProducts(userCart, context, products);
};

const removeFromCart = async (session, productId) => {
  const parsedProductId = parseInt(productId, 10);
  const userCart = (await getUserCart(session.userId)).filter((item) => item.id !== parsedProductId);
  const products = await loadProducts();
  const context = await createDecoratorContext(products);

  await setUserCart(session.userId, userCart);
  return getCartWithDecoratedProducts(userCart, context, products);
};

const updateCartItem = async (session, productId, { quantity }) => {
  const parsedProductId = parseInt(productId, 10);
  const qty = Number.parseInt(quantity, 10) || 0;
  const userCart = await getUserCart(session.userId);

  const existingItemIndex = userCart.findIndex((item) => item.id === parsedProductId);

  if (existingItemIndex > -1) {
    if (qty > 0) {
      userCart[existingItemIndex].quantity = qty;
    } else {
      userCart.splice(existingItemIndex, 1);
    }
  }

  const products = await loadProducts();
  const context = await createDecoratorContext(products);

  await setUserCart(session.userId, userCart);
  return getCartWithDecoratedProducts(userCart, context, products);
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
};
