import { Module } from '@nestjs/common';
import { BiddingGateway } from './bidding.gateway';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [BiddingGateway],
  exports: [BiddingGateway],
})
export class BiddingModule {}