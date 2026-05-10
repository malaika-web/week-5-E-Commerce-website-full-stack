const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, default: 'NovaCart' },
    rating: { type: Number, default: 4.7, min: 0, max: 5 },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: true },
    isTrending: { type: Boolean, default: false },
    discountPercent: { type: Number, default: 0, min: 0, max: 95 },
    stock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
