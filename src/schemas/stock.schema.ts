import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StockDocument = Stock & Document;

@Schema({ collection: 'stocks' })
export class Stock {
  @Prop()
  _id: string;

  @Prop()
  idCompany: string;

  @Prop()
  idStockModel: string;

  @Prop()
  quantity: number[];

  @Prop()
  count: number;

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

export const StockSchema = SchemaFactory.createForClass(Stock);