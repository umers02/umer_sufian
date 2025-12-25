import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Reply extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Review', required: true })
  reviewId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  content: string; // Rich text content from editor

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  mentions: Types.ObjectId[]; // Users mentioned in reply

  @Prop({ default: 0 })
  likes: number;

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  likedBy: Types.ObjectId[];
}

export const ReplySchema = SchemaFactory.createForClass(Reply);