import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyResolver } from './company.resolver';
import { CompanyService } from './company.service';

import { Company, CompanySchema } from 'src/schemas/company.schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }])],
  providers: [CompanyService, CompanyResolver],
  exports: [
    CompanyModule,
    CompanyService
  ]
})
export class CompanyModule {}