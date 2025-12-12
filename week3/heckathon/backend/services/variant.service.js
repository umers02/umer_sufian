const Variant = require('../models/Variant');
const Product = require('../models/Product');

class VariantService {
  static async getVariantWithPrice(variantId) {
    const variant = await Variant.findById(variantId).populate('product');
    if (!variant) return null;
    
    return {
      ...variant.toObject(),
      finalPrice: variant.product.basePrice + variant.priceDifference
    };
  }
  
  static async checkVariantStock(variantId, quantity = 1) {
    const variant = await Variant.findById(variantId);
    if (!variant) return { available: false, reason: 'Variant not found' };
    
    if (!variant.isActive) return { available: false, reason: 'Variant inactive' };
    
    if (variant.stock < quantity) {
      return { 
        available: false, 
        reason: 'Insufficient stock',
        availableStock: variant.stock 
      };
    }
    
    return { available: true, stock: variant.stock };
  }
  
  static async getLowStockVariants(threshold = 10) {
    return await Variant.find({ 
      stock: { $lte: threshold }, 
      isActive: true 
    }).populate('product', 'name');
  }
}

module.exports = VariantService;