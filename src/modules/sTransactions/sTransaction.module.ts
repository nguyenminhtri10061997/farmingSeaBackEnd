import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { STransactionResolver } from './sTransaction.resolver';
import { STransactionService } from './sTransaction.service';

import { STransaction, STransactionSchema } from '../../schemas/sTransaction.schema';
import { StockModelModule } from '../stockModels/stockModel.module';
import { DocumentModule } from '../documents/document.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: STransaction.name, schema: STransactionSchema }]),
    StockModelModule,
    forwardRef(() => DocumentModule),
  ],
  providers: [STransactionService, STransactionResolver, STransactionModule],
  exports: [STransactionModule, STransactionService]
})
export class STransactionModule {}