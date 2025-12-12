const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const ErrorResponse = require('../utils/errorResponse');
const { ROLES } = require('../constants/roles');

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse('User already exists', 400));
    }
    
    const user = await User.create({
      name,
      email,
      password,
      role: role || ROLES.USER
    });
    
    const token = generateToken({ id: user._id, role: user.role });
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }
    
    if (user.isBlocked) {
      return next(new ErrorResponse('Account is blocked', 403));
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }
    
    const token = generateToken({ id: user._id, role: user.role });
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, address } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, address },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile, updateProfile };