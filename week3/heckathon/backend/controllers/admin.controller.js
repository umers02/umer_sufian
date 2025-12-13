const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Variant = require('../models/Variant');
const ErrorResponse = require('../utils/errorResponse');
const { ROLES } = require('../constants/roles');
const { getPagination, getPaginationResult } = require('../utils/pagination');

const getDashboardStats = async (req, res, next) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments({ role: ROLES.USER });
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments({ isActive: true });
    
    // Get revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ['confirmed', 'shipped', 'delivered'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    
    // Get low stock products
    const lowStockVariants = await Variant.find({ stock: { $lte: 10 }, isActive: true })
      .populate('product', 'name')
      .limit(10);
    
    // Get recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: { $in: ['confirmed', 'shipped', 'delivered'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue,
        lowStockVariants,
        recentOrders,
        monthlyRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

// const getUsers = async (req, res, next) => {
//   try {
//     const { page = 1, limit = 10, role, isBlocked } = req.query;
//     const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);
    
//     let filter = {};
//     if (role) filter.role = role;
//     if (isBlocked !== undefined) filter.isBlocked = isBlocked === 'true';
    
//     const users = await User.find(filter)
//       .select('-password')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limitNum);
    
//     const totalCount = await User.countDocuments(filter);
//     const pagination = getPaginationResult(totalCount, pageNum, limitNum);
    
//     res.json({
//       success: true,
//       users,
//       pagination
//     });
//   } catch (error) {
//     next(error);
//   }
// };
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, isBlocked, search } = req.query;
    const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);

    let filter = {};

    if (role) filter.role = role;
    if (isBlocked !== undefined) filter.isBlocked = isBlocked === 'true';

    // ✅ Search by name OR email
    if (search && search.trim() !== '') {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalCount = await User.countDocuments(filter);
    const pagination = getPaginationResult(totalCount, pageNum, limitNum);

    res.json({
      success: true,
      users,
      pagination
    });
  } catch (error) {
    next(error);
  }
};

const blockUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    
    if (user.role === ROLES.SUPERADMIN) {
      return next(new ErrorResponse('Cannot block superadmin', 403));
    }
    
    user.isBlocked = true;
    await user.save();
    
    res.json({
      success: true,
      message: 'User blocked successfully'
    });
  } catch (error) {
    next(error);
  }
};

const unblockUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    
    user.isBlocked = false;
    await user.save();
    
    res.json({
      success: true,
      message: 'User unblocked successfully'
    });
  } catch (error) {
    next(error);
  }
};

const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse('User already exists', 400));
    }
    
    const admin = await User.create({
      name,
      email,
      password,
      role: ROLES.ADMIN
    });
    
    res.status(201).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    const { adminId } = req.params;
    
    const admin = await User.findById(adminId);
    if (!admin) {
      return next(new ErrorResponse('Admin not found', 404));
    }
    
    if (admin.role !== ROLES.ADMIN) {
      return next(new ErrorResponse('User is not an admin', 400));
    }
    
    await User.findByIdAndDelete(adminId);
    
    res.json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getInventoryReport = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);
    
    const inventory = await Variant.find({ isActive: true })
      .populate('product', 'name category')
      .populate({
        path: 'product',
        populate: {
          path: 'category',
          select: 'name'
        }
      })
      .sort({ stock: 1 })
      .skip(skip)
      .limit(limitNum);
    
    const totalCount = await Variant.countDocuments({ isActive: true });
    const pagination = getPaginationResult(totalCount, pageNum, limitNum);
    
    res.json({
      success: true,
      inventory,
      pagination
    });
  } catch (error) {
    next(error);
  }
};

// Order Management Functions
const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);

    let filter = {};
    if (status && status !== 'all') filter.status = status;
    
    if (search && search.trim() !== '') {
      filter.$or = [
        { _id: { $regex: search.trim(), $options: 'i' } },
        { 'user.name': { $regex: search.trim(), $options: 'i' } }
      ];
    }

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
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return next(new ErrorResponse('Invalid order status', 400));
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

const getOrderDetails = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images')
      .populate('items.variant', 'size weight price');

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

// Product Management Functions
const createProduct = async (req, res, next) => {
  try {
    console.log('Request body:', req.body);
    const { name, description, category, basePrice, tags, variants, flavor } = req.body;

    const product = await Product.create({
      name,
      description,
      category: null,
      basePrice: Number(basePrice),
      flavor: flavor || 'Classic',
      tags: tags || [],
      images: ['/cineman-tea.jpg']
    });
    
    console.log('Product created:', product);

    if (variants && variants.length > 0) {
      const variantPromises = variants.map((variant, index) => 
        Variant.create({
          ...variant,
          product: product._id,
          name: `${product.name} - ${variant.size}`,
          sku: `${product.name.replace(/\s+/g, '-').toLowerCase()}-${variant.size.toLowerCase()}-${Date.now()}-${index}`,
          price: Number(variant.price),
          stock: Number(variant.stock),
          weight: Number(variant.weight)
        })
      );
      await Promise.all(variantPromises);
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.log('Product creation error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { name, description, category, basePrice, tags, isActive } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, description, category, basePrice, tags, isActive },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    await Variant.deleteMany({ product: productId });
    await Product.findByIdAndDelete(productId);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getProductDetails = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId)
      .populate('category', 'name')
      .populate('variants');

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

module.exports = {
  getDashboardStats,
  getUsers,
  blockUser,
  unblockUser,
  createAdmin,
  deleteAdmin,
  getInventoryReport,
  getOrders,
  updateOrderStatus,
  getOrderDetails,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails
};