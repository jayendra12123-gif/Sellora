const { Collection } = require('../db/models');
const { getCachedCollections, setCachedCollections } = require('./cacheService');

const loadCollections = async () => {
  const cached = getCachedCollections();
  if (cached) {
    return cached;
  }

  const entries = await Collection.find({}).lean();
  const normalized = entries.reduce((acc, entry) => {
    acc[entry.slug] = {
      slug: entry.slug,
      name: entry.name,
      icon: entry.icon || '',
      description: entry.description || '',
      productIds: Array.isArray(entry.productIds) ? entry.productIds : [],
    };
    return acc;
  }, {});

  setCachedCollections(normalized);
  return normalized;
};

module.exports = {
  loadCollections,
};
