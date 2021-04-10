import { Args, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { User as UserGraphql } from '../../graphql.schema';
import { MeService } from './me.service';

@Resolver()
export class MeResolver {
  constructor(private readonly meService: MeService) {}

  @Query()
  async getMe(
    @Context() context
  ): Promise<UserGraphql> {
    return this.meService.getMe(context);
  }
}