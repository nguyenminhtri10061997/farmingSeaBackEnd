import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema()
export class Customer {
  @Prop()
  _id: string;

  @Prop()
  code: string;

  @Prop()
  fullName: string;

  @Prop()
  unsignFullName: string

  @Prop()
  address: string;
  
  @Prop()
  mobile: string;

  @Prop()
  isActive: Boolean;

  @Prop()
  createdAt: number;

  @Prop(raw({
    _id: { type: String },
    username: { type: String }
  }))
  createdBy: Record<string, any>;

  @Prop()
  updatedAt: number;

  @Prop(raw({
    _id: { type: String },
    username: { type: String }
  }))
  updatedBy: Record<string, any>;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);