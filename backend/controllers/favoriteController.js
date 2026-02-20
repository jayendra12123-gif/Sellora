const favoriteService = require('../services/favoriteService');

const getFavorites = async (req, res) => {
  const payload = await favoriteService.getFavorites(req.session);
  return res.json(payload);
};

const addFavorite = async (req, res) => {
  const payload = await favoriteService.addFavorite(req.session, req.params.id);
  return res.json(payload);
};

const removeFavorite = async (req, res) => {
  const payload = await favoriteService.removeFavorite(req.session, req.params.id);
  return res.json(payload);
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
