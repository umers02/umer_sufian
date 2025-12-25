import { IsNotEmpty, IsNumber, Min, Max, IsString, IsArray, IsOptional, IsMongoId } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @Transform(({ value }) => parseInt(value))
  rating: number;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  mentions?: string[];
}

export class CreateReplyDto {
  @IsNotEmpty()
  @IsMongoId()
  reviewId: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  mentions?: string[];
}