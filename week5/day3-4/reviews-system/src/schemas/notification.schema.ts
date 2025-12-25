import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum NotificationType {
  NEW_REVIEW = 'new_review',
  NEW_REPLY = 'new_reply',
  REVIEW_LIKED = 'review_liked',
  REPLY_LIKED = 'reply_liked',
  MENTION = 'mention',
  ADMIN_ACTION = 'admin_action',
  PRODUCT_UPDATE = 'product_update'
}

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Object })
  data: any; // Additional data like productId, reviewId, etc.

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);