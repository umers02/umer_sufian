import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LoyaltyHistoryDocument = LoyaltyHistory & Document;

@Schema({ timestamps: true })
export class LoyaltyHistory {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  points: number;

  @Prop({ required: true })
  type: 'earned' | 'spent';

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Order' })
  order?: Types.ObjectId;
}

export const LoyaltyHistorySchema = SchemaFactory.createForClass(LoyaltyHistory);