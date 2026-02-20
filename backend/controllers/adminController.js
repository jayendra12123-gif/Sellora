const adminService = require('../services/adminService');

const getSummary = async (req, res) => {
  const payload = await adminService.getSummary();
  return res.json(payload);
};

const listProducts = async (req, res) => {
  const payload = await adminService.listProducts();
  return res.json(payload);
};

const createProduct = async (req, res) => {
  const payload = await adminService.createProduct(req.body);
  return res.status(201).json(payload);
};

const updateProduct = async (req, res) => {
  const payload = await adminService.updateProduct(req.params.id, req.body);
  return res.json(payload);
};

const deleteProduct = async (req, res) => {
  const payload = await adminService.deleteProduct(req.params.id);
  return res.json(payload);
};

const listOrders = async (req, res) => {
  const payload = await adminService.listOrders();
  return res.json(payload);
};

const updateOrderStatus = async (req, res) => {
  const payload = await adminService.updateOrderStatus(req.params.id, req.body?.status);
  return res.json(payload);
};

const listUsers = async (req, res) => {
  const payload = await adminService.listUsers();
  return res.json(payload);
};

const updateUser = async (req, res) => {
  const payload = await adminService.updateUser(req.params.id, req.body);
  return res.json(payload);
};

const deleteUser = async (req, res) => {
  const payload = await adminService.deleteUser(req.params.id);
  return res.json(payload);
};

const listCollections = async (req, res) => {
  const payload = await adminService.listCollections();
  return res.json(payload);
};

const createCollection = async (req, res) => {
  const payload = await adminService.createCollection(req.body);
  return res.status(201).json(payload);
};

const updateCollection = async (req, res) => {
  const payload = await adminService.updateCollection(req.params.slug, req.body);
  return res.json(payload);
};

const deleteCollection = async (req, res) => {
  const payload = await adminService.deleteCollection(req.params.slug);
  return res.json(payload);
};

const listContent = async (req, res) => {
  const payload = await adminService.listContent();
  return res.json(payload);
};

const upsertContent = async (req, res) => {
  const payload = await adminService.upsertContent(req.params.key, req.body);
  return res.json(payload);
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
