const Product = require('./models/Product');
const SiteContent = require('./models/SiteContent');
const Collection = require('./models/Collection');

const ensureProductsSeeded = async () => {
  const existingCount = await Product.countDocuments();
  return { seeded: false, count: existingCount };
};

const ensureSiteContentSeeded = async () => {
  const existingCount = await SiteContent.countDocuments();
  return { seeded: false, count: existingCount };
};

const ensureCollectionsSeeded = async () => {
  const existingCount = await Collection.countDocuments();
  return { seeded: false, count: existingCount };
};

module.exports = {
  ensureProductsSeeded,
  ensureSiteContentSeeded,
  ensureCollectionsSeeded,
};
