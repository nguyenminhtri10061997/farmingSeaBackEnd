import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockResolver } from './stock.resolver';
import { StockService } from './stock.service';

import { Stock, StockSchema } from 'src/schemas/stock.schema';
import { StockModelModule } from '../stockModels/stockModel.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stock.name, schema: StockSchema }]),
    StockModelModule
  ],
  providers: [StockService, StockResolver],
  exports: [StockModule, StockService]
})
export class StockModule {}