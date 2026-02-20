const { SiteContent } = require('../db/models');
const { HttpError } = require('../utils/httpError');

const getSiteContent = async () => {
  const entries = await SiteContent.find({}).lean();
  return entries.reduce((acc, entry) => {
    acc[entry.key] = {
      slug: entry.slug,
      title: entry.title,
      lastUpdated: entry.lastUpdated,
      intro: entry.intro,
      sections: Array.isArray(entry.sections) ? entry.sections : [],
    };
    return acc;
  }, {});
};

const getContent = async () => getSiteContent();

const getContentBySlug = async (slug) => {
  const normalizedSlug = String(slug || '').toLowerCase().trim();
  const normalizedSlugMap = {
    terms: 'terms',
    'terms-and-conditions': 'terms',
    privacy: 'privacy',
    'privacy-policy': 'privacy',
  };
  const key = normalizedSlugMap[normalizedSlug] || normalizedSlug;
  const content = await getSiteContent();
  const section = content[key];

  if (!section) {
    throw new HttpError(404, 'Content not found');
  }

  return section;
};

module.exports = {
  getSiteContent,
  getContent,
  getContentBySlug,
};
