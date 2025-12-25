const Cart = require('../models/Cart');
const Variant = require('../models/Variant');

class CartService {
  static async validateCartItems(cartItems) {
    const validationResults = [];
    
    for (const item of cartItems) {
      const variant = await Variant.findById(item.variant).populate('product');
      
      if (!variant || !variant.isActive) {
        validationResults.push({
          itemId: item._id,
          valid: false,
          reason: 'Variant not available'
        });
        continue;
      }
      
      if (variant.stock < item.quantity) {
        validationResults.push({
          itemId: item._id,
          valid: false,
          reason: 'Insufficient stock',
          availableStock: variant.stock
        });
        continue;
      }
      
      validationResults.push({
        itemId: item._id,
        valid: true,
        variant,
        finalPrice: variant.product.basePrice + variant.priceDifference
      });
    }
    
    return validationResults;
  }
  
  static async calculateCartTotal(cartItems) {
    let total = 0;
    
    for (const item of cartItems) {
      const variant = await Variant.findById(item.variant).populate('product');
      if (variant) {
        const price = variant.product.basePrice + variant.priceDifference;
        total += price * item.quantity;
      }
    }
    
    return total;
  }
}

module.exports = CartService;