import { Module } from '@nestjs/common';
// import { CatOwnerResolver } from './cat-owner.resolver';
import { LoginsResolver } from './login.resolver';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UsersService } from '../users/users.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [LoginsResolver, UsersService],
})
export class LoginsModule {}