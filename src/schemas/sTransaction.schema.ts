import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Number } from 'mongoose';

export type STransactionDocument = STransaction & Document;

@Schema({ collection: 'sTransactions' })
export class STransaction {
  @Prop()
  _id: string;

  @Prop()
  idDocument: string

  @Prop()
  idStockModel: string

  @Prop()
  idStock: string

  @Prop()
  quantity: number[]

  @Prop()
  buyPrice: number[]

  @Prop()
  salePrice: number[]

  @Prop()
  costPrice: number

  @Prop()
  count: number

  @Prop()
  isActive: boolean;

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

export const STransactionSchema = SchemaFactory.createForClass(STransaction);