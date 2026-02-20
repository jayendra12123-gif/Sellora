const { Order } = require('../db/models');
const {
  getCachedOrderStats,
  setCachedOrderStats,
  invalidateOrderStatsCache,
} = require('./cacheService');

const ORDER_STATUS_WEIGHT = {
  delivered: 1,
  shipped: 0.9,
  processing: 0.8,
  pending: 0.7,
  cancelled: 0.35,
};

const getOrderStats = (orders = []) => {
  const weightedUnitsByProduct = {};
  const rawUnitsByProduct = {};
  const orderCountByProduct = {};

  orders.forEach((order) => {
    const statusWeight = ORDER_STATUS_WEIGHT[order.status] ?? 0.6;
    if (!Array.isArray(order.items)) return;

    order.items.forEach((item) => {
      const productId = Number.parseInt(item.id, 10);
      if (!Number.isInteger(productId)) return;

      const quantity = Math.max(1, Number(item.quantity) || 1);

      rawUnitsByProduct[productId] = (rawUnitsByProduct[productId] || 0) + quantity;
      weightedUnitsByProduct[productId] = (weightedUnitsByProduct[productId] || 0) + (quantity * statusWeight);
      orderCountByProduct[productId] = (orderCountByProduct[productId] || 0) + 1;
    });
  });

  return {
    weightedUnitsByProduct,
    rawUnitsByProduct,
    orderCountByProduct,
  };
};

const loadOrderStats = async () => {
  const cached = getCachedOrderStats();
  if (cached) {
    return cached;
  }

  const orders = await Order.find({}, { items: 1, status: 1 }).lean();
  const stats = getOrderStats(orders);
  setCachedOrderStats(stats);
  return stats;
};

module.exports = {
  loadOrderStats,
  getOrderStats,
  invalidateOrderStatsCache,
};
