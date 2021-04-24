import { Args, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { StockService } from './stock.service';
import { StockModelService } from '../stockModels/stockModel.service'

@Resolver('Stock')
export class StockResolver {
  constructor(
    private readonly stockService: StockService,
    private readonly stockModelService: StockModelService
  ) {}
  
  @Query()
  async stocks(
    @Args() args
  ): Promise<any> {
    const { idSourceCompany } = args
    return this.stockService.findAllByCondition({
      count: { $gt: 0 },
      idCompany: idSourceCompany
    });
  }

  @ResolveField()
  async stockModel(@Parent() sTransaction) {
    const { idStockModel } = sTransaction
    return await this.stockModelService.findOneByCondition({
      _id: idStockModel
    })
  }
}