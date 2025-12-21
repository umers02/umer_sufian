const Plan = require('../../models/Plan.model');

const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 });
    res.json({ plans });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPlan = async (req, res) => {
  try {
    const { name, price, duration, features, maxDevices, videoQuality, downloadAllowed, adsSupported, description, isPremium } = req.body;
    
    const plan = await Plan.create({
      name,
      price: parseFloat(price),
      duration: parseInt(duration),
      features: features ? features.split(',').map(f => f.trim()) : [],
      maxDevices: parseInt(maxDevices) || 1,
      videoQuality,
      downloadAllowed: downloadAllowed === 'true',
      adsSupported: adsSupported === 'true',
      description,
      isPremium: isPremium === 'true'
    });

    res.status(201).json({ message: 'Plan created successfully', plan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (updates.features && typeof updates.features === 'string') {
      updates.features = updates.features.split(',').map(f => f.trim());
    }

    const plan = await Plan.findByIdAndUpdate(id, updates, { new: true });
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json({ message: 'Plan updated successfully', plan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findByIdAndDelete(id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllPlans, createPlan, updatePlan, deletePlan };