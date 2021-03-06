import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StockModelDocument = StockModel & Document;

@Schema()
export class StockModel {
  @Prop()
  _id: string;

  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  unsignName: string

  @Prop(raw({
    unit: { type: [String] },
    factor: { type: [Number] },
    realFactor: { type: [Number] },
    buyPrice: { type: Number },
    costPrice: { type: Number }
  }))
  detail: Record<string, any>;

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

export const StockModelSchema = SchemaFactory.createForClass(StockModel);