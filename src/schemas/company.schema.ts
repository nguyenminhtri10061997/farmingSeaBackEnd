import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompanyDocument = Company & Document;

@Schema()
export class Company {
  @Prop()
  _id: string;

  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  unsignName: string

  @Prop()
  address: string;
  
  @Prop()
  mobile: string;

  @Prop()
  isActive: Boolean;

  @Prop()
  createdAt: number;

  @Prop()
  indexImportDocument: number;

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

export const CompanySchema = SchemaFactory.createForClass(Company);