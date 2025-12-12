const Product = require('../models/Product');
const Variant = require('../models/Variant');

class ProductService {
  static async getProductWithVariants(productId) {
    const product = await Product.findById(productId).populate('category');
    if (!product) return null;
    
    const variants = await Variant.find({ product: productId, isActive: true });
    return { ...product.toObject(), variants };
  }
  
  static async checkProductAvailability(productId) {
    const variants = await Variant.find({ product: productId, isActive: true });
    return variants.some(variant => variant.stock > 0);
  }
  
  static async getProductPrice(productId, variantId) {
    const product = await Product.findById(productId);
    const variant = await Variant.findById(variantId);
    
    if (!product || !variant) return null;
    
    return product.basePrice + variant.priceDifference;
  }
}

module.exports = ProductService;