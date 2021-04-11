import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockModelResolver } from './stockModel.resolver';
import { StockModelService } from './stockModel.service';

import { StockModel, StockModelSchema } from 'src/schemas/stockModel.schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: StockModel.name, schema: StockModelSchema }])],
  providers: [StockModelService, StockModelResolver],
})
export class StockModelModule {}