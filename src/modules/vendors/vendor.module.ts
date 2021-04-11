import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorResolver } from './vendor.resolver';
import { VendorService } from './vendor.service';

import { Vendor, VendorSchema } from 'src/schemas/vendor.schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: Vendor.name, schema: VendorSchema }])],
  providers: [VendorService, VendorResolver],
})
export class VendorModule {}