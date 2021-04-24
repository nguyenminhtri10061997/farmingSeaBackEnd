import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentResolver } from './document.resolver';
import { DocumentService } from './document.service';
import { CommonServiceModule } from 'src/commons/commonModule';

import { Document, DocumentSchema } from 'src/schemas/document.schema';
import { VendorModule } from '../vendors/vendor.module';
import { STransactionModule } from '../sTransactions/sTransaction.module';
import { CompanyModule } from '../companies/company.module';
import { StockModule } from '../stocks/stock.module';
import { StockModelModule } from '../stockModels/stockModel.module';
import { CustomerModule } from '../customers/customer.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Document.name, schema: DocumentSchema }]),
    CommonServiceModule,
    VendorModule,
    STransactionModule,
    CompanyModule,
    StockModule,
    StockModelModule,
    CustomerModule
  ],
  providers: [DocumentService, DocumentResolver],
  exports: [DocumentModule, DocumentService]
})
export class DocumentModule {}