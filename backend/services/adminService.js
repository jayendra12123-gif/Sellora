const { Product, Order, User, Collection, SiteContent, Session, PasswordReset } = require('../db/models');
const { invalidateProductCache, invalidateCollectionCache, invalidateOrderStatsCache } = require('./cacheService');
const { aggregateRequestedQuantities, reserveInventory, restoreInventory } = require('./orderService');
const { normalizeEmail, isValidEmail } = require('../utils/validators');
const { HttpError } = require('../utils/httpError');

const getSummary = async () => {
  const [productCount, orderCount, userCount, collectionCount, revenueAgg, pendingCount, shippedCount] = await Promise.all([
    Product.countDocuments({}),
    Order.countDocuments({}),
    User.countDocuments({ role: { $ne: 'admin' } }),
    Collection.countDocuments({}),
    Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.countDocuments({ status: 'pending' }),
    Order.countDocuments({ status: 'shipped' }),
  ]);

  const revenue = revenueAgg?.[0]?.total || 0;

  return {
    products: productCount,
    orders: orderCount,
    users: userCount,
    collections: collectionCount,
    revenue,
    pendingOrders: pendingCount,
    shippedOrders: shippedCount,
  };
};

const listProducts = async () => Product.find({}).sort({ id: 1 }).lean();

const createProduct = async (payload) => {
  const { id, title, description, price, category, rating, stock, image, saleDiscountPercent } = payload || {};

  if (!title || !category || price === undefined || price === null) {
    throw new HttpError(400, 'Title, category, and price are required');
  }

  let nextId = Number.parseInt(id, 10);
  if (!Number.isInteger(nextId)) {
    const last = await Product.findOne({}).sort({ id: -1 }).select('id').lean();
    nextId = Number.isInteger(last?.id) ? last.id + 1 : 1;
  }

  const exists = await Product.findOne({ id: nextId }).lean();
  if (exists) {
    throw new HttpError(409, 'Product id already exists');
  }

  const product = await Product.create({
    id: nextId,
    title: String(title).trim(),
    description: String(description || '').trim(),
    price: Number(price),
    category: String(category).trim(),
    rating: Number.isFinite(Number(rating)) ? Number(rating) : 0,
    stock: Number.isFinite(Number(stock)) ? Number(stock) : 0,
    image: String(image || '').trim(),
    saleDiscountPercent: Number.isFinite(Number(saleDiscountPercent)) ? Number(saleDiscountPercent) : 0,
  });

  invalidateProductCache();
  return product;
};

const updateProduct = async (id, payload) => {
  const productId = Number.parseInt(id, 10);
  if (!Number.isInteger(productId)) {
    throw new HttpError(400, 'Invalid product id');
  }

  const updates = {};
  const fields = ['title', 'description', 'price', 'category', 'rating', 'stock', 'image', 'saleDiscountPercent'];
  fields.forEach((field) => {
    if (payload && Object.prototype.hasOwnProperty.call(payload, field)) {
      if (field === 'price' || field === 'rating' || field === 'stock' || field === 'saleDiscountPercent') {
        updates[field] = Number(payload[field]);
      } else {
        updates[field] = String(payload[field]).trim();
      }
    }
  });

  const product = await Product.findOneAndUpdate({ id: productId }, { $set: updates }, { new: true }).lean();
  if (!product) {
    throw new HttpError(404, 'Product not found');
  }

  invalidateProductCache();
  return product;
};

const deleteProduct = async (id) => {
  const productId = Number.parseInt(id, 10);
  if (!Number.isInteger(productId)) {
    throw new HttpError(400, 'Invalid product id');
  }

  const result = await Product.deleteOne({ id: productId });
  if (!result.deletedCount) {
    throw new HttpError(404, 'Product not found');
  }

  invalidateProductCache();
  return { success: true };
};

const listOrders = async () => Order.find({}).sort({ createdAt: -1 }).lean();

const updateOrderStatus = async (orderId, status) => {
  const allowed = ['processing', 'pending', 'shipped', 'delivered', 'cancelled'];
  if (!allowed.includes(status)) {
    throw new HttpError(400, 'Invalid order status');
  }

  const existingOrder = await Order.findOne({ id: orderId }).lean();
  if (!existingOrder) {
    throw new HttpError(404, 'Order not found');
  }

  if (existingOrder.status === status) {
    return existingOrder;
  }

  if (status === 'cancelled' && existingOrder.status !== 'cancelled') {
    await restoreInventory(existingOrder.items);
  }

  if (existingOrder.status === 'cancelled' && status !== 'cancelled') {
    const requestedQuantityByProductId = aggregateRequestedQuantities(existingOrder.items);
    const { stockIssues } = await reserveInventory(requestedQuantityByProductId);
    if (stockIssues.length > 0) {
      throw new HttpError(409, 'Unable to update order status due to stock constraints', { stockIssues });
    }
  }

  const order = await Order.findOneAndUpdate(
    { id: orderId },
    { $set: { status, updatedAt: new Date() } },
    { new: true }
  ).lean();

  if (!order) {
    throw new HttpError(404, 'Order not found');
  }

  invalidateOrderStatsCache();
  return order;
};

const listUsers = async () =>
  User.find({ role: { $ne: 'admin' } }).select('-passwordHash').sort({ createdAt: -1 }).lean();

const updateUser = async (userId, payload) => {
  const updates = {};

  if (payload?.name !== undefined) {
    updates.name = String(payload.name).trim();
  }

  if (payload?.email !== undefined) {
    const normalizedEmail = normalizeEmail(payload.email);
    if (!isValidEmail(normalizedEmail)) {
      throw new HttpError(400, 'Please provide a valid email address');
    }
    const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: userId } }).lean();
    if (existing) {
      throw new HttpError(409, 'Email already in use');
    }
    updates.email = normalizedEmail;
  }

  if (payload?.role !== undefined) {
    if (!['customer'].includes(payload.role)) {
      throw new HttpError(400, 'Invalid role');
    }
    updates.role = payload.role;
  }

  if (payload?.status !== undefined) {
    if (!['active', 'disabled'].includes(payload.status)) {
      throw new HttpError(400, 'Invalid status');
    }
    updates.status = payload.status;
  }

  const user = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true })
    .select('-passwordHash')
    .lean();

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  return user;
};

const deleteUser = async (userId) => {
  await Session.deleteMany({ userId }).catch(() => {});
  await PasswordReset.deleteMany({ userId }).catch(() => {});
  const result = await User.deleteOne({ _id: userId });
  if (!result.deletedCount) {
    throw new HttpError(404, 'User not found');
  }
  return { success: true };
};

const listCollections = async () => Collection.find({}).sort({ name: 1 }).lean();

const createCollection = async (payload) => {
  const { slug, name, icon, description, productIds } = payload || {};
  if (!slug || !name) {
    throw new HttpError(400, 'Slug and name are required');
  }

  const normalizedSlug = String(slug).trim().toLowerCase();
  const exists = await Collection.findOne({ slug: normalizedSlug }).lean();
  if (exists) {
    throw new HttpError(409, 'Collection slug already exists');
  }

  const entry = await Collection.create({
    slug: normalizedSlug,
    name: String(name).trim(),
    icon: String(icon || '').trim(),
    description: String(description || '').trim(),
    productIds: Array.isArray(productIds)
      ? productIds.map((id) => Number.parseInt(id, 10)).filter((id) => Number.isInteger(id))
      : [],
  });

  invalidateCollectionCache();
  return entry;
};

const updateCollection = async (slug, payload) => {
  const normalizedSlug = String(slug).trim().toLowerCase();
  const updates = {};

  if (payload?.name !== undefined) {
    updates.name = String(payload.name).trim();
  }

  if (payload?.icon !== undefined) {
    updates.icon = String(payload.icon || '').trim();
  }

  if (payload?.description !== undefined) {
    updates.description = String(payload.description || '').trim();
  }

  if (payload?.productIds !== undefined) {
    updates.productIds = Array.isArray(payload.productIds)
      ? payload.productIds.map((id) => Number.parseInt(id, 10)).filter((id) => Number.isInteger(id))
      : [];
  }

  const entry = await Collection.findOneAndUpdate({ slug: normalizedSlug }, { $set: updates }, { new: true }).lean();
  if (!entry) {
    throw new HttpError(404, 'Collection not found');
  }

  invalidateCollectionCache();
  return entry;
};

const deleteCollection = async (slug) => {
  const normalizedSlug = String(slug).trim().toLowerCase();
  const result = await Collection.deleteOne({ slug: normalizedSlug });
  if (!result.deletedCount) {
    throw new HttpError(404, 'Collection not found');
  }

  invalidateCollectionCache();
  return { success: true };
};

const listContent = async () => SiteContent.find({}).sort({ key: 1 }).lean();

const upsertContent = async (key, payload) => {
  if (!key) {
    throw new HttpError(400, 'Content key is required');
  }

  const normalizedKey = String(key).trim().toLowerCase();

  const updates = {
    key: normalizedKey,
    slug: String(payload?.slug || normalizedKey).trim().toLowerCase(),
    title: String(payload?.title || '').trim(),
    lastUpdated: String(payload?.lastUpdated || '').trim(),
    intro: String(payload?.intro || '').trim(),
    sections: Array.isArray(payload?.sections) ? payload.sections : [],
  };

  const entry = await SiteContent.findOneAndUpdate(
    { key: normalizedKey },
    { $set: updates },
    { new: true, upsert: true }
  ).lean();

  return entry;
};

module.exports = {
  getSummary,
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  listOrders,
  updateOrderStatus,
  listUsers,
  updateUser,
  deleteUser,
  listCollections,
  createCollection,
  updateCollection,
  deleteCollection,
  listContent,
  upsertContent,
};
