const orderService = require('../services/orderService');

const getOrders = async (req, res) => {
  const payload = await orderService.getOrders(req.session);
  return res.json(payload);
};

const createOrder = async (req, res) => {
  const payload = await orderService.createOrder(req.session, req.body);
  return res.status(201).json(payload);
};

const cancelOrder = async (req, res) => {
  const payload = await orderService.cancelOrder(req.session, req.params.id);
  return res.json(payload);
};

const getOrderById = async (req, res) => {
  const payload = await orderService.getOrderById(req.session, req.params.id);
  return res.json(payload);
};

module.exports = {
  getOrders,
  createOrder,
  cancelOrder,
  getOrderById,
};
