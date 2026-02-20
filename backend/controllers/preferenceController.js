const preferenceService = require('../services/preferenceService');

const getPreferences = async (req, res) => {
  const payload = await preferenceService.getPreferences(req.session);
  return res.json(payload);
};

const updatePreferences = async (req, res) => {
  const payload = await preferenceService.updatePreferences(req.session, req.body);
  return res.json(payload);
};

module.exports = {
  getPreferences,
  updatePreferences,
};
