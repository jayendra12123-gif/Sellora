const mongoose = require('mongoose');

const { Schema } = mongoose;

const OrderItemSchema = new Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, default: '' },
    category: { type: String, default: '' },
    image: { type: String, default: '' },
    price: { type: Number, default: 0 },
    quantity: { type: Number, required: true, min: 1 },
    discountPercent: { type: Number, default: 0 },
    isBestSeller: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProductPurchaseSchema = new Schema(
  {
    productId: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtPurchase: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, default: '' },
    userEmail: { type: String, default: '' },
    items: { type: [OrderItemSchema], default: [] },
    products: { type: [ProductPurchaseSchema], default: [] },
    total: { type: Number, required: true },
    totalAmount: { type: Number },
    currency: { type: String, default: 'INR' },
    shippingAddress: { type: Object, default: {} },
    paymentMethod: { type: String, default: 'card' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'paid',
      index: true,
    },
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' },
    razorpayRefundId: { type: String, default: '' },
    refundStatus: {
      type: String,
      enum: ['none', 'requested', 'processed', 'failed'],
      default: 'none',
    },
    refundedAmount: { type: Number, default: 0 },
    paidAt: { type: Date },
    refundedAt: { type: Date },
    expiresAt: { type: Date },
    status: {
      type: String,
      enum: ['processing', 'pending', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
