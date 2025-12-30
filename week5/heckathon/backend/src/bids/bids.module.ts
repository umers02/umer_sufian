import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, BidSchema } from './schemas/bid.schema';
import { Car, CarSchema } from '../cars/schemas/car.schema';
import { Auction, AuctionSchema } from '../auctions/schemas/auction.schema';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { BiddingModule } from '../bidding/bidding.module';
import { AuctionsModule } from '../auctions/auctions.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bid.name, schema: BidSchema },
      { name: Car.name, schema: CarSchema },
      { name: Auction.name, schema: AuctionSchema },
    ]),
    BiddingModule,
    AuctionsModule,
  ],
  providers: [BidsService],
  controllers: [BidsController],
  exports: [BidsService],
})
export class BidsModule {}
