import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoyaltyService } from './loyalty.service';
import { LoyaltyHistory, LoyaltyHistorySchema } from './entities/loyalty-history.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LoyaltyHistory.name, schema: LoyaltyHistorySchema }]),
  ],
  providers: [LoyaltyService],
  exports: [LoyaltyService],
})
export class LoyaltyModule {}