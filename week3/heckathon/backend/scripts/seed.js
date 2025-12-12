require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import models
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Variant = require('../models/Variant');
const { ROLES } = require('../constants/roles');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Variant.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create superadmin user
    const superadmin = await User.create({
      name: 'Super Admin',
      email: 'superadmin@tea.com',
      password: 'password123',
      role: ROLES.SUPERADMIN
    });
    
    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@tea.com',
      password: 'password123',
      role: ROLES.ADMIN
    });
    
    // Create regular user
    const user = await User.create({
      name: 'John Doe',
      email: 'user@tea.com',
      password: 'password123',
      role: ROLES.USER
    });
    
    console.log('Created users');
    
    // Create categories
    const categories = await Category.create([
      { name: 'Black Tea', description: 'Rich and robust black teas' },
      { name: 'Green Tea', description: 'Fresh and healthy green teas' },
      { name: 'Herbal Tea', description: 'Caffeine-free herbal blends' },
      { name: 'White Tea', description: 'Delicate and subtle white teas' },
      { name: 'Oolong Tea', description: 'Traditional semi-fermented teas' }
    ]);
    
    console.log('Created categories');
    
    // Create products
    const products = await Product.create([
      {
        name: 'Earl Grey Supreme',
        description: 'A classic Earl Grey blend with bergamot oil and cornflower petals',
        basePrice: 15.99,
        category: categories[0]._id,
        flavor: 'Citrusy, Floral',
        images: ['earl-grey-1.jpg', 'earl-grey-2.jpg'],
        rating: { average: 4.5, count: 120 },
        tags: ['classic', 'bergamot', 'afternoon']
      },
      {
        name: 'Dragon Well Green',
        description: 'Premium Chinese green tea with a delicate, sweet flavor',
        basePrice: 22.50,
        category: categories[1]._id,
        flavor: 'Fresh, Grassy',
        images: ['dragon-well-1.jpg'],
        rating: { average: 4.7, count: 85 },
        tags: ['chinese', 'premium', 'antioxidants']
      },
      {
        name: 'Chamomile Dreams',
        description: 'Soothing chamomile flowers for relaxation and sleep',
        basePrice: 12.99,
        category: categories[2]._id,
        flavor: 'Floral, Honey-like',
        images: ['chamomile-1.jpg', 'chamomile-2.jpg'],
        rating: { average: 4.3, count: 95 },
        tags: ['herbal', 'relaxing', 'bedtime']
      },
      {
        name: 'Silver Needle White',
        description: 'Rare and delicate white tea with subtle sweetness',
        basePrice: 45.00,
        category: categories[3]._id,
        flavor: 'Subtle, Sweet',
        images: ['silver-needle-1.jpg'],
        rating: { average: 4.8, count: 42 },
        tags: ['rare', 'premium', 'delicate']
      },
      {
        name: 'Iron Goddess Oolong',
        description: 'Traditional Chinese oolong with complex flavor profile',
        basePrice: 28.75,
        category: categories[4]._id,
        flavor: 'Complex, Fruity',
        images: ['iron-goddess-1.jpg', 'iron-goddess-2.jpg'],
        rating: { average: 4.6, count: 67 },
        tags: ['traditional', 'complex', 'chinese']
      }
    ]);
    
    console.log('Created products');
    
    // Create variants for each product
    const variants = [];
    
    for (const product of products) {
      // Small size variant
      variants.push({
        product: product._id,
        name: 'Small',
        size: '50g',
        weight: '50g',
        priceDifference: 0,
        stock: Math.floor(Math.random() * 50) + 20,
        sku: `${product.name.replace(/\s+/g, '-').toLowerCase()}-small-50g`
      });
      
      // Medium size variant
      variants.push({
        product: product._id,
        name: 'Medium',
        size: '100g',
        weight: '100g',
        priceDifference: product.basePrice * 0.8, // 80% more for double size
        stock: Math.floor(Math.random() * 40) + 15,
        sku: `${product.name.replace(/\s+/g, '-').toLowerCase()}-medium-100g`
      });
      
      // Large size variant
      variants.push({
        product: product._id,
        name: 'Large',
        size: '200g',
        weight: '200g',
        priceDifference: product.basePrice * 1.5, // 150% more for quad size
        stock: Math.floor(Math.random() * 30) + 10,
        sku: `${product.name.replace(/\s+/g, '-').toLowerCase()}-large-200g`
      });
    }
    
    await Variant.create(variants);
    console.log('Created variants');
    
    console.log('\n=== SEED DATA SUMMARY ===');
    console.log(`Created ${await User.countDocuments()} users`);
    console.log(`Created ${await Category.countDocuments()} categories`);
    console.log(`Created ${await Product.countDocuments()} products`);
    console.log(`Created ${await Variant.countDocuments()} variants`);
    
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Superadmin: superadmin@tea.com / password123');
    console.log('Admin: admin@tea.com / password123');
    console.log('User: user@tea.com / password123');
    
    console.log('\nSeeding completed successfully!');
    
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();