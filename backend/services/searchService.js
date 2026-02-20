const { loadProducts, createDecoratorContext, decorateProduct } = require('./productService');

const searchProducts = async (query) => {
  const q = String(query || '');
  if (!q || q.trim() === '') {
    return [];
  }

  const products = await loadProducts();
  const context = await createDecoratorContext(products);
  const searchLower = q.toLowerCase();

  return products
    .filter((p) =>
      String(p.title).toLowerCase().includes(searchLower) ||
      String(p.description).toLowerCase().includes(searchLower) ||
      String(p.category).toLowerCase().includes(searchLower)
    )
    .slice(0, 10)
    .map((product) => decorateProduct(product, context));
};

module.exports = { searchProducts };
