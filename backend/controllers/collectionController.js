const collectionService = require('../services/collectionService');

const getCollections = async (req, res) => {
  const payload = await collectionService.getCollections();
  return res.json(payload);
};

module.exports = { getCollections };
