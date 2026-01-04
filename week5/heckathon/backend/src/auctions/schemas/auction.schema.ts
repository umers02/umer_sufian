import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema'; // User schema import

export type AuctionDocument = Auction & Document;

@Schema({
  timestamps: true,
  collection: 'auctions',
})
export class Auction {
  @Prop({ type: Types.ObjectId, ref: 'Car', required: true })
  car: Types.ObjectId;

  @Prop({ required: true, type: Date })
  startTime: Date;

  @Prop({ required: true, type: Date })
  endTime: Date;

  @Prop({
    type: String,
    default: 'upcoming',
    enum: ['upcoming', 'live', 'ended', 'completed'],
  })
  status: string;

  @Prop({ type: Number, default: 0 })
  currentPrice: number;

  // Winning bid reference (optional)
  @Prop({ type: Types.ObjectId, ref: 'Bid', default: null })
  winningBid: Types.ObjectId | null;

  // 🔹 New: Highest bidder (user who placed the winning/current highest bid)
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  highestBidder: Types.ObjectId | User | null;

  // 🔹 New: Bids array (optional, track all bid ObjectIds)
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Bid' }], default: [] })
  bids: Types.ObjectId[];
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);
