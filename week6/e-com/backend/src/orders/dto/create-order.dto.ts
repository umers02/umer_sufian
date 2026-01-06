import { IsString, IsOptional, IsArray, IsNumber, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  product: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsString()
  size: string;

  @IsString()
  color: string;
}

class ShippingAddressDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zipCode: string;

  @IsString()
  country: string;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @IsString()
  paymentMethod: string;

  @IsNumber()
  subtotal: number;

  @IsNumber()
  shipping: number;

  @IsNumber()
  tax: number;

  @IsNumber()
  total: number;

  @IsOptional()
  @IsNumber()
  pointsUsed?: number;
}