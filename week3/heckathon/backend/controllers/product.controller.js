const Product = require('../models/Product');
const Variant = require('../models/Variant');
const Category = require('../models/Category');
const ErrorResponse = require('../utils/errorResponse');
const { getPagination, getPaginationResult } = require('../utils/pagination');

const getProducts = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      minPrice, 
      maxPrice, 
      rating, 
      flavor, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);
    
    // Build filter object
    let filter = { isActive: true };
    
    if (category) filter.category = category;
    if (flavor) filter.flavor = new RegExp(flavor, 'i');
    if (rating) filter['rating.average'] = { $gte: parseFloat(rating) };
    if (search) {
      filter.$text = { $search: search };
    }
    
    // Price filtering requires aggregation with variants
    let pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'variants',
          localField: '_id',
          foreignField: 'product',
          as: 'variants'
        }
      },
      {
        $addFields: {
          minVariantPrice: {
            $min: {
              $map: {
                input: '$variants',
                as: 'variant',
                in: { $add: ['$basePrice', '$$variant.priceDifference'] }
              }
            }
          }
        }
      }
    ];
    
    if (minPrice || maxPrice) {
      let priceFilter = {};
      if (minPrice) priceFilter.$gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);
      pipeline.push({ $match: { minVariantPrice: priceFilter } });
    }
    
    // Add sorting
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;
    pipeline.push({ $sort: sortObj });
    
    // Add pagination
    pipeline.push({ $skip: skip }, { $limit: limitNum });
    
    // Populate category
    pipeline.push({
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category'
      }
    });
    
    pipeline.push({
      $unwind: '$category'
    });
    
    const products = await Product.aggregate(pipeline);
    
    // Get total count for pagination
    const totalCount = await Product.countDocuments(filter);
    const pagination = getPaginationResult(totalCount, pageNum, limitNum);
    
    res.json({
      success: true,
      products,
      pagination
    });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate({
        path: 'variants',
        match: { isActive: true }
      });
    
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }
    
    // Get variants separately to ensure proper population
    const variants = await Variant.find({ product: product._id, isActive: true });
    
    res.json({
      success: true,
      product: {
        ...product.toObject(),
        variants
      }
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    await product.populate('category');
    
    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category');
    
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }
    
    // Also deactivate variants
    await Variant.updateMany(
      { product: req.params.id },
      { isActive: false }
    );
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({
      success: true,
      category
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory
};