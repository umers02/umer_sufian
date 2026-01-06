import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProductType } from '../../common/enums/product-type.enum';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  salePrice: number;

  @Prop({ default: 0 })
  pointsPrice: number;

  @Prop({ required: true })
  stock: number;

  @Prop([String])
  images: string[];

  @Prop({ type: String, enum: ProductType, default: ProductType.REGULAR })
  type: ProductType;

  @Prop({ default: false })
  isOnSale: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  category: string;

  @Prop()
  brand?: string;

  @Prop()
  sku?: string;

  @Prop([String])
  tags?: string[];

  @Prop({ default: 0 })
  averageRating?: number;

  @Prop({ default: 0 })
  totalReviews?: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);