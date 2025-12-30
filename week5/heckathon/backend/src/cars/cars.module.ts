// cars.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Car, CarSchema } from './schemas/car.schema';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { CloudinaryService } from '../common/cloudinary.service';
import { AuctionsModule } from '../auctions/auctions.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
    AuctionsModule,
  ],
  providers: [CarsService, CloudinaryService],
  controllers: [CarsController],
  exports: [CarsService],
})
export class CarsModule {}
