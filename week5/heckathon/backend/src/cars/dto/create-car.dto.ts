import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateCarDto {
  @IsOptional()
  @IsMongoId({ message: 'Invalid seller ID format' })
  sellerId?: Types.ObjectId;

  @IsNotEmpty({ message: 'Car title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsNotEmpty({ message: 'Make is required' })
  @IsString({ message: 'Make must be a string' })
  make: string;

  @IsNotEmpty({ message: 'Model is required' })
  @IsString({ message: 'Model must be a string' })
  model: string;

  @IsNotEmpty({ message: 'Year is required' })
  @IsNumber({}, { message: 'Year must be a number' })
  @Min(1900, { message: 'Year must be after 1900' })
  @Transform(({ value }) => parseInt(value))
  year: number;

  @IsNotEmpty({ message: 'Body type is required' })
  @IsEnum(['sedan', 'sports', 'hatchback', 'convertible', 'suv', 'coupe'], {
    message: 'Body type must be one of: sedan, sports, hatchback, convertible, suv, coupe'
  })
  bodyType: string;

  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  category?: string;

  @IsOptional()
  @IsArray({ message: 'Photos must be an array' })
  @IsString({ each: true, message: 'Each photo must be a string' })
  photos?: string[];

  @IsNotEmpty({ message: 'Starting price is required' })
  @IsNumber({}, { message: 'Starting price must be a number' })
  @Min(0, { message: 'Starting price must be positive' })
  @Transform(({ value }) => parseFloat(value))
  startingPrice: number;

  @IsOptional()
  @IsNumber({}, { message: 'Current price must be a number' })
  @Min(0, { message: 'Current price must be positive' })
  @Transform(({ value }) => parseFloat(value))
  currentPrice?: number;

  @IsOptional()
  @IsArray({ message: 'Bids must be an array' })
  @IsMongoId({ each: true, message: 'Each bid ID must be valid' })
  bids?: Types.ObjectId[];

  @IsOptional()
  @IsBoolean({ message: 'Completed status must be boolean' })
  isCompleted?: boolean;

  @IsNotEmpty({ message: 'Start time is required' })
  @IsDateString({}, { message: 'Start time must be a valid date' })
  startTime: Date;

  @IsNotEmpty({ message: 'End time is required' })
  @IsDateString({}, { message: 'End time must be a valid date' })
  endTime: Date;
}
