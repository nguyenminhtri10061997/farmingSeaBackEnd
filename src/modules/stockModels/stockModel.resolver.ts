import { Args, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { User as UserGraphql } from '../../graphql.schema';
import { StockModelService } from './stockModel.service';

@Resolver()
export class StockModelResolver {
  constructor(private readonly stockModelService: StockModelService) {}

  @Query()
  async stockModels(
  ): Promise<UserGraphql[]> {
    return this.stockModelService.findAll();
  }

  @Query()
  async stockModel(
    @Args() args
  ): Promise<UserGraphql> {
    const { id } = args
    return this.stockModelService.findOneById(id);
  }

  @Mutation()
  async createStockModel(
    @Context() context,
    @Args() args
  ): Promise<UserGraphql> {
    return this.stockModelService.createOne(args, context);
  }

  @Mutation()
  async updateStockModel(
    @Context() context,
    @Args() args
  ): Promise<UserGraphql> {
    return this.stockModelService.updateOne(args, context);
  }

  @Mutation()
  async deleteStockModels(
    @Context() context,
    @Args() args
  ): Promise<boolean> {
    return this.stockModelService.deletes(args, context);
  }
}