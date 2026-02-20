const contentService = require('../services/contentService');

const getContent = async (req, res) => {
  const payload = await contentService.getContent();
  return res.json(payload);
};

const getContentBySlug = async (req, res) => {
  const payload = await contentService.getContentBySlug(req.params.slug);
  return res.json(payload);
};

module.exports = {
  getContent,
  getContentBySlug,
};
