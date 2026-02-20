const productService = require('../services/productService');

const getProducts = async (req, res) => {
  const payload = await productService.getProducts(req.query);
  return res.json(payload);
};

const getProductById = async (req, res) => {
  const payload = await productService.getProductById(req.params.id);
  return res.json(payload);
};

module.exports = {
  getProducts,
  getProductById,
};
