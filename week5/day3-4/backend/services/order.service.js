const Order = require('../models/Order');
const Variant = require('../models/Variant');

class OrderService {
  static async validateOrderItems(items) {
    const validationResults = [];
    
    for (const item of items) {
      const variant = await Variant.findById(item.variant).populate('product');
      
      if (!variant || !variant.isActive) {
        validationResults.push({
          valid: false,
          productName: item.productName || 'Unknown',
          reason: 'Product variant not available'
        });
        continue;
      }
      
      if (variant.stock < item.quantity) {
        validationResults.push({
          valid: false,
          productName: variant.product.name,
          reason: `Only ${variant.stock} items available`,
          availableStock: variant.stock
        });
        continue;
      }
      
      validationResults.push({
        valid: true,
        variant,
        finalPrice: variant.product.basePrice + variant.priceDifference
      });
    }
    
    return validationResults;
  }
  
  static async updateInventory(items) {
    const updates = [];
    
    for (const item of items) {
      updates.push(
        Variant.findByIdAndUpdate(
          item.variant,
          { $inc: { stock: -item.quantity } },
          { new: true }
        )
      );
    }
    
    return Promise.all(updates);
  }
  
  static async restoreInventory(items) {
    const updates = [];
    
    for (const item of items) {
      updates.push(
        Variant.findByIdAndUpdate(
          item.variant,
          { $inc: { stock: item.quantity } },
          { new: true }
        )
      );
    }
    
    return Promise.all(updates);
  }
}

module.exports = OrderService;