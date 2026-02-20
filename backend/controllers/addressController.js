const addressService = require('../services/addressService');

const getAddresses = async (req, res) => {
  const payload = await addressService.getAddresses(req.session);
  return res.json(payload);
};

const createAddress = async (req, res) => {
  const payload = await addressService.createAddress(req.session, req.body);
  return res.status(201).json(payload);
};

const updateAddress = async (req, res) => {
  const payload = await addressService.updateAddress(req.session, req.params.id, req.body);
  return res.json(payload);
};

const deleteAddress = async (req, res) => {
  const payload = await addressService.deleteAddress(req.session, req.params.id);
  return res.json(payload);
};

const setDefaultAddress = async (req, res) => {
  const payload = await addressService.setDefaultAddress(req.session, req.params.id);
  return res.json(payload);
};

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
