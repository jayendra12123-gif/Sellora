const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const PORT = toNumber(process.env.PORT, 5000);
const SESSION_TTL_DAYS = toNumber(process.env.SESSION_TTL_DAYS, 30);
const PASSWORD_RESET_TTL_MINUTES = toNumber(process.env.PASSWORD_RESET_TTL_MINUTES, 30);
const PRODUCT_CACHE_MS = toNumber(process.env.PRODUCT_CACHE_MS, 30000);
const ORDER_STATS_CACHE_MS = toNumber(process.env.ORDER_STATS_CACHE_MS, 60000);
const COLLECTION_CACHE_MS = toNumber(process.env.COLLECTION_CACHE_MS, 60000);
const BCRYPT_SALT_ROUNDS = toNumber(process.env.BCRYPT_SALT_ROUNDS, 12);

module.exports = {
  PORT,
  SESSION_TTL_DAYS,
  PASSWORD_RESET_TTL_MINUTES,
  PRODUCT_CACHE_MS,
  ORDER_STATS_CACHE_MS,
  COLLECTION_CACHE_MS,
  BCRYPT_SALT_ROUNDS,
};
