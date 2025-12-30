import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_FILTER } from '@nestjs/core';
import { Connection } from 'mongoose';

import { UsersModule } from './users/users.module';
import { CarsModule } from './cars/cars.module';
import { BidsModule } from './bids/bids.module';
import { PaymentsModule } from './payments/payments.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CategoriesModule } from './categories/categories.module';
import { AuctionsModule } from './auctions/auctions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuthModule } from './auth/auth.module';
import { BiddingModule } from './bidding/bidding.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { DatabaseSeeder } from './database/database-seeder.service';
import { Car, CarSchema } from './cars/schemas/car.schema';
import { User, UserSchema } from './users/schemas/user.schema';
import { Bid, BidSchema } from './bids/schemas/bid.schema';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Car.name, schema: CarSchema },
      { name: User.name, schema: UserSchema },
      { name: Bid.name, schema: BidSchema },
    ]),
    AuthModule,
    UsersModule,
    CarsModule,
    BidsModule,
    PaymentsModule,
    WishlistModule,
    CategoriesModule,
    AuctionsModule,
    NotificationsModule,
    BiddingModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    DatabaseSeeder,
    AppGateway,
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    const mongoUri = this.configService.get<string>('MONGODB_URI');
    this.logger.log(`MONGO_URI from ConfigService: ${mongoUri}`);

    if (this.connection.readyState === 1) {
      this.logger.log('Successfully connected to MongoDB.');
    } else {
      this.connection.once('open', () => {
        this.logger.log('Successfully connected to MongoDB.');
      });
      this.connection.on('error', (error) => {
        this.logger.error('MongoDB connection error:', error);
      });
    }
  }
}
