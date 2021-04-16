import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonService } from 'src/commons/commonService';

import { Company, CompanySchema } from 'src/schemas/company.schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }])],
  providers: [CommonService, CommonServiceModule],
  exports: [CommonService]
})
export class CommonServiceModule {}