import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
})
export class BiddingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('BiddingGateway');
  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  constructor(private readonly notificationsService: NotificationsService) {}

  handleConnection(client: Socket) {
    console.log(`🔗 Client connected: ${client.id}`);
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`🔌 Client disconnected: ${client.id}`);
    // Remove user from tracking
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('registerUser')
  handleRegisterUser(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.userSockets.set(data.userId, client.id);
    console.log(`👤 User ${data.userId} registered with socket ${client.id}`);
  }

  @SubscribeMessage('joinAuction')
  handleJoinAuction(
    @MessageBody() data: { auctionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `auction-${data.auctionId}`;
    
    if (client.rooms.has(roomName)) return; // already joined
    
    client.join(roomName);
    console.log(`🏠 Client ${client.id} joined auction room: ${roomName}`);
    this.logger.log(`Client ${client.id} joined auction ${data.auctionId}`);
  }

  @SubscribeMessage('leaveAuction')
  handleLeaveAuction(
    @MessageBody() data: { auctionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `auction-${data.auctionId}`;
    client.leave(roomName);
    console.log(`💪 Client ${client.id} left auction room: ${roomName}`);
    this.logger.log(`Client ${client.id} left auction ${data.auctionId}`);
  }

  // 🔔 Emit new bid notification
  async emitNewBid(auctionId: string, bidData: any) {
    const roomName = `auction-${auctionId}`;
    
    await this.notificationsService.createNewBidNotification(
      auctionId,
      bidData.bidderId,
      bidData.amount,
      bidData.carTitle || 'Car'
    );
    
    this.server.to(roomName).emit('newBid', {
      ...bidData,
      timestamp: new Date(),
      type: 'newBid'
    });
    
    this.server.emit('globalNotification', {
      type: 'newBid',
      title: '💰 New Bid Placed',
      message: `New bid of $${bidData.amount.toLocaleString()} placed`,
      auctionId,
      timestamp: new Date()
    });
    
    this.logger.log(`Emitted newBid to auction ${auctionId}`);
  }

  // 🔔 Emit auction started notification
  async emitAuctionStarted(auctionId: string, auctionData: any) {
    await this.notificationsService.createAuctionStartNotification(
      auctionId,
      auctionData.carTitle,
      auctionData.startingPrice
    );

    const notificationData = {
      type: 'auctionStart',
      auctionId,
      carTitle: auctionData.carTitle,
      startingPrice: auctionData.startingPrice,
      endTime: auctionData.endTime,
      timestamp: new Date(),
      title: '🚀 New Auction Started!',
      message: `${auctionData.carTitle} is now live for bidding`
    };

    this.server.emit('auctionStarted', notificationData);
    this.server.emit('globalNotification', notificationData);
    this.logger.log(`Emitted auctionStarted for auction ${auctionId}`);
  }

  // 🔔 Emit auction ended notification
  async emitAuctionEnded(auctionId: string, endData: any) {
    await this.notificationsService.createAuctionEndNotification(
      auctionId,
      endData.carTitle,
      endData.finalPrice
    );

    const roomName = `auction-${auctionId}`;
    const notificationData = {
      type: 'auctionEnd',
      auctionId,
      ...endData,
      timestamp: new Date(),
      title: '🏁 Auction Ended',
      message: `${endData.carTitle} auction has ended`
    };

    this.server.to(roomName).emit('auctionEnded', notificationData);
    this.server.emit('globalAuctionEnded', notificationData);
    this.server.emit('globalNotification', notificationData);
    this.logger.log(`Emitted auctionEnded for auction ${auctionId}`);
  }

  // 🔔 Emit winner announcement
  async emitBidWinner(auctionId: string, winnerData: any) {
    await this.notificationsService.createWinnerNotification(
      auctionId,
      winnerData.winnerId,
      winnerData.carTitle,
      winnerData.winningAmount
    );

    const roomName = `auction-${auctionId}`;
    const notificationData = {
      type: 'bidWinner',
      auctionId,
      winnerId: winnerData.winnerId,
      winnerName: winnerData.winnerName,
      winningAmount: winnerData.winningAmount,
      carTitle: winnerData.carTitle,
      timestamp: new Date(),
      title: '🏆 We Have a Winner!',
      message: `${winnerData.carTitle} won for $${winnerData.winningAmount.toLocaleString()}`
    };

    this.server.to(roomName).emit('bidWinner', notificationData);

    const winnerSocketId = this.userSockets.get(winnerData.winnerId);
    if (winnerSocketId) {
      this.server.to(winnerSocketId).emit('personalNotification', {
        ...notificationData,
        title: '🏆 Congratulations! You Won!',
        message: `You won ${winnerData.carTitle} for $${winnerData.winningAmount.toLocaleString()}`,
        isPersonal: true
      });
    }

    this.server.emit('globalNotification', notificationData);
    this.logger.log(`Emitted bidWinner for auction ${auctionId}`);
  }

  // 🔔 Emit payment reminder
  async emitPaymentReminder(userId: string, auctionId: string, carTitle: string, amount: number) {
    const socketId = this.userSockets.get(userId);
    const notificationData = {
      type: 'paymentReminder',
      title: '💳 Payment Reminder',
      message: `Please complete payment for ${carTitle} - $${amount.toLocaleString()}`,
      auctionId,
      timestamp: new Date()
    };

    if (socketId) this.server.to(socketId).emit('personalNotification', notificationData);
    this.logger.log(`Emitted payment reminder to user ${userId}`);
  }

  // 🔔 Emit shipping update (✅ normalized for enum)
  async emitShippingUpdate(userId: string, auctionId: string, status: string, carTitle: string) {
    const socketId = this.userSockets.get(userId);

    // Normalize status to match enum values in Payment schema
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, '_'); // "Ready for Shipping" -> "ready_for_shipping"

    const statusMessages = {
      ready_for_shipping: '📦 Your car is ready for shipping',
      in_transit: '🚛 Your car is in transit',
      delivered: '✅ Your car has been delivered'
    };

    const notificationData = {
      type: 'shippingUpdate',
      title: '🚚 Shipping Update',
      message: `${statusMessages[normalizedStatus] || status} - ${carTitle}`,
      auctionId,
      status: normalizedStatus,
      timestamp: new Date()
    };

    if (socketId) {
      this.server.to(socketId).emit('personalNotification', notificationData);
      this.server.to(socketId).emit('shippingUpdate', notificationData);
    }

    this.logger.log(`Emitted shipping update to user ${userId}: ${normalizedStatus}`);
  }

  // 🔔 Send personal notification to specific user
  async sendPersonalNotification(userId: string, notification: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('personalNotification', {
        ...notification,
        timestamp: new Date(),
        isPersonal: true
      });
    }
    this.logger.log(`Sent personal notification to user ${userId}`);
  }
}
