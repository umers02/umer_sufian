const Subscription = require('../../models/Subscription.model');
const Card = require('../../models/Card.model');
const User = require('../../models/User.model');

// Get subscription plans
const getPlans = async (req, res) => {
  try {
    const plans = [
      {
        id: 'basic',
        name: 'Basic Plan',
        price: 9.99,
        duration: 30,
        features: ['Access to basic content', 'Ad-free streaming', '720p resolution', '1 device']
      },
      {
        id: 'standard',
        name: 'Standard Plan',
        price: 12.99,
        duration: 30,
        features: ['Access to most content', 'Ad-free streaming', '1080p resolution', '2 devices'],
        popular: true
      },
      {
        id: 'premium',
        name: 'Premium Plan',
        price: 14.99,
        duration: 30,
        features: ['Access to all content', 'Ad-free streaming', '4K resolution', '4 devices']
      }
    ];

    res.json({ plans });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Start free trial
const startFreeTrial = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user already had free trial
    const existingTrial = await Subscription.findOne({ 
      userId, 
      isFreeTrial: true 
    });

    if (existingTrial) {
      return res.status(400).json({ message: 'Free trial already used' });
    }

    // Create free trial subscription
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // 30 days trial

    const subscription = new Subscription({
      userId,
      planType: 'free_trial',
      price: 0,
      endDate,
      isFreeTrial: true
    });

    await subscription.save();

    res.json({ 
      message: 'Free trial activated successfully',
      subscription 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Subscribe to plan
const subscribeToPlan = async (req, res) => {
  try {
    const { planType, cardDetails } = req.body;
    const userId = req.user.id;

    // Validate plan
    const validPlans = ['basic', 'standard', 'premium'];
    if (!validPlans.includes(planType)) {
      return res.status(400).json({ message: 'Invalid plan type' });
    }

    // Save card details
    console.log('Saving card details for user:', userId);
    const card = new Card({
      userId,
      cardNumber: cardDetails.cardNumber,
      cardHolderName: cardDetails.cardHolderName,
      expiryMonth: cardDetails.expiryMonth,
      expiryYear: cardDetails.expiryYear,
      cvv: cardDetails.cvv,
      isDefault: true
    });

    await card.save();
    console.log('Card saved successfully');

    // Cancel existing active subscription
    await Subscription.updateMany(
      { userId, status: 'active' },
      { status: 'cancelled' }
    );

    // Create new subscription
    const plans = {
      basic: { price: 9.99, duration: 30 },
      standard: { price: 12.99, duration: 30 },
      premium: { price: 14.99, duration: 30 }
    };

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plans[planType].duration);

    const subscription = new Subscription({
      userId,
      planType,
      price: plans[planType].price,
      endDate,
      isFreeTrial: false
    });

    await subscription.save();

    res.json({ 
      message: 'Subscription activated successfully',
      subscription 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user subscription
const getUserSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const subscription = await Subscription.findOne({ 
      userId, 
      status: 'active',
      endDate: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!subscription) {
      return res.json({ 
        hasActiveSubscription: false,
        message: 'No active subscription found'
      });
    }

    res.json({ 
      hasActiveSubscription: true,
      subscription 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel subscription
const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;

    const subscription = await Subscription.findOneAndUpdate(
      { userId, status: 'active' },
      { status: 'cancelled' },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    res.json({ 
      message: 'Subscription cancelled successfully',
      subscription 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPlans,
  startFreeTrial,
  subscribeToPlan,
  getUserSubscription,
  cancelSubscription
};