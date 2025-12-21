const User = require('../../models/User.model');
const Subscription = require('../../models/Subscription.model');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const subscription = await Subscription.findOne({ 
      userId: req.user.id, 
      status: { $in: ['active', 'trial'] } 
    }).populate('planId');

    res.json({ user, subscription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, dateOfBirth } = req.body;
    const updates = {};
    
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (dateOfBirth) updates.dateOfBirth = dateOfBirth;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile };