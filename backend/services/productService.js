const { Product } = require('../db/models');
const { getCachedProducts, setCachedProducts } = require('./cacheService');
const { loadOrderStats } = require('./orderStatsService');
const { loadCollections } = require('./collectionRepository');
const { HttpError } = require('../utils/httpError');

const toUniqueProductIds = (ids = []) => [...new Set(ids.filter((id) => Number.isInteger(id)))];

const getMostlyOrderedProductIds = (orderStats, products = []) => {
  const scoredProducts = products.map((product) => {
    const weightedUnits = orderStats.weightedUnitsByProduct[product.id] || 0;
    const rawUnits = orderStats.rawUnitsByProduct[product.id] || 0;
    const orderCount = orderStats.orderCountByProduct[product.id] || 0;

    const fallbackScore = (product.rating || 0) * 0.6;
    const score = weightedUnits > 0 ? weightedUnits : fallbackScore;

    return {
      id: product.id,
      score,
      weightedUnits,
      rawUnits,
      orderCount,
      rating: product.rating || 0,
    };
  });

  scoredProducts.sort((a, b) =>
    b.score - a.score ||
    b.rawUnits - a.rawUnits ||
    b.orderCount - a.orderCount ||
    b.rating - a.rating ||
    a.id - b.id
  );

  const topCount = Math.max(6, Math.ceil(products.length * 0.3));
  return scoredProducts.slice(0, topCount).map((item) => item.id);
};

const getResolvedCollections = (orderStats, products = [], baseCollections = {}) => {
  const mostlyOrderedProductIds = getMostlyOrderedProductIds(orderStats, products);
  const saleBoostIds = mostlyOrderedProductIds.slice(0, Math.max(3, Math.ceil(mostlyOrderedProductIds.length / 2)));

  return {
    ...baseCollections,
    ...(baseCollections['best-sellers']
      ? {
        'best-sellers': {
          ...baseCollections['best-sellers'],
          productIds: toUniqueProductIds([
            ...(baseCollections['best-sellers']?.productIds || []),
            ...mostlyOrderedProductIds,
          ]),
        },
      }
      : {}),
    ...(baseCollections['on-sale']
      ? {
        'on-sale': {
          ...baseCollections['on-sale'],
          productIds: toUniqueProductIds([
            ...(baseCollections['on-sale']?.productIds || []),
            ...saleBoostIds,
          ]),
        },
      }
      : {}),
  };
};

const buildProductCollectionLookup = (resolvedCollections) => {
  const collectionEntries = Object.values(resolvedCollections);
  return collectionEntries.reduce((acc, collection) => {
    collection.productIds.forEach((productId) => {
      if (!acc[productId]) {
        acc[productId] = [];
      }
      acc[productId].push(collection.slug);
    });
    return acc;
  }, {});
};

const calculateDiscountPercent = (product, { isOnSale, isBestSeller, weightedOrders }) => {
  if (!isOnSale) return 0;

  const baseDiscount = Number(product.saleDiscountPercent) || 0;
  const stockBoost = product.stock >= 50 ? 6 : product.stock >= 30 ? 4 : product.stock >= 15 ? 2 : 0;
  const demandAdjustment = isBestSeller ? -2 : weightedOrders > 2 ? 1 : 3;
  const ratingAdjustment = (product.rating || 0) >= 4.7 ? -1 : 1;

  return Math.max(8, Math.min(35, Math.round(baseDiscount + stockBoost + demandAdjustment + ratingAdjustment)));
};

const createDecoratorContext = async (products) => {
  const orderStats = await loadOrderStats();
  const baseCollections = await loadCollections();
  const resolvedCollections = getResolvedCollections(orderStats, products, baseCollections);
  const productCollectionLookup = buildProductCollectionLookup(resolvedCollections);
  const mostlyOrderedProductIds = getMostlyOrderedProductIds(orderStats, products);
  const bestSellerRankByProduct = mostlyOrderedProductIds.reduce((acc, productId, index) => {
    acc[productId] = index + 1;
    return acc;
  }, {});
  const mostlyOrderedSet = new Set(mostlyOrderedProductIds);

  return {
    orderStats,
    resolvedCollections,
    productCollectionLookup,
    bestSellerRankByProduct,
    mostlyOrderedSet,
  };
};

const decorateProduct = (product, context) => {
  const productCollections = context.productCollectionLookup[product.id] || [];
  const isOnSale = productCollections.includes('on-sale');
  const isBestSeller = context.mostlyOrderedSet.has(product.id);
  const weightedOrders = context.orderStats.weightedUnitsByProduct[product.id] || 0;
  const discountPercent = calculateDiscountPercent(product, { isOnSale, isBestSeller, weightedOrders });
  const originalPrice = discountPercent > 0
    ? Number((product.price / (1 - discountPercent / 100)).toFixed(2))
    : null;

  return {
    ...product,
    collections: productCollections,
    discountPercent,
    originalPrice,
    isBestSeller,
    bestSellerRank: isBestSeller ? context.bestSellerRankByProduct[product.id] : null,
    orderCount: context.orderStats.orderCountByProduct[product.id] || 0,
    orderUnits: context.orderStats.rawUnitsByProduct[product.id] || 0,
    weightedOrderScore: Number(weightedOrders.toFixed(2)),
  };
};

const getCollectionProducts = (slug, context, products) => {
  const collection = context.resolvedCollections[slug];
  if (!collection) {
    return null;
  }

  return products
    .filter((product) => collection.productIds.includes(product.id))
    .map((product) => decorateProduct(product, context));
};

const getDecoratedProducts = (products, context) => products.map((product) => decorateProduct(product, context));

const findDecoratedProductById = (productId, context, products) => {
  const product = products.find((p) => p.id === productId);
  return product ? decorateProduct(product, context) : null;
};

const loadProducts = async () => {
  const cached = getCachedProducts();
  if (cached) {
    return cached;
  }

  const items = await Product.find({}).select('-_id -__v -createdAt -updatedAt').lean();
  setCachedProducts(items);
  return items;
};

const getProducts = async ({ search, category, collection }) => {
  const products = await loadProducts();
  const context = await createDecoratorContext(products);

  let filtered = getDecoratedProducts(products, context);

  if (search) {
    const searchLower = String(search).toLowerCase();
    filtered = filtered.filter((p) =>
      String(p.title).toLowerCase().includes(searchLower) ||
      String(p.description).toLowerCase().includes(searchLower) ||
      String(p.category).toLowerCase().includes(searchLower)
    );
  }

  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (collection) {
    filtered = filtered.filter((p) => p.collections.includes(collection));
  }

  return filtered;
};

const getProductById = async (id) => {
  const products = await loadProducts();
  const context = await createDecoratorContext(products);
  const product = findDecoratedProductById(parseInt(id, 10), context, products);
  if (!product) {
    throw new HttpError(404, 'Product not found');
  }
  return product;
};

module.exports = {
  loadProducts,
  createDecoratorContext,
  decorateProduct,
  getDecoratedProducts,
  findDecoratedProductById,
  getCollectionProducts,
  getMostlyOrderedProductIds,
  getResolvedCollections,
  getProducts,
  getProductById,
};
