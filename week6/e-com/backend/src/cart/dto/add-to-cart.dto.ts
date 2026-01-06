import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsBoolean()
  usePoints?: boolean;
}