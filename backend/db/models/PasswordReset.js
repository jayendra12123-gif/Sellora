const mongoose = require('mongoose');

const { Schema } = mongoose;

const PasswordResetSchema = new Schema({
  token: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  email: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

module.exports = mongoose.model('PasswordReset', PasswordResetSchema);
