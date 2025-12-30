import { Module } from '@nestjs/common';
import { BiddingGateway } from './bidding.gateway';

@Module({
  providers: [BiddingGateway],
  exports: [BiddingGateway],
})
export class BiddingModule {}