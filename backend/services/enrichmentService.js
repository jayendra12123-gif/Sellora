const { findDecoratedProductById } = require('./productService');

const enrichOrderItem = (item, context, products) => {
  const parsedProductId = Number.parseInt(item.id, 10);
  const decorated = Number.isInteger(parsedProductId)
    ? findDecoratedProductById(parsedProductId, context, products)
    : null;

  return {
    ...item,
    id: Number.isInteger(parsedProductId) ? parsedProductId : item.id,
    title: item.title || item.name || decorated?.title || 'Product',
    category: item.category || decorated?.category,
    image: item.image || decorated?.image,
    discountPercent: item.discountPercent ?? decorated?.discountPercent ?? 0,
    isBestSeller: item.isBestSeller ?? !!decorated?.isBestSeller,
  };
};

const enrichOrder = (order, context, products) => {
  const { _id, __v, ...safeOrder } = order || {};
  return {
    ...safeOrder,
    items: Array.isArray(order?.items) ? order.items.map((item) => enrichOrderItem(item, context, products)) : [],
  };
};

const getCartWithDecoratedProducts = (cartItems = [], context, products) => cartItems.map((item) => {
  const decorated = findDecoratedProductById(item.id, context, products);
  return decorated ? { ...decorated, quantity: item.quantity } : item;
});

module.exports = {
  enrichOrderItem,
  enrichOrder,
  getCartWithDecoratedProducts,
};
