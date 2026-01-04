import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(data: Partial<Notification>): Promise<Notification> {
    const notification = new this.notificationModel({
      ...data,
      createdAt: new Date(),
    });
    return notification.save();
  }

  // Helper to safely convert to ObjectId
  private toObjectId(id: string): Types.ObjectId {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ObjectId: ${id}`);
    }
    return new Types.ObjectId(id);
  }

  // Create notification for specific user
  async createForUser(userId: string, data: Partial<Notification>): Promise<Notification> {
    return this.create({
      ...data,
      userId: this.toObjectId(userId),
      isGlobal: false,
    });
  }

  // Create global notification
  async createGlobal(data: Partial<Notification>): Promise<Notification> {
    return this.create({ ...data, isGlobal: true });
  }

  // Auction notifications
  async createAuctionStartNotification(auctionId: string, carTitle: string, startingPrice: number): Promise<Notification> {
    return this.createGlobal({
      type: 'auctionStart',
      title: '🚀 New Auction Started!',
      message: `${carTitle} is now live for bidding`,
      auctionId: this.toObjectId(auctionId),
      priority: 'high',
      metadata: { carTitle, startingPrice },
    });
  }

  async createNewBidNotification(auctionId: string, bidderId: string, amount: number, carTitle: string): Promise<Notification> {
    return this.create({
      type: 'newBid',
      title: '💰 New Bid Placed',
      message: `New bid of $${amount.toLocaleString()} placed on ${carTitle}`,
      auctionId: this.toObjectId(auctionId),
      priority: 'medium',
      metadata: { bidderId, amount, carTitle },
    });
  }

  async createAuctionEndNotification(auctionId: string, carTitle: string, finalPrice: number): Promise<Notification> {
    return this.createGlobal({
      type: 'auctionEnd',
      title: '🏁 Auction Ended',
      message: `${carTitle} auction has ended`,
      auctionId: this.toObjectId(auctionId),
      priority: 'high',
      metadata: { carTitle, finalPrice },
    });
  }

  async createWinnerNotification(auctionId: string, winnerId: string, carTitle: string, winningAmount: number): Promise<Notification> {
    // Personal notification
    await this.createForUser(winnerId, {
      type: 'bidWinner',
      title: '🏆 Congratulations! You Won!',
      message: `You won ${carTitle} for $${winningAmount.toLocaleString()}`,
      auctionId: this.toObjectId(auctionId),
      priority: 'high',
      metadata: { carTitle, winningAmount, isWinner: true },
    });

    // Global notification
    return this.createGlobal({
      type: 'bidWinner',
      title: '🏆 We Have a Winner!',
      message: `${carTitle} won for $${winningAmount.toLocaleString()}`,
      auctionId: this.toObjectId(auctionId),
      priority: 'high',
      metadata: { winnerId, carTitle, winningAmount },
    });
  }

  async findByUser(userId: string, limit = 20): Promise<Notification[]> {
    return this.notificationModel
      .find({
        $or: [
          { userId: this.toObjectId(userId) },
          { isGlobal: true }
        ]
      })
      .populate('auctionId')
      .populate('carId')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      $or: [
        { userId: this.toObjectId(userId) },
        { isGlobal: true }
      ],
      isRead: false
    });
  }

  async markAsRead(id: string, userId?: string) {
    const query: any = { _id: this.toObjectId(id) };
    if (userId) {
      query.$or = [
        { userId: this.toObjectId(userId) },
        { isGlobal: true }
      ];
    }
    return this.notificationModel.findOneAndUpdate(query, { isRead: true }, { new: true });
  }

  async markAllAsRead(userId: string) {
    return this.notificationModel.updateMany(
      { $or: [{ userId: this.toObjectId(userId) }, { isGlobal: true }], isRead: false },
      { isRead: true }
    );
  }

  async deleteNotification(id: string, userId?: string) {
    const query: any = { _id: this.toObjectId(id) };
    if (userId) {
      query.$or = [
        { userId: this.toObjectId(userId) },
        { isGlobal: true }
      ];
    }
    return this.notificationModel.findOneAndDelete(query);
  }

  async cleanupOldNotifications() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this.notificationModel.deleteMany({ createdAt: { $lt: thirtyDaysAgo }, isRead: true });
  }
}
