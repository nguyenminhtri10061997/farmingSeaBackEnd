import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerResolver } from './customer.resolver';
import { CustomerService } from './customer.service';

import { Customer, CustomerSchema } from 'src/schemas/customer.schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }])],
  providers: [CustomerService, CustomerResolver],
  exports: [CustomerModule, CustomerService]
})
export class CustomerModule {}