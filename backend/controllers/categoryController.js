const categoryService = require('../services/categoryService');

const getCategories = async (req, res) => {
  const payload = await categoryService.getCategories();
  return res.json(payload);
};

module.exports = { getCategories };
