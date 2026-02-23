const Razorpay = require('razorpay');
const { createClient } = require('redis');

let razorpayClient;
let redisClient;
let redisReady;
const pendingLocks = new Map();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getRazorpayClient = () => {
  if (razorpayClient) return razorpayClient;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials are not configured');
  }

  razorpayClient = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  return razorpayClient;
};

const ensureRedisClient = async () => {
  if (!redisClient) {
    const url = process.env.REDIS_URL;
    if (!url) {
      throw new Error('REDIS_URL is not configured');
    }

    redisClient = createClient({
      url,
      socket: {
        tls: process.env.REDIS_TLS === 'true',
      },
    });

    redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });

    redisReady = redisClient.connect();
  }

  await redisReady;

  return redisClient;
};

const getLockTtlMs = () => toNumber(process.env.STOCK_LOCK_TTL_MS, 10 * 60 * 1000);

const acquireStockLock = async (orderId, productIds = []) => {
  if (!orderId || productIds.length === 0) return null;

  const client = await ensureRedisClient();
  const lockToken = `${orderId}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  const ttl = getLockTtlMs();
  const acquiredKeys = [];

  try {
    for (const id of productIds) {
      const key = `lock:stock:${id}`;
      const result = await client.set(key, lockToken, { NX: true, PX: ttl });
      if (result !== 'OK') {
        throw new Error('Failed to acquire stock lock');
      }
      acquiredKeys.push(key);
    }
  } catch (error) {
    if (acquiredKeys.length) {
      await client.del(acquiredKeys).catch(() => {});
    }
    throw error;
  }

  pendingLocks.set(orderId, { keys: acquiredKeys, token: lockToken });
  return { keys: acquiredKeys, token: lockToken };
};

const releaseStockLock = async (orderId) => {
  if (!orderId) return false;
  const lock = pendingLocks.get(orderId);
  if (!lock) return false;
  try {
    const client = await ensureRedisClient();
    await client.del(lock.keys);
  } catch (error) {
    console.warn('Failed to release stock lock:', error?.message || error);
  } finally {
    pendingLocks.delete(orderId);
  }
  return true;
};

const createRazorpayOrder = async ({ amount, currency = 'INR', receipt, notes }) => {
  const client = getRazorpayClient();
  return client.orders.create({
    amount,
    currency,
    receipt,
    notes,
    payment_capture: 1,
  });
};

const verifyRazorpaySignature = ({ orderId, paymentId, signature }) => {
  if (!orderId || !paymentId || !signature) return false;
  const crypto = require('crypto');
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};

const createRefund = async ({ paymentId, amount }) => {
  const client = getRazorpayClient();
  return client.payments.refund(paymentId, amount ? { amount } : undefined);
};

module.exports = {
  getRazorpayClient,
  createRazorpayOrder,
  verifyRazorpaySignature,
  acquireStockLock,
  releaseStockLock,
  getLockTtlMs,
  createRefund,
};
