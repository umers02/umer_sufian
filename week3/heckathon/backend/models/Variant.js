const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: String,
    required: true
  },
  weight: {
    type: String,
    required: true
  },
  priceDifference: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

variantSchema.virtual('finalPrice').get(function() {
  return this.product?.basePrice + this.priceDifference;
});

module.exports = mongoose.model('Variant', variantSchema);