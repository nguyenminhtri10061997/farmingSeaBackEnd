import { Args, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { User as UserGraphql } from '../../graphql.schema';
import { UsersService } from './users.service';

@Resolver('user')
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query()
  async users(
    @Context() context
  ): Promise<UserGraphql[]> {
    return this.userService.findAll();
  }
}