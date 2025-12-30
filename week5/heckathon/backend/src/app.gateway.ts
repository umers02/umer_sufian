import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Types } from 'mongoose';
import { NotificationsService } from './notifications/notifications.service';

@WebSocketGateway({ cors: true })
export class AppGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly notificationService: NotificationsService) {}

  @SubscribeMessage('joinAuction')
  handleJoinAuction(@MessageBody() data: { auctionId: string }) {
    this.server.to(data.auctionId).emit('joined', `Joined auction ${data.auctionId}`);
  }

  @SubscribeMessage('leaveAuction')
  handleLeaveAuction(@MessageBody() data: { auctionId: string }) {
    this.server.to(data.auctionId).emit('left', `Left auction ${data.auctionId}`);
  }

  @SubscribeMessage('bidPlaced')
  async handleBid(
    @MessageBody()
    data: {
      auctionId: string;
      bidderId: string;
      amount: number;
    },
  ) {
    // Save notification in DB
    await this.notificationService.create({
      userId: new Types.ObjectId(data.bidderId),
      auctionId: new Types.ObjectId(data.auctionId),
      type: 'bidPlaced',
      message: `New bid of $${data.amount} placed`,
    });

    // Emit real-time updates to all clients in auction room
    this.server.to(data.auctionId).emit('newBid', data);
  }

  // 🔔 Auction start notification
  async notifyAuctionStart(auctionId: string, title: string) {
    const message = `Auction "${title}" has started!`;

    await this.notificationService.create({
      auctionId: new Types.ObjectId(auctionId),
      type: 'auctionStart',
      message,
    });

    this.server.to(auctionId).emit('auctionStart', { auctionId, message });
  }

  // 🔔 Auction ended notification
  async notifyAuctionEnd(auctionId: string) {
    const message = `Auction ${auctionId} has ended!`;

    await this.notificationService.create({
      auctionId: new Types.ObjectId(auctionId),
      type: 'auctionEnd',
      message,
    });

    this.server.to(auctionId).emit('auctionEnd', { auctionId, message });
  }

  // 🔔 Winner announcement
  async notifyWinner(auctionId: string, winnerId: string) {
    const message = `User ${winnerId} has won the auction ${auctionId}!`;

    await this.notificationService.create({
      userId: new Types.ObjectId(winnerId),
      auctionId: new Types.ObjectId(auctionId),
      type: 'auctionWinner',
      message,
    });

    this.server
      .to(auctionId)
      .emit('auctionWinner', { auctionId, winnerId, message });
  }

  // 🕒 Time remaining update
  emitTimeUpdate(auctionId: string, timeRemaining: string) {
    this.server.to(auctionId).emit('timeUpdate', { auctionId, timeRemaining });
  }
}
