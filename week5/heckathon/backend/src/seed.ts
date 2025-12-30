import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Car } from './cars/schemas/car.schema';
import { User } from './users/schemas/user.schema';
import { Bid } from './bids/schemas/bid.schema';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const carModel = app.get(getModelToken(Car.name));
  const userModel = app.get(getModelToken(User.name));
  const bidModel = app.get(getModelToken(Bid.name));

  // Clear existing data first
  await bidModel.deleteMany({});
  await carModel.deleteMany({});
  await userModel.deleteMany({});
  console.log('Cleared existing data');

  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = await userModel.insertMany([
    {
      username: 'seller1',
      email: 'seller1@example.com',
      passwordHash: hashedPassword,
      fullName: 'John Seller',
      mobileNumber: '+1234567890',
    },
    {
      username: 'seller2',
      email: 'seller2@example.com',
      passwordHash: hashedPassword,
      fullName: 'Jane Dealer',
      mobileNumber: '+1234567891',
    },
  ]);

  const now = new Date();
  const cars = await carModel.insertMany([
    {
      sellerId: users[0]._id,
      title: 'Red Mazda MX-5 Sports Car',
      description: 'Beautiful red sports car in excellent condition',
      make: 'Mazda',
      model: 'MX-5',
      year: 2022,
      bodyType: 'sports',
      category: 'Sports Cars',
      photos: ['/red-mazda-mx5-sports-car.png','/white-porsche-911-sports-car.png','/white-porsche-911-sports-car.png','/red-mazda-mx5-sports-car.png','/white-porsche-911-sports-car.png','/white-porsche-911-sports-car.png'],
      startingPrice: 25000,
      currentPrice: 27500,
      isCompleted: false,
      startTime: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
    },
    {
      sellerId: users[1]._id,
      title: 'White Porsche 911 Sports Car',
      description: 'Iconic white sports car with premium features',
      make: 'Porsche',
      model: '911',
      year: 2023,
      bodyType: 'sports',
      category: 'Luxury Sports',
      photos: ['/white-porsche-911-sports-car.png','/red-mazda-mx5-sports-car.png','/white-porsche-911-sports-car.png','/white-porsche-911-sports-car.png'],
      startingPrice: 85000,
      currentPrice: 92000,
      isCompleted: false,
      startTime: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
    },
  ]);

  await bidModel.insertMany([
    {
      auctionId: cars[0]._id,
      bidderId: users[1]._id,
      amount: 26000,
      placedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    },
    {
      auctionId: cars[0]._id,
      bidderId: users[0]._id,
      amount: 27500,
      placedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
    },
  ]);

  console.log('Dummy data added successfully!');
  await app.close();
}

seed().catch(console.error);