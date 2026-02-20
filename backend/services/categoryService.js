const { loadProducts } = require('./productService');

const getCategories = async () => {
  const products = await loadProducts();
  return [...new Set(products.map((p) => p.category))];
};

module.exports = { getCategories };
