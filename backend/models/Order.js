const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    paymentProvider: {
      type: String,
      enum: ['stripe'],
      default: 'stripe',
    },
    stripeSessionId: { type: String, unique: true, sparse: true },
    paymentIntentId: { type: String, default: '' },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'cod'],
      default: 'stripe',
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'unpaid', 'refunded'],
      default: 'paid',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
    shippingAddress: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
