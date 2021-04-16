import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as DocumentMongoose } from 'mongoose';
import {
  EnumStateDocument,
  EnumTypeDocument
} from './interface'

export type DocumentDocument = Document & DocumentMongoose;

@Schema()
export class Document {
  @Prop()
  _id: string;

  @Prop()
  idSrcVendor: string

  @Prop()
  idDesCompany: string

  @Prop()
  idSrcCompany: string

  @Prop()
  idDesCustomer: string

  @Prop()
  code: String

  @Prop({ type: EnumTypeDocument })
  type: EnumTypeDocument

  @Prop({ type: EnumStateDocument })
  state: EnumStateDocument

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

  @Prop()
  verifiedAt: number;

  @Prop(raw({
    _id: { type: String },
    username: { type: String }
  }))
  verifiedBy: Record<string, any>;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);