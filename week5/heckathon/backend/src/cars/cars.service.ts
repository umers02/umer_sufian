// cars.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDocument } from './schemas/car.schema';
import { AuctionsService } from '../auctions/auctions.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    private auctionsService: AuctionsService,
  ) {}

  async create(car: Partial<Car>) {
    const newCar = new this.carModel(car);
    const savedCar = await newCar.save();
    
    // Create auction for the car
    await this.auctionsService.create({
      car: savedCar._id as any,
      startTime: car.startTime || new Date(),
      endTime: car.endTime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      currentPrice: car.startingPrice || 0,
      status: 'upcoming',
    });
    
    return savedCar;
  }

  async findAll(filters?: {
    make?: string;
    model?: string;
    year?: string;
    minPrice?: string;
    maxPrice?: string;
  }) {
    await this.updateExpiredAuctions();
    
    const query: any = {};
    
    if (filters?.make) query.make = new RegExp(filters.make, 'i');
    if (filters?.model) query.model = new RegExp(filters.model, 'i');
    if (filters?.year) query.year = parseInt(filters.year);
    
    if (filters?.minPrice || filters?.maxPrice) {
      query.currentPrice = {};
      if (filters.minPrice) query.currentPrice.$gte = parseInt(filters.minPrice);
      if (filters.maxPrice) query.currentPrice.$lte = parseInt(filters.maxPrice);
    }
    
    return this.carModel.find(query).populate('sellerId').populate('bids').exec();
  }

  async getFilterOptions() {
    const makes = await this.carModel.distinct('make');
    const models = await this.carModel.distinct('model');
    const years = await this.carModel.distinct('year');
    
    return {
      makes: makes.filter(Boolean),
      models: models.filter(Boolean),
      years: years.filter(Boolean).sort((a, b) => b - a),
    };
  }

  async findOne(id: string) {
    // Update expired auctions before returning
    await this.updateExpiredAuctions();
    return this.carModel
      .findById(id)
      .populate('sellerId')
      .populate('bids')
      .exec();
  }

  async findByUserId(userId: string) {
    return this.carModel
      .find({ sellerId: userId })
      .populate('bids')
      .sort({ createdAt: -1 })
      .exec();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateExpiredAuctions() {
    const now = new Date();
    await this.carModel.updateMany(
      {
        endTime: { $lte: now },
        isCompleted: false
      },
      {
        $set: { isCompleted: true }
      }
    );
  }
}