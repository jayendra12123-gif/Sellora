const { loadProducts, createDecoratorContext, getCollectionProducts } = require('./productService');

const getCollections = async () => {
  const products = await loadProducts();
  const context = await createDecoratorContext(products);
  const collectionEntries = Object.values(context.resolvedCollections);

  return collectionEntries.map((collection) => {
    const items = getCollectionProducts(collection.slug, context, products) || [];
    return {
      slug: collection.slug,
      name: collection.name,
      icon: collection.icon,
      description: collection.description,
      productCount: items.length,
      bestSellerCount: items.filter((item) => item.isBestSeller).length,
    };
  });
};

module.exports = {
  getCollections,
};
