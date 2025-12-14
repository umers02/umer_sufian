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
    
    // Create categories matching Collection page filters
    const categories = await Category.create([
      { name: 'Black teas', description: 'Rich and robust black teas' },
      { name: 'Green teas', description: 'Fresh and healthy green teas' },
      { name: 'White teas', description: 'Delicate and subtle white teas' },
      { name: 'Oolong', description: 'Traditional semi-fermented teas' },
      { name: 'Matcha', description: 'Premium Japanese matcha powder' },
      { name: 'Herbal teas', description: 'Caffeine-free herbal blends' },
      { name: 'Rooibos', description: 'South African red bush tea' },
      { name: 'Teaware', description: 'Tea accessories and brewing equipment' }
    ]);
    
    console.log('Created categories');
    
    // Create products for each category
    const products = await Product.create([
      // Black teas
      {
        name: 'Earl Grey Supreme',
        description: 'A classic Earl Grey blend with bergamot oil and cornflower petals',
        basePrice: 15.99,
        category: categories[0]._id,
        flavor: 'Citrusy, Floral',
        images: ['/cineman-tea.jpg'],
        rating: { average: 4.5, count: 120 },
        tags: ['classic', 'bergamot', 'afternoon']
      },
      {
        name: 'English Breakfast',
        description: 'Bold and malty black tea blend perfect for morning',
        basePrice: 13.99,
        category: categories[0]._id,
        flavor: 'Malty, Strong',
        images: ['/cineman-tea.jpg'],
        rating: { average: 4.4, count: 98 },
        tags: ['morning', 'strong', 'classic']
      },
      // Green teas
      {
        name: 'Dragon Well Green',
        description: 'Premium Chinese green tea with a delicate, sweet flavor',
        basePrice: 22.50,
        category: categories[1]._id,
        flavor: 'Fresh, Grassy',
        images: ['/cineman-tea.jpg'],
        rating: { average: 4.7, count: 85 },
        tags: ['chinese', 'premium', 'antioxidants']
      },
      {
        name: 'Sencha Green',
        description: 'Japanese green tea with fresh, vegetal notes',
        basePrice: 18.99,
        category: categories[1]._id,
        flavor: 'Vegetal, Fresh',
        images: ['/cineman-tea.jpg'],
        rating: { average: 4.6, count: 72 },
        tags: ['japanese', 'fresh', 'healthy']
      },
      // White teas
      {
        name: 'Silver Needle White',
        description: 'Rare and delicate white tea with subtle sweetness',
        basePrice: 45.00,
        category: categories[2]._id,
        flavor: 'Subtle, Sweet',
        images: ['/cineman-tea.jpg'],
        rating: { average: 4.8, count: 42 },
        tags: ['rare', 'premium', 'delicate']
      },
      {
        name: 'White Peony',
        description: 'Smooth white tea with gentle floral notes',
        basePrice: 32.00,
        category: categories[2]._id,
        flavor: 'Floral, Smooth',
        images: ['/cineman-tea.jpg'],
        rating: { average: 4.5, count: 38 },
        tags: ['floral', 'smooth', 'premium']
      },
      // Oolong
      {
        name: 'Iron Goddess Oolong',
        description: 'Traditional Chinese oolong with complex flavor profile',
        basePrice: 28.75,
        category: categories[3]._id,
        flavor: 'Complex, Fruity',
        images: ['/cineman-tea.jpg'],
        rating: { average: 4.6, count: 67 },
        tags: ['traditional', 'complex', 'chinese']
      },
      {
        name: 'Milk Oolong',
        description: 'Creamy oolong tea with natural milky flavor',
        basePrice: 35.50,
        category: categories[3]._id,
        flavor: 'Creamy, Sweet',
        images: ['/cineman-tea.jpg'],
        rating: { average: 4.7, count: 54 },
        tags: ['creamy', 'sweet', 'unique']
      },
      // Matcha
      {
        name: 'Ceremonial Matcha',
        description: 'Premium ceremonial grade matcha powder from Japan',
        basePrice: 55.00,
        category: categories[4]._id,
        flavor: 'Umami, Grassy',
        images: ['/cineman-tea.jpg'],
        rating: { average: 4.9, count: 89 },
        tags: ['ceremonial', 'premium', 'japanese']
      },
      {
        name: 'Culinary Matcha',
        description: 'High-quality matcha perfect for lattes and baking',
        basePrice: 25.00,
        category: categories[4]._id,
        flavor: 'Rich, Earthy',
        images: ['/cineman-tea.jpg'],
        rating: { average: 4.4, count: 76 },
        tags: ['culinary', 'versatile', 'baking']
      },
      // Herbal teas
      {
        name: 'Chamomile Dreams',
        description: 'Soothing chamomile flowers for relaxation and sleep',
        basePrice: 12.99,
        category: categories[5]._id,
        flavor: 'Floral, Honey-like',
        images: ['/cineman-tea.jpg'],
        rating: { average: 4.3, count: 95 },
        tags: ['herbal', 'relaxing', 'bedtime']
      },
      {
        name: 'Peppermint Fresh',
        description: 'Refreshing peppermint leaves for digestion',
        basePrice: 11.50,
        category: categories[5]._id,
        flavor: 'Minty, Cool',
        images: ['/cineman-tea.jpg'],
        rating: { average: 4.2, count: 88 },
        tags: ['minty', 'digestive', 'refreshing']
      },
      // Rooibos
      {
        name: 'Red Bush Rooibos',
        description: 'Naturally caffeine-free South African red bush tea',
        basePrice: 14.99,
        category: categories[6]._id,
        flavor: 'Sweet, Nutty',
        images: ['/cineman-tea.jpg'],
        rating: { average: 4.4, count: 65 },
        tags: ['caffeine-free', 'sweet', 'south-african']
      },
      {
        name: 'Vanilla Rooibos',
        description: 'Smooth rooibos with natural vanilla flavor',
        basePrice: 16.50,
        category: categories[6]._id,
        flavor: 'Vanilla, Sweet',
        images: ['/cineman-tea.jpg'],
        rating: { average: 4.5, count: 71 },
        tags: ['vanilla', 'smooth', 'dessert']
      },
      // Teaware
      {
        name: 'Glass Teapot Set',
        description: 'Elegant glass teapot with infuser and cups',
        basePrice: 45.00,
        category: categories[7]._id,
        flavor: 'N/A',
        images: ['/cineman-tea.jpg'],
        rating: { average: 4.6, count: 34 },
        tags: ['teapot', 'glass', 'set']
      },
      {
        name: 'Bamboo Tea Strainer',
        description: 'Eco-friendly bamboo tea strainer for loose leaf teas',
        basePrice: 8.99,
        category: categories[7]._id,
        flavor: 'N/A',
        images: ['/cineman-tea.jpg'],
        rating: { average: 4.3, count: 28 },
        tags: ['bamboo', 'eco-friendly', 'strainer']
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
    
    console.log('\n=== CATEGORIES CREATED ===');
    const createdCategories = await Category.find({}, 'name');
    createdCategories.forEach(cat => console.log(`- ${cat.name}`));
    
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