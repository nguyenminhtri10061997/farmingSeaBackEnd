import { Args, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { User as UserGraphql } from '../../graphql.schema';
import { VendorService } from './vendor.service';

@Resolver()
export class VendorResolver {
  constructor(private readonly vendorService: VendorService) {}

  @Query()
  async vendors(
  ): Promise<UserGraphql[]> {
    return this.vendorService.findAll();
  }

  @Query()
  async vendor(
    @Args() args
  ): Promise<UserGraphql> {
    const { id } = args
    return this.vendorService.findOneById(id);
  }

  @Mutation()
  async createVendor(
    @Context() context,
    @Args() args
  ): Promise<UserGraphql> {
    return this.vendorService.createOne(args, context);
  }

  @Mutation()
  async updateVendor(
    @Context() context,
    @Args() args
  ): Promise<UserGraphql> {
    return this.vendorService.updateOne(args, context);
  }

  @Mutation()
  async deleteVendors(
    @Context() context,
    @Args() args
  ): Promise<boolean> {
    return this.vendorService.deletes(args, context);
  }
}