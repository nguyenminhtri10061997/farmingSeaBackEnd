import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentResolver } from './document.resolver';
import { DocumentService } from './document.service';
import { CommonServiceModule } from 'src/commons/commonModule';

import { Document, DocumentSchema } from 'src/schemas/document.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Document.name, schema: DocumentSchema }]),
    CommonServiceModule
  ],
  providers: [DocumentService, DocumentResolver, DocumentModule],
  exports: [DocumentModule]
})
export class DocumentModule {}