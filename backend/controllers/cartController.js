const cartService = require('../services/cartService');

const getCart = async (req, res) => {
  const payload = await cartService.getCart(req.session);
  return res.json(payload);
};

const addToCart = async (req, res) => {
  const payload = await cartService.addToCart(req.session, req.body);
  return res.json(payload);
};

const removeFromCart = async (req, res) => {
  const payload = await cartService.removeFromCart(req.session, req.params.id);
  return res.json(payload);
};

const updateCartItem = async (req, res) => {
  const payload = await cartService.updateCartItem(req.session, req.params.id, req.body);
  return res.json(payload);
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
};
