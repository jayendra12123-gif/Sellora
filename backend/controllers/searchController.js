const searchService = require('../services/searchService');

const searchProducts = async (req, res) => {
  const payload = await searchService.searchProducts(req.query.q);
  return res.json(payload);
};

module.exports = { searchProducts };
