const {
  PRODUCT_CACHE_MS,
  ORDER_STATS_CACHE_MS,
  COLLECTION_CACHE_MS,
} = require('../config/constants');

let productCache = { items: null, loadedAt: 0 };
let orderStatsCache = { data: null, loadedAt: 0 };
let collectionCache = { items: null, loadedAt: 0 };

const getCachedProducts = () => {
  const now = Date.now();
  if (productCache.items && now - productCache.loadedAt < PRODUCT_CACHE_MS) {
    return productCache.items;
  }
  return null;
};

const setCachedProducts = (items) => {
  productCache = { items, loadedAt: Date.now() };
};

const invalidateProductCache = () => {
  productCache = { items: null, loadedAt: 0 };
};

const getCachedOrderStats = () => {
  const now = Date.now();
  if (orderStatsCache.data && now - orderStatsCache.loadedAt < ORDER_STATS_CACHE_MS) {
    return orderStatsCache.data;
  }
  return null;
};

const setCachedOrderStats = (data) => {
  orderStatsCache = { data, loadedAt: Date.now() };
};

const invalidateOrderStatsCache = () => {
  orderStatsCache = { data: null, loadedAt: 0 };
};

const getCachedCollections = () => {
  const now = Date.now();
  if (collectionCache.items && now - collectionCache.loadedAt < COLLECTION_CACHE_MS) {
    return collectionCache.items;
  }
  return null;
};

const setCachedCollections = (items) => {
  collectionCache = { items, loadedAt: Date.now() };
};

const invalidateCollectionCache = () => {
  collectionCache = { items: null, loadedAt: 0 };
};

module.exports = {
  getCachedProducts,
  setCachedProducts,
  invalidateProductCache,
  getCachedOrderStats,
  setCachedOrderStats,
  invalidateOrderStatsCache,
  getCachedCollections,
  setCachedCollections,
  invalidateCollectionCache,
};
