import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ 
    required: true,
    enum: ['auctionStart', 'newBid', 'bidWinner', 'auctionEnd', 'paymentReminder', 'shippingUpdate']
  })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId?: Types.ObjectId; // target user (if personal notification)

  @Prop({ type: Types.ObjectId, ref: 'Auction', required: false })
  auctionId?: Types.ObjectId; // related auction

  @Prop({ type: Types.ObjectId, ref: 'Car', required: false })
  carId?: Types.ObjectId; // related car

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: 'medium', enum: ['low', 'medium', 'high'] })
  priority: string;

  @Prop({ type: Object, required: false })
  metadata?: Record<string, any>; // additional data like bid amount, winner info, etc.

  @Prop({ default: false })
  isGlobal: boolean; // true for notifications sent to all users
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Add indexes for better performance
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ auctionId: 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ isRead: 1 });
