const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Variant = require('../models/Variant');
const ErrorResponse = require('../utils/errorResponse');
const { getPagination, getPaginationResult } = require('../utils/pagination');

const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;
    
    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product')
      .populate('items.variant');
    
    if (!cart || cart.items.length === 0) {
      return next(new ErrorResponse('Cart is empty', 400));
    }
    
    // Validate stock and prepare order items
    const orderItems = [];
    let totalAmount = 0;
    
    for (const item of cart.items) {
      const variant = await Variant.findById(item.variant._id);
      
      if (!variant || variant.stock < item.quantity) {
        return next(new ErrorResponse(`Insufficient stock for ${item.product.name}`, 400));
      }
      
      const finalPrice = item.product.basePrice + variant.priceDifference;
      
      orderItems.push({
        product: item.product._id,
        variant: item.variant._id,
        quantity: item.quantity,
        price: finalPrice,
        productName: item.product.name,
        variantName: item.variant.name
      });
      
      totalAmount += finalPrice * item.quantity;
    }
    
    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress
    });
    
    // Update stock quantities
    for (const item of cart.items) {
      await Variant.findByIdAndUpdate(
        item.variant._id,
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