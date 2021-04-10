import { Module } from '@nestjs/common';
// import { CatOwnerResolver } from './cat-owner.resolver';
import { MeResolver } from './me.resolver';
import { MeService } from './me.service';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [MeService, MeResolver],
})
export class MeModule {}