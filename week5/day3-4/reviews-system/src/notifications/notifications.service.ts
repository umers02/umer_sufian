import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationType } from '../schemas/notification.schema';
import { Product } from '../schemas/product.schema';
import { User } from '../schemas/user.schema';
import { Review } from '../schemas/review.schema';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async notifyNewReview(review: any) {
    try {
      // Get product details
      const product = await this.productModel.findById(review.productId);
      const user = await this.userModel.findById(review.userId);
      
      // Broadcast to all users
      const notification = {
        type: NotificationType.NEW_REVIEW,
        title: 'New Review Added',
        message: `${user?.name || 'Someone'} added a review for ${product?.name || 'a product'}`,
        data: { 
          productId: review.productId, 
          reviewId: review._id,
          productName: product?.name,
          reviewerName: user?.name
        },
      };

      this.notificationsGateway.broadcastNotification(notification);
    } catch (error) {
      console.error('Error in notifyNewReview:', error);
    }
  }

  async notifyNewReply(review: any, reply: any) {
    const notification = new this.notificationModel({
      userId: review.userId._id,
      type: NotificationType.NEW_REPLY,
      title: 'New Reply to Your Review',
      message: `${reply.userId.name} replied to your review`,
      data: { reviewId: review._id, replyId: reply._id },
    });

    await notification.save();
    this.notificationsGateway.sendToUser(review.userId._id.toString(), notification);
  }

  async notifyReviewLiked(review: any, likerUserId: string) {
    const notification = new this.notificationModel({
      userId: review.userId,
      type: NotificationType.REVIEW_LIKED,
      title: 'Review Liked',
      message: 'Someone liked your review',
      data: { reviewId: review._id, likerUserId },
    });

    await notification.save();
    this.notificationsGateway.sendToUser(review.userId.toString(), notification);
  }

  async notifyReplyLiked(reply: any, likerUserId: string) {
    const notification = new this.notificationModel({
      userId: reply.userId,
      type: NotificationType.REPLY_LIKED,
      title: 'Reply Liked',
      message: 'Someone liked your reply',
      data: { replyId: reply._id, likerUserId },
    });

    await notification.save();
    this.notificationsGateway.sendToUser(reply.userId.toString(), notification);
  }

  async notifyMentions(mentionedUserIds: string[], type: 'review' | 'reply', contentId: string, mentionerUserId: string) {
    for (const userId of mentionedUserIds) {
      if (userId !== mentionerUserId) {
        const notification = new this.notificationModel({
          userId,
          type: NotificationType.MENTION,
          title: 'You were mentioned',
          message: `You were mentioned in a ${type}`,
          data: { contentId, type, mentionerUserId },
        });

        await notification.save();
        this.notificationsGateway.sendToUser(userId, notification);
      }
    }
  }

  async getUserNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const notifications = await this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await this.notificationModel.countDocuments({ userId });
    const unreadCount = await this.notificationModel.countDocuments({ userId, isRead: false });

    return {
      notifications,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      unreadCount,
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.notificationModel.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );
  }

  async markAllAsRead(userId: string) {
    return this.notificationModel.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
  }

  async notifyAdminAction(userId: string, action: string, message: string) {
    const notification = new this.notificationModel({
      userId,
      type: NotificationType.ADMIN_ACTION,
      title: 'Admin Action',
      message,
      data: { action },
    });

    await notification.save();
    this.notificationsGateway.sendToUser(userId, notification);
  }

  async notifyProductUpdate(productId: string, updateType: string, message: string) {
    try {
      // Find users who have reviewed this product
      const reviews = await this.reviewModel.find({ productId }).populate('userId');
      const userIds = [...new Set(reviews.map(review => review.userId._id.toString()))];
      
      for (const userId of userIds) {
        const notification = new this.notificationModel({
          userId,
          type: NotificationType.PRODUCT_UPDATE,
          title: 'Product Update',
          message,
          data: { productId, updateType },
        });

        await notification.save();
        this.notificationsGateway.sendToUser(userId, notification);
      }
    } catch (error) {
      console.error('Error in notifyProductUpdate:', error);
    }
  }
}