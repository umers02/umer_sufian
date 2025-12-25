const Variant = require('../models/Variant');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

const getVariantsByProduct = async (req, res, next) => {
  try {
    const variants = await Variant.find({ 
      product: req.params.productId, 
      isActive: true 
    }).populate('product');
    
    res.json({
      success: true,
      variants
    });
  } catch (error) {
    next(error);
  }
};

const getVariant = async (req, res, next) => {
  try {
    const variant = await Variant.findById(req.params.id).populate('product');
    
    if (!variant) {
      return next(new ErrorResponse('Variant not found', 404));
    }
    
    const finalPrice = variant.product.basePrice + variant.priceDifference;
    
    res.json({
      success: true,
      variant: {
        ...variant.toObject(),
        finalPrice
      }
    });
  } catch (error) {
    next(error);
  }
};

const createVariant = async (req, res, next) => {
  try {
    const { productId } = req.params;
    
    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }
    
    const variant = await Variant.create({
      ...req.body,
      product: productId
    });
    
    await variant.populate('product');
    
    res.status(201).json({
      success: true,
      variant
    });
  } catch (error) {
    next(error);
  }
};

const updateVariant = async (req, res, next) => {
  try {
    const variant = await Variant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('product');
    
    if (!variant) {
      return next(new ErrorResponse('Variant not found', 404));
    }
    
    res.json({
      success: true,
      variant
    });
  } catch (error) {
    next(error);
  }
};

const deleteVariant = async (req, res, next) => {
  try {
    const variant = await Variant.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!variant) {
      return next(new ErrorResponse('Variant not found', 404));
    }
    
    res.json({
      success: true,
      message: 'Variant deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const checkStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.query;
    
    const variant = await Variant.findById(id);
    if (!variant) {
      return next(new ErrorResponse('Variant not found', 404));
    }
    
    const isAvailable = variant.stock >= parseInt(quantity || 1);
    
    res.json({
      success: true,
      available: isAvailable,
      stock: variant.stock,
      requested: parseInt(quantity || 1)
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVariantsByProduct,
  getVariant,
  createVariant,
  updateVariant,
  deleteVariant,
  checkStock
};