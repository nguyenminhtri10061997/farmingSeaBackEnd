import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockModelResolver } from './stockModel.resolver';
import { StockModelService } from './stockModel.service';

import { StockModel, StockModelSchema } from 'src/schemas/stockModel.schema';
import { StockModule } from '../stocks/stock.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: StockModel.name, schema: StockModelSchema }]),
    forwardRef(() => StockModule),
  ],
  providers: [StockModelService, StockModelResolver],
  exports: [
    StockModelModule,
    StockModelService
  ]
})
export class StockModelModule {}