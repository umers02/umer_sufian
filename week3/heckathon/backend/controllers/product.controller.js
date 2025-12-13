const Product = require("../models/Product");
const Variant = require("../models/Variant");
const Category = require("../models/Category");
const ErrorResponse = require("../utils/errorResponse");
const { getPagination, getPaginationResult } = require("../utils/pagination");

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
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);

    // Build filter object
    let filter = { isActive: true };

    // Handle multiple categories - can be names or IDs
    if (category) {
      let categoryIds = [];
      
      if (Array.isArray(category)) {
        categoryIds = category;
      } else if (category.includes(',')) {
        categoryIds = category.split(',');
      } else {
        categoryIds = [category];
      }
      
      // Check if categories are ObjectIds or names
      const isValidObjectId = (id) => {
        return /^[0-9a-fA-F]{24}$/.test(String(id));
      };
      
      const isObjectId = categoryIds.every(id => isValidObjectId(id));
      
      if (isObjectId) {
        // All are ObjectIds, use directly
        filter.category = categoryIds.length === 1 ? categoryIds[0] : { $in: categoryIds };
      } else {
        // Categories are names, need to find their IDs
        const categories = await Category.find({ 
          name: { $in: categoryIds },
          isActive: true 
        });
        const foundIds = categories.map(cat => cat._id);
        
        if (foundIds.length > 0) {
          filter.category = foundIds.length === 1 ? foundIds[0] : { $in: foundIds };
        } else {
          // No categories found, return empty result
          filter.category = { $in: [] };
        }
      }
    }
    if (flavor) filter.flavor = new RegExp(flavor, "i");
    if (rating) filter["rating.average"] = { $gte: parseFloat(rating) };

    // ✅ ONLY product name search
    if (search && search.trim() !== "") {
      filter.name = { $regex: search.trim(), $options: "i" };
    }

    // Price filtering requires aggregation with variants
    let pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: "variants",
          localField: "_id",
          foreignField: "product",
          as: "variants",
        },
      },
      {
        $addFields: {
          minVariantPrice: {
            $min: {
              $map: {
                input: "$variants",
                as: "variant",
                in: { $add: ["$basePrice", "$$variant.priceDifference"] },
              },
            },
          },
        },
      },
    ];

    if (minPrice || maxPrice) {
      let priceFilter = {};
      if (minPrice) priceFilter.$gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);
      pipeline.push({ $match: { minVariantPrice: priceFilter } });
    }

    // Add sorting
    if (sortBy && sortBy.trim() !== '') {
      const sortObj = {};
      sortObj[sortBy] = sortOrder === "asc" ? 1 : -1;
      pipeline.push({ $sort: sortObj });
    } else {
      // Default sort by createdAt descending
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    // Add pagination
    pipeline.push({ $skip: skip }, { $limit: limitNum });

    // Populate category
    pipeline.push({
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true
      }
    });

    const products = await Product.aggregate(pipeline);

    // Get total count for pagination
    const totalCount = await Product.countDocuments(filter);
    const pagination = getPaginationResult(totalCount, pageNum, limitNum);

    res.json({
      success: true,
      products,
      pagination,
      totalCount,
      hasResults: products.length > 0
    });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return next(new ErrorResponse("Invalid product ID format", 400));
    }

    // Find product with category population
    const product = await Product.findById(id)
      .populate("category", "name _id")
      .lean(); // Use lean() for better performance

    if (!product) {
      return next(new ErrorResponse("Product not found", 404));
    }

    // Get variants separately to ensure proper population
    const variants = await Variant.find({
      product: product._id,
      isActive: true,
    }).lean();

    res.json({
      success: true,
      product: {
        ...product,
        variants: variants || [],
      },
    });
  } catch (error) {
    console.error('Error in getProduct:', error);
    // Handle MongoDB cast errors
    if (error.name === 'CastError') {
      return next(new ErrorResponse("Invalid product ID", 400));
    }
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    await product.populate("category");

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("category");

    if (!product) {
      return next(new ErrorResponse("Product not found", 404));
    }

    res.json({
      success: true,
      product,
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
      return next(new ErrorResponse("Product not found", 404));
    }

    // Also deactivate variants
    await Variant.updateMany({ product: req.params.id }, { isActive: false });

    res.json({
      success: true,
      message: "Product deleted successfully",
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
      categories,
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
      category,
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
  createCategory,
};
