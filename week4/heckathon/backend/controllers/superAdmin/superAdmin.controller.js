const User = require('../../models/User.model');
const Video = require('../../models/Video.model');
const Subscription = require('../../models/Subscription.model');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['user', 'admin'] } })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json({ admins });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndUpdate(userId, { isBlocked: true });
    res.json({ message: 'User blocked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndUpdate(userId, { isBlocked: false });
    res.json({ message: 'User unblocked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const admin = await User.create({ name, email, password, role: 'admin' });
    res.status(201).json({ message: 'Admin created successfully', admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const blockAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    await User.findByIdAndUpdate(adminId, { isBlocked: true });
    res.json({ message: 'Admin blocked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unblockAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    await User.findByIdAndUpdate(adminId, { isBlocked: false });
    res.json({ message: 'Admin unblocked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    await User.findByIdAndDelete(adminId);
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalVideos = await Video.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });

    res.json({ totalUsers, totalAdmins, totalVideos, activeSubscriptions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, getAllAdmins, blockUser, unblockUser, createAdmin, blockAdmin, unblockAdmin, deleteAdmin, getDashboardStats };