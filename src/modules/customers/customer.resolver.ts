import { Args, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { User as UserGraphql } from '../../graphql.schema';
import { CustomerService } from './customer.service';

@Resolver()
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query()
  async customers(
  ): Promise<UserGraphql[]> {
    return this.customerService.findAll();
  }

  @Query()
  async customer(
    @Args() args
  ): Promise<UserGraphql> {
    const { id } = args
    return this.customerService.findOneById(id);
  }

  @Mutation()
  async createCustomer(
    @Context() context,
    @Args() args
  ): Promise<UserGraphql> {
    return this.customerService.createOne(args, context);
  }

  @Mutation()
  async updateCustomer(
    @Context() context,
    @Args() args
  ): Promise<UserGraphql> {
    return this.customerService.updateOne(args, context);
  }

  @Mutation()
  async deleteCustomers(
    @Context() context,
    @Args() args
  ): Promise<boolean> {
    return this.customerService.deletes(args, context);
  }
}