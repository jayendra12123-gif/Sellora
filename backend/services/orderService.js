const { Order, Product, User } = require('../db/models');
const { invalidateProductCache } = require('./cacheService');
const { loadProducts, createDecoratorContext } = require('./productService');
const { enrichOrder, enrichOrderItem } = require('./enrichmentService');
const { setUserCart } = require('./userService');
const { HttpError } = require('../utils/httpError');
const { invalidateOrderStatsCache } = require('./orderStatsService');

const parseOrderItems = (items = []) => items.map((item) => {
  const id = Number.parseInt(item.id, 10);
  const quantity = Number.parseInt(item.quantity, 10);

  return {
    ...item,
    id,
    quantity: Number.isInteger(quantity) && quantity > 0 ? quantity : NaN,
  };
});

const aggregateRequestedQuantities = (parsedItems = []) => parsedItems.reduce((acc, item) => {
  if (!Number.isInteger(item.id) || !Number.isInteger(item.quantity)) return acc;
  acc[item.id] = (acc[item.id] || 0) + item.quantity;
  return acc;
}, {});

const reserveInventory = async (requestedQuantityByProductId) => {
  const productIds = Object.keys(requestedQuantityByProductId).map((id) => Number.parseInt(id, 10));
  if (productIds.length === 0) {
    return { stockIssues: [], productMap: new Map() };
  }

  const dbProducts = await Product.find({ id: { $in: productIds } }).lean();
  const productMap = new Map(dbProducts.map((product) => [product.id, product]));
  const stockIssues = [];

  Object.entries(requestedQuantityByProductId).forEach(([productIdStr, requestedQty]) => {
    const productId = Number.parseInt(productIdStr, 10);
    const product = productMap.get(productId);

    if (!product) {
      stockIssues.push({
        productId,
        requested: requestedQty,
        available: 0,
        reason: 'Product not found',
      });
      return;
    }

    if (product.stock < requestedQty) {
      stockIssues.push({
        productId,
        requested: requestedQty,
        available: product.stock,
        reason: 'Insufficient stock',
      });
    }
  });

  if (stockIssues.length > 0) {
    return { stockIssues, productMap };
  }

  const bulkOps = productIds.map((productId) => ({
    updateOne: {
      filter: { id: productId },
      update: { $inc: { stock: -requestedQuantityByProductId[productId] } },
    },
  }));

  await Product.bulkWrite(bulkOps, { ordered: true });
  invalidateProductCache();

  return { stockIssues, productMap };
};

const restoreInventory = async (items = []) => {
  const requestedQuantityByProductId = aggregateRequestedQuantities(items);
  const productIds = Object.keys(requestedQuantityByProductId).map((id) => Number.parseInt(id, 10));
  if (productIds.length === 0) {
    return;
  }

  const bulkOps = productIds.map((productId) => ({
    updateOne: {
      filter: { id: productId },
      update: { $inc: { stock: requestedQuantityByProductId[productId] } },
    },
  }));

  await Product.bulkWrite(bulkOps, { ordered: true });
  invalidateProductCache();
};

const getOrders = async (session) => {
  const userId = session.userId;
  const products = await loadProducts();
  const context = await createDecoratorContext(products);

  const userOrders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
  return userOrders.map((order) => enrichOrder(order, context, products));
};

const createOrder = async (session, payload) => {
  const { items, total, shippingAddress, paymentMethod } = payload;

  if (!items || items.length === 0) {
    throw new HttpError(400, 'Order must contain at least one item');
  }

  if (!total) {
    throw new HttpError(400, 'Total amount is required');
  }

  const parsedTotal = Number(total);
  if (!Number.isFinite(parsedTotal)) {
    throw new HttpError(400, 'Total amount must be a valid number');
  }

  const user = await User.findById(session.userId).lean();
  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  const parsedItems = parseOrderItems(Array.isArray(items) ? items : []);
  const requestedQuantityByProductId = aggregateRequestedQuantities(parsedItems);

  if (parsedItems.some((item) => !Number.isInteger(item.id) || !Number.isInteger(item.quantity))) {
    throw new HttpError(400, 'Each order item must include a valid product id and quantity > 0');
  }

  const { stockIssues } = await reserveInventory(requestedQuantityByProductId);

  if (stockIssues.length > 0) {
    throw new HttpError(409, 'Unable to place order due to stock constraints', { stockIssues });
  }

  const products = await loadProducts();
  const context = await createDecoratorContext(products);
  const normalizedItems = parsedItems.map((item) => enrichOrderItem(item, context, products));

  const order = await Order.create({
    id: `ORD-${Date.now()}`,
    userId: user._id,
    userName: user?.name || 'Unknown',
    userEmail: user?.email || 'Unknown',
    items: normalizedItems,
    total: parsedTotal,
    shippingAddress: shippingAddress || {},
    paymentMethod: paymentMethod || 'card',
    status: 'processing',
  });

  await setUserCart(user._id, []);
  invalidateOrderStatsCache();

  return {
    success: true,
    message: 'Order placed successfully',
    order: enrichOrder(order.toObject ? order.toObject() : order, context, products),
  };
};

const cancelOrder = async (session, orderId) => {
  const userId = session.userId;

  const order = await Order.findOne({ id: orderId, userId }).lean();
  if (!order) {
    throw new HttpError(404, 'Order not found');
  }

  if (order.status === 'delivered' || order.status === 'cancelled') {
    throw new HttpError(400, `Order cannot be cancelled as it is already ${order.status}`);
  }

  const updatedOrder = await Order.findOneAndUpdate(
    { id: orderId, userId },
    { $set: { status: 'cancelled', updatedAt: new Date() } },
    { new: true }
  ).lean();

  await restoreInventory(order.items);
  invalidateOrderStatsCache();

  const products = await loadProducts();
  const context = await createDecoratorContext(products);

  return {
    success: true,
    message: 'Order cancelled successfully',
    order: enrichOrder(updatedOrder, context, products),
  };
};

const getOrderById = async (session, orderId) => {
  const userId = session.userId;

  const order = await Order.findOne({ id: orderId, userId }).lean();
  if (!order) {
    throw new HttpError(404, 'Order not found');
  }

  const products = await loadProducts();
  const context = await createDecoratorContext(products);
  return enrichOrder(order, context, products);
};

module.exports = {
  parseOrderItems,
  aggregateRequestedQuantities,
  reserveInventory,
  getOrders,
  createOrder,
  cancelOrder,
  getOrderById,
};
