const { Order, Product, User } = require('../db/models');
const { HttpError } = require('../utils/httpError');
const { parseOrderItems, aggregateRequestedQuantities, reserveInventory } = require('../services/orderService');
const { loadProducts, createDecoratorContext } = require('../services/productService');
const { enrichOrderItem } = require('../services/enrichmentService');
const { invalidateOrderStatsCache } = require('../services/orderStatsService');
const {
  createRazorpayOrder,
  verifyRazorpaySignature,
  acquireStockLock,
  releaseStockLock,
  getLockTtlMs,
  createRefund,
} = require('../services/razorpay.service');

const buildOrderId = () => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const normalizeItems = (items = []) => {
  const parsedItems = parseOrderItems(Array.isArray(items) ? items : []);
  if (parsedItems.length === 0) {
    throw new HttpError(400, 'Order must contain at least one item');
  }
  if (parsedItems.some((item) => !Number.isInteger(item.id) || !Number.isInteger(item.quantity))) {
    throw new HttpError(400, 'Each order item must include a valid product id and quantity > 0');
  }
  return parsedItems;
};

const buildPriceAndStock = async (parsedItems) => {
  const requestedQuantityByProductId = aggregateRequestedQuantities(parsedItems);
  const productIds = Object.keys(requestedQuantityByProductId).map((id) => Number.parseInt(id, 10));

  const dbProducts = await Product.find({ id: { $in: productIds } }).lean();
  const productMap = new Map(dbProducts.map((product) => [product.id, product]));
  const stockIssues = [];
  let total = 0;

  const purchaseItems = parsedItems.map((item) => {
    const product = productMap.get(item.id);
    if (!product) {
      stockIssues.push({
        productId: item.id,
        requested: item.quantity,
        available: 0,
        reason: 'Product not found',
      });
      return null;
    }

    if (product.stock < item.quantity) {
      stockIssues.push({
        productId: item.id,
        requested: item.quantity,
        available: product.stock,
        reason: 'Insufficient stock',
      });
      return null;
    }

    const priceAtPurchase = Number(product.price || 0);
    total += priceAtPurchase * item.quantity;

    return {
      productId: item.id,
      quantity: item.quantity,
      priceAtPurchase,
    };
  });

  if (stockIssues.length > 0) {
    throw new HttpError(409, 'Unable to place order due to stock constraints', { stockIssues });
  }

  return {
    productIds,
    requestedQuantityByProductId,
    purchaseItems: purchaseItems.filter(Boolean),
    total,
  };
};

const createPaymentOrder = async (req, res) => {
  const { items, shippingAddress } = req.body;
  const session = req.session;

  const user = await User.findById(session.userId).lean();
  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  const parsedItems = normalizeItems(items);
  const { productIds, purchaseItems, total } = await buildPriceAndStock(parsedItems);

  const orderId = buildOrderId();
  await acquireStockLock(orderId, productIds);

  try {
    const amountInPaise = Math.round(total * 100);
    const razorpayOrder = await createRazorpayOrder({
      amount: amountInPaise,
      currency: 'INR',
      receipt: orderId,
      notes: {
        orderId,
        userId: String(user._id),
      },
    });

    const products = await loadProducts();
    const context = await createDecoratorContext(products);
    const normalizedItems = parsedItems.map((item) => {
      const purchase = purchaseItems.find((entry) => entry.productId === item.id);
      return enrichOrderItem({
        ...item,
        price: purchase?.priceAtPurchase || 0,
      }, context, products);
    });

    const order = await Order.create({
      id: orderId,
      userId: user._id,
      userName: user?.name || 'Unknown',
      userEmail: user?.email || 'Unknown',
      items: normalizedItems,
      products: purchaseItems,
      total: total,
      totalAmount: total,
      currency: 'INR',
      shippingAddress: shippingAddress || {},
      paymentMethod: 'razorpay',
      paymentStatus: 'pending',
      razorpayOrderId: razorpayOrder.id,
      status: 'pending',
      expiresAt: new Date(Date.now() + getLockTtlMs()),
    });

    return res.status(201).json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    await releaseStockLock(orderId);
    throw error;
  }
};

const verifyPayment = async (req, res) => {
  const {
    razorpay_payment_id: paymentId,
    razorpay_order_id: razorpayOrderId,
    razorpay_signature: signature,
    status,
  } = req.body;

  if (!razorpayOrderId) {
    throw new HttpError(400, 'razorpay_order_id is required');
  }

  const order = await Order.findOne({ razorpayOrderId });
  if (!order) {
    throw new HttpError(404, 'Order not found');
  }

  if (String(order.userId) !== String(req.session.userId)) {
    throw new HttpError(403, 'Not authorized to update this order');
  }

  if (order.paymentStatus === 'paid') {
    return res.json({
      success: true,
      message: 'Payment already verified',
      order,
    });
  }

  if (order.paymentStatus === 'failed') {
    return res.status(409).json({
      success: false,
      message: 'Payment already marked as failed',
    });
  }

  if (order.expiresAt && new Date(order.expiresAt) < new Date()) {
    order.paymentStatus = 'failed';
    order.status = 'cancelled';
    await order.save();
    await releaseStockLock(order.id);
    return res.status(410).json({ message: 'Payment session expired' });
  }

  if (status === 'failed') {
    order.paymentStatus = 'failed';
    order.status = 'cancelled';
    await order.save();
    await releaseStockLock(order.id);
    return res.status(400).json({ message: 'Payment failed' });
  }

  if (!paymentId || !signature) {
    throw new HttpError(400, 'payment_id and signature are required');
  }

  const isValid = verifyRazorpaySignature({
    orderId: razorpayOrderId,
    paymentId,
    signature,
  });

  if (!isValid) {
    order.paymentStatus = 'failed';
    order.status = 'cancelled';
    await order.save();
    await releaseStockLock(order.id);
    return res.status(400).json({ message: 'Invalid payment signature' });
  }

  const requestedQuantityByProductId = aggregateRequestedQuantities(
    order.products.map((item) => ({
      id: item.productId,
      quantity: item.quantity,
    }))
  );

  const { stockIssues } = await reserveInventory(requestedQuantityByProductId);
  if (stockIssues.length > 0) {
    order.paymentStatus = 'failed';
    order.status = 'cancelled';
    await order.save();
    await releaseStockLock(order.id);
    return res.status(409).json({
      message: 'Stock became unavailable during payment verification',
      stockIssues,
    });
  }

  order.paymentStatus = 'paid';
  order.razorpayPaymentId = paymentId;
  order.status = 'processing';
  order.paidAt = new Date();
  await order.save();
  invalidateOrderStatsCache();
  await releaseStockLock(order.id);

  return res.json({
    success: true,
    message: 'Payment verified successfully',
    order,
  });
};

const listTransactions = async (req, res) => {
  const transactions = await Order.find({
    $or: [
      { razorpayOrderId: { $ne: '' } },
      { paymentMethod: 'razorpay' },
    ],
  })
    .sort({ createdAt: -1 })
    .lean();

  return res.json(transactions);
};

const refundPayment = async (req, res) => {
  const { orderId, amount } = req.body;

  if (!orderId) {
    throw new HttpError(400, 'orderId is required');
  }

  const order = await Order.findOne({ id: orderId });
  if (!order) {
    throw new HttpError(404, 'Order not found');
  }

  if (!order.razorpayPaymentId) {
    throw new HttpError(400, 'Order does not have a Razorpay payment id');
  }

  if (order.paymentStatus !== 'paid') {
    throw new HttpError(409, 'Only paid orders can be refunded');
  }

  const refundAmount = amount ? Number(amount) : order.totalAmount || order.total;
  if (!Number.isFinite(refundAmount) || refundAmount <= 0) {
    throw new HttpError(400, 'Refund amount must be a valid number');
  }

  const refund = await createRefund({
    paymentId: order.razorpayPaymentId,
    amount: Math.round(refundAmount * 100),
  });

  order.paymentStatus = 'refunded';
  order.refundStatus = 'processed';
  order.razorpayRefundId = refund.id || '';
  order.refundedAmount = refundAmount;
  order.refundedAt = new Date();
  await order.save();

  return res.json({
    success: true,
    message: 'Refund processed',
    refund,
  });
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  listTransactions,
  refundPayment,
};
