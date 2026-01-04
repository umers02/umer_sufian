import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { Auction, AuctionSchema } from './schemas/auction.schema';
import { BiddingModule } from '../bidding/bidding.module';
import { UsersModule } from '../users/users.module'; // ✅ UsersModule import
import { User, UserSchema } from '../users/schemas/user.schema'; // ✅ User schema import

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auction.name, schema: AuctionSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // ✅ Add User model
    forwardRef(() => UsersModule), // ✅ optional, circular dependency avoid karne ke liye
    BiddingModule,
  ],
  providers: [AuctionsService],
  controllers: [AuctionsController],
  exports: [AuctionsService],
})
export class AuctionsModule {}
