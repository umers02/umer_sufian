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

const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, isBlocked } = req.query;
    const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);
    
    let filter = {};
    if (role) filter.role = role;
    if (isBlocked !== undefined) filter.isBlocked = isBlocked === 'true';
    
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

module.exports = {
  getDashboardStats,
  getUsers,
  blockUser,
  unblockUser,
  createAdmin,
  deleteAdmin,
  getInventoryReport
};