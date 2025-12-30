import { IsNotEmpty, IsNumber, IsMongoId, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateBidDto {
  @IsNotEmpty({ message: 'Auction ID is required' })
  @IsMongoId({ message: 'Invalid auction ID format' })
  auctionId: Types.ObjectId;

  @IsNotEmpty({ message: 'Bidder ID is required' })
  @IsMongoId({ message: 'Invalid bidder ID format' })
  bidderId: Types.ObjectId;

  @IsNotEmpty({ message: 'Bid amount is required' })
  @IsNumber({}, { message: 'Bid amount must be a number' })
  @Min(1, { message: 'Bid amount must be greater than 0' })
  @Transform(({ value }) => parseFloat(value))
  amount: number;
}