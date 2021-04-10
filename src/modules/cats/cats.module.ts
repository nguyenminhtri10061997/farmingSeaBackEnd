import { Module } from '@nestjs/common';
// import { CatOwnerResolver } from './cat-owner.resolver';
import { CatsResolver } from './cats.resolver';
import { CatsService } from './cats.service';

@Module({
  imports: [],
  providers: [CatsService, CatsResolver],
})
export class CatsModule {}