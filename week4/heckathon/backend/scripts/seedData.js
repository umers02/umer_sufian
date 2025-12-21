require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const Plan = require('../models/Plan.model');
const Video = require('../models/Video.model');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Plan.deleteMany({});
    await Video.deleteMany({});
    
    // Create SuperAdmin
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'superadmin@ott.com',
      password: 'admin123',
      role: 'superAdmin'
    });
    
    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@ott.com',
      password: 'admin123',
      role: 'admin'
    });
    
    // Create Test User
    const user = await User.create({
      name: 'Test User',
      email: 'user@ott.com',
      password: 'user123',
      role: 'user'
    });
    
    // Create Plans
    const freeTrial = await Plan.create({
      name: 'Free Trial',
      price: 0,
      duration: 7,
      features: ['HD Quality', '1 Device', 'Limited Content'],
      maxDevices: 1,
      videoQuality: 'HD',
      downloadAllowed: false,
      adsSupported: true,
      description: '7-day free trial with limited content access'
    });
    
    const basicPlan = await Plan.create({
      name: 'Basic Plan',
      price: 9.99,
      duration: 30,
      features: ['HD Quality', '1 Device', 'Full Content Library'],
      maxDevices: 1,
      videoQuality: 'HD',
      downloadAllowed: false,
      adsSupported: true,
      description: 'Basic plan with full content access'
    });
    
    const premiumPlan = await Plan.create({
      name: 'Premium Plan',
      price: 19.99,
      duration: 30,
      features: ['4K Quality', '4 Devices', 'Full Content Library', 'Downloads', 'No Ads'],
      maxDevices: 4,
      videoQuality: '4K',
      downloadAllowed: true,
      adsSupported: false,
      description: 'Premium plan with 4K quality and downloads',
      isPremium: true
    });
    
    // Create Sample Videos
    const videos = [
      {
        title: 'Sample Movie 1',
        description: 'A thrilling action movie with amazing stunts',
        videoUrl: 'uploads/videos/sample1.mp4',
        thumbnailUrl: 'uploads/thumbnails/sample1.jpg',
        duration: 120,
        genre: 'Action',
        releaseYear: 2023,
        director: 'John Director',
        cast: ['Actor 1', 'Actor 2'],
        rating: 8.5,
        language: 'English',
        quality: 'HD',
        type: 'movie',
        isPremium: false,
        uploadedBy: admin._id
      },
      {
        title: 'Premium Series Episode 1',
        description: 'First episode of an exclusive premium series',
        videoUrl: 'uploads/videos/premium1.mp4',
        thumbnailUrl: 'uploads/thumbnails/premium1.jpg',
        duration: 45,
        genre: 'Drama',
        releaseYear: 2023,
        director: 'Jane Director',
        cast: ['Lead Actor', 'Supporting Actor'],
        rating: 9.0,
        language: 'English',
        quality: '4K',
        type: 'series',
        isPremium: true,
        uploadedBy: admin._id
      }
    ];
    
    await Video.insertMany(videos);
    
    console.log('Seed data created successfully!');
    console.log('SuperAdmin: superadmin@ott.com / admin123');
    console.log('Admin: admin@ott.com / admin123');
    console.log('User: user@ott.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();