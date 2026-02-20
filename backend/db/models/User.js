const mongoose = require('mongoose');

const { Schema } = mongoose;

const AddressSchema = new Schema(
  {
    id: { type: String, required: true },
    category: { type: String, default: 'home' },
    name: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: '' },
    zip: { type: String, required: true },
    country: { type: String, default: '' },
    isDefault: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const CartItemSchema = new Schema(
  {
    id: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const PreferencesSchema = new Schema(
  {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    theme: { type: String, default: 'light' },
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    _id: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    status: { type: String, enum: ['active', 'disabled'], default: 'active' },
    cart: { type: [CartItemSchema], default: [] },
    favorites: { type: [Number], default: [] },
    preferences: { type: PreferencesSchema, default: () => ({}) },
    addresses: { type: [AddressSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
