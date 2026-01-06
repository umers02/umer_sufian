import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './entities/notification.entity';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationType } from '../common/enums/notification-type.enum';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async sendSaleNotification(sale: any): Promise<void> {
    const notification = {
      title: 'New Sale Started!',
      message: `${sale.name} - ${sale.discountPercentage}% off!`,
      type: NotificationType.SALE_STARTED,
      data: { saleId: sale._id },
    };

    // Broadcast to all connected users
    this.notificationsGateway.broadcastNotification(notification);

    // Save to database for all users (you might want to optimize this)
    // For now, we'll just broadcast via WebSocket
  }

  async sendOrderConfirmation(userId: string, orderId: string): Promise<void> {
    const notification = new this.notificationModel({
      user: userId,
      title: 'Order Confirmed',
      message: 'Your order has been confirmed and is being processed.',
      type: NotificationType.ORDER_CONFIRMED,
      data: { orderId },
    });

    await notification.save();

    // Send real-time notification
    this.notificationsGateway.sendNotificationToUser(userId, {
      title: notification.title,
      message: notification.message,
      type: notification.type,
      data: notification.data,
    });
  }

  async sendPointsEarned(userId: string, points: number): Promise<void> {
    const notification = new this.notificationModel({
      user: userId,
      title: 'Points Earned!',
      message: `You earned ${points} loyalty points!`,
      type: NotificationType.POINTS_EARNED,
      data: { points },
    });

    await notification.save();

    // Send real-time notification
    this.notificationsGateway.sendNotificationToUser(userId, {
      title: notification.title,
      message: notification.message,
      type: notification.type,
      data: notification.data,
    });
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(notificationId: string): Promise<Notification | null> {
    return this.notificationModel
      .findByIdAndUpdate(notificationId, { isRead: true }, { new: true })
      .exec();
  }
}