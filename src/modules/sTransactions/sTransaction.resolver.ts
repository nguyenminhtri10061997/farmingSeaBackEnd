import { Args, Mutation, Query, Resolver, Context, ResolveField, Parent } from '@nestjs/graphql';
import { STransaction as STransactionGraphql } from '../../graphql.schema';
import { STransactionService } from './sTransaction.service';
import { StockModelService } from '../stockModels/stockModel.service'
import { DocumentService } from '../documents/document.service'
import { EnumTypeDocument } from '../../schemas/interface'
import { v4 } from 'uuid';
import * as moment from 'moment';

@Resolver('STransaction')
export class STransactionResolver {
  constructor(
    private readonly sTransactionService: STransactionService,
    private readonly stockModelService: StockModelService,
    private readonly documentService: DocumentService,
  ) {}

  @Query()
  async getSTransactionByIdDocument(
  ): Promise<STransactionGraphql[]> {
    return this.sTransactionService.findAll();
  }

  @Mutation()
  async createSTransaction(
    @Context() context,
    @Args() args
  ): Promise<STransactionGraphql> {
    const { info } = args
    const { currentUser } = context
    const stockModel = await this.stockModelService.findOneById(info.idStockModel)
    const document = await this.documentService.findOneById(info.idDocument)
    const newData = {
      _id: v4(),
      ...info,
      count: info.quantity?.reduce((t, i, idx) => t + ((i || 0) * (stockModel.detail.realFactor[idx] || 0)), 0) || 0,
      ...(document.type === EnumTypeDocument.SALE ? { costPrice: stockModel.detail.costPrice || 0 } : {}),
      isActive: true,
      createdAt: moment().valueOf(),
      createdBy: {
        _id: currentUser._id,
        username: currentUser.username
      }
    }
    return await this.sTransactionService.createOne(newData);
  }

  @Mutation()
  async updateSTransaction(
    @Context() context,
    @Args() args
  ): Promise<STransactionGraphql> {
    const { id, info } = args
    const stran = await this.sTransactionService.findOneById(id)
    const stockModel = await this.stockModelService.findOneById(stran.idStockModel)
    return this.sTransactionService.updateOne({
      _id: id
    }, {
      ...info,
      count: info.quantity?.reduce((t, i, idx) => t + ((i || 0) * (stockModel.detail.realFactor[idx] || 0)), 0) || 0,
    }, context);
  }

  @Mutation()
  async deleteSTransactions(
    @Context() context,
    @Args() args
  ): Promise<boolean> {
    return this.sTransactionService.deletes(args, context);
  }
  
  @ResolveField()
  async stockModel(@Parent() sTransaction) {
    const { idStockModel } = sTransaction
    return await this.stockModelService.findOneByCondition({
      _id: idStockModel
    })
  }
}