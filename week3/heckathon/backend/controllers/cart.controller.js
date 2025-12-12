const Cart = require('../models/Cart');
const Variant = require('../models/Variant');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate({
        path: 'items.product',
        select: 'name images basePrice'
      })
      .populate({
        path: 'items.variant',
        select: 'name size weight priceDifference stock'
      });
    
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }
    
    res.json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;
    
    // Validate variant and stock
    const variant = await Variant.findById(variantId).populate('product');
    if (!variant || !variant.isActive) {
      return next(new ErrorResponse('Variant not found or inactive', 404));
    }
    
    if (variant.stock < quantity) {
      return next(new ErrorResponse('Insufficient stock', 400));
    }
    
    const price = variant.product.basePrice + variant.priceDifference;
    
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.variant.toString() === variantId
    );
    
    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (variant.stock < newQuantity) {
        return next(new ErrorResponse('Insufficient stock for total quantity', 400));
      }
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      cart.items.push({
        product: productId,
        variant: variantId,
        quantity,
        price
      });
    }
    
    cart.calculateTotal();
    await cart.save();
    
    await cart.populate([
      { path: 'items.product', select: 'name images basePrice' },
      { path: 'items.variant', select: 'name size weight priceDifference stock' }
    ]);
    
    res.json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }
    
    const item = cart.items.id(itemId);
    if (!item) {
      return next(new ErrorResponse('Item not found in cart', 404));
    }
    
    // Validate stock
    const variant = await Variant.findById(item.variant);
    if (variant.stock < quantity) {
      return next(new ErrorResponse('Insufficient stock', 400));
    }
    
    item.quantity = quantity;
    cart.calculateTotal();
    await cart.save();
    
    await cart.populate([
      { path: 'items.product', select: 'name images basePrice' },
      { path: 'items.variant', select: 'name size weight priceDifference stock' }
    ]);
    
    res.json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }
    
    cart.items.pull(itemId);
    cart.calculateTotal();
    await cart.save();
    
    await cart.populate([
      { path: 'items.product', select: 'name images basePrice' },
      { path: 'items.variant', select: 'name size weight priceDifference stock' }
    ]);
    
    res.json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }
    
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    
    res.json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};