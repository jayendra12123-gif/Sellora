const mongoose = require('mongoose');

const { Schema } = mongoose;

const SiteContentSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true },
    title: { type: String, default: '' },
    lastUpdated: { type: String, default: '' },
    intro: { type: String, default: '' },
    sections: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteContent', SiteContentSchema);
