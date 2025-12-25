import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  content: string; // Rich text content from editor

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  mentions: Types.ObjectId[]; // Users mentioned in review

  @Prop({ default: 0 })
  likes: number;

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  likedBy: Types.ObjectId[];

  @Prop({ default: false })
  isModerated: boolean;

  @Prop({ default: false })
  isFlagged: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);