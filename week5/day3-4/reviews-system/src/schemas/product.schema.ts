import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  basePrice: number;

  @Prop()
  category: string;

  @Prop([String])
  images: string[];

  @Prop({ required: true })
  flavor: string;

  @Prop({
    type: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 }
    },
    default: { average: 0, count: 0 }
  })
  rating: {
    average: number;
    count: number;
  };

  @Prop({ default: true })
  isActive: boolean;

  @Prop([String])
  tags: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);