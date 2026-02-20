const { getHealthStatus } = require('../services/healthService');

const getHealth = (req, res) => {
  const payload = getHealthStatus();
  res.json(payload);
};

module.exports = { getHealth };
