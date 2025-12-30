import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  mobileNumber: string;

  @Prop()
  profilePicture?: string;

  @Prop()
  nationality?: string;

  @Prop()
  idType?: string;

  @Prop()
  idNumber?: string;

  @Prop()
  country?: string;

  @Prop()
  city?: string;

  @Prop()
  address1?: string;

  @Prop()
  address2?: string;

  @Prop()
  landLineNumber?: string;

  @Prop()
  poBox?: string;

  @Prop()
  trafficInfoType?: string;

  @Prop()
  plateState?: string;

  @Prop()
  trafficFileNumber?: string;

  @Prop()
  plateCode?: string;

  @Prop()
  plateNumber?: string;

  @Prop()
  driverLicenseNumber?: string;

  @Prop()
  issueCity?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
