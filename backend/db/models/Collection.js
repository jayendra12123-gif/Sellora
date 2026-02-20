const mongoose = require('mongoose');

const { Schema } = mongoose;

const CollectionSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    icon: { type: String, default: '' },
    description: { type: String, default: '' },
    productIds: { type: [Number], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Collection', CollectionSchema);
