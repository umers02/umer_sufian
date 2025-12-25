const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Variant = require('../models/Variant');
const ErrorResponse = require('../utils/errorResponse');
const { getPagination, getPaginationResult } = require('../utils/pagination');

const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;
    
    // Validate shipping address
    if (!shippingAddress) {
      return next(new ErrorResponse('Shipping address is required', 400));
    }
    
    const requiredFields = ['street', 'city', 'state', 'zipCode', 'country'];
    const missingFields = requiredFields.filter(field => !shippingAddress[field] || shippingAddress[field].trim() === '');
    
    if (missingFields.length > 0) {
      return next(new ErrorResponse(`Missing required shipping address fields: ${missingFields.join(', ')}`, 400));
    }
    
    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product')
      .populate('items.variant');
    
    if (!cart || !cart.items || cart.items.length === 0) {
      return next(new ErrorResponse('Cart is empty. Please add items to cart first.', 400));
    }
    
    // Validate stock and prepare order items
    const orderItems = [];
    let totalAmount = 0;
    
    for (const item of cart.items) {
      // Check if product and variant are populated
      if (!item.product || !item.variant) {
        return next(new ErrorResponse('Cart contains invalid items. Please refresh your cart.', 400));
      }
      
      // Get fresh variant data to check stock
      const variant = await Variant.findById(item.variant._id || item.variant);
      
      if (!variant) {
        return next(new ErrorResponse(`Variant not found for ${item.product.name || 'product'}`, 400));
      }
      
      if (variant.stock < item.quantity) {
        return next(new ErrorResponse(`Insufficient stock for ${item.product.name}. Available: ${variant.stock}, Requested: ${item.quantity}`, 400));
      }
      
      const finalPrice = (item.product.basePrice || 0) + (variant.priceDifference || 0);
      
      orderItems.push({
        product: item.product._id || item.product,
        variant: item.variant._id || item.variant,
        quantity: item.quantity,
        price: finalPrice,
        productName: item.product.name || 'Product',
        variantName: variant.name || variant.size || 'Standard'
      });
      
      totalAmount += finalPrice * item.quantity;
    }
    
    // Generate order number
    const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    // Create order
    const order = await Order.create({
      user: req.user.id,
      orderNumber,
      items: orderItems,
      totalAmount,
      shippingAddress
    });
    
    // Update stock quantities
    for (const item of cart.items) {
      const variantId = item.variant._id || item.variant;
      await Variant.findByIdAndUpdate(
        variantId,
        { $inc: { stock: -item.quantity } }
      );
    }
    
    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    
    await order.populate([
      { path: 'items.product', select: 'name images' },
      { path: 'items.variant', select: 'name size weight' }
    ]);
    
    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);
    
    let filter = { user: req.user.id };
    if (status) filter.status = status;
    
    const orders = await Order.find(filter)
      .populate('items.product', 'name images')
      .populate('items.variant', 'name size weight')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const totalCount = await Order.countDocuments(filter);
    const pagination = getPaginationResult(totalCount, pageNum, limitNum);
    
    res.json({
      success: true,
      orders,
      pagination
    });
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id
    })
      .populate('items.product', 'name images')
      .populate('items.variant', 'name size weight');
    
    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// Admin functions
const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, userId } = req.query;
    const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);
    
    let filter = {};
    if (status) filter.status = status;
    if (userId) filter.user = userId;
    
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .populate('items.variant', 'name size weight')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const totalCount = await Order.countDocuments(filter);
    const pagination = getPaginationResult(totalCount, pageNum, limitNum);
    
    res.json({
      success: true,
      orders,
      pagination
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .populate('items.variant', 'name size weight');
    
    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus
};