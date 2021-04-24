import { Args, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-errors';
import { User as UserGraphql } from '../../graphql.schema';
import { StockModelService } from './stockModel.service';
import { v4 } from 'uuid';
import { toUnsignedName } from 'src/commons/commonFunc';
import * as moment from 'moment';
import { StockService } from '../stocks/stock.service';

@Resolver()
export class StockModelResolver {
  constructor(
    private readonly stockModelService: StockModelService,
    private readonly stockService: StockService,
  ) {}

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
    const { info } = args
    const { currentUser } = context
    const dataExist = await this.stockModelService.findOneByCondition({
      code: info.code,
      isActive: true
    })
    if (dataExist) {
      throw new ApolloError('code exist')
    }
    const realFactor = info.detail.factor.map((i, idx) => {
      return info.detail.factor.slice(idx + 1).reduce((t, item) => t * item, 1)
    })
    info.detail.realFactor = realFactor
    const newData = {
      _id: v4(),
      ...info,
      unsignName: toUnsignedName(info.name),
      isActive: true,
      createdAt: moment().valueOf(),
      createdBy: {
        _id: currentUser._id,
        username: currentUser.username
      }
    }
    return this.stockModelService.createOne(newData);
  }

  @Mutation()
  async updateStockModel(
    @Context() context,
    @Args() args
  ): Promise<UserGraphql> {
    const { id, info } = args
    const { currentUser } = context
    if (info.code !== info.oldCode) {
      const dataExist = await this.stockModelService.findOneByCondition({
        code: info.code,
        isActive: true
      })
      if (dataExist) {
        throw new ApolloError('code exist')
      }
    }
    const realFactor = info.detail.factor.map((i, idx) => {
      return info.detail.factor.slice(idx + 1).reduce((t, item) => t * item, 1)
    })
    info.detail.realFactor = realFactor
    return this.stockModelService.updateOne({
      _id: id
    }, {
      ...info,
      unsignName: toUnsignedName(info.name),
      updatedAt: moment().valueOf(),
      updatedBy: {
        _id: currentUser._id,
        username: currentUser.username
      }
    });
  }

  @Mutation()
  async deleteStockModels(
    @Context() context,
    @Args() args
  ): Promise<boolean> {
    return this.stockModelService.deletes(args, context);
  }

  @Query()
  async searchStockModels(
    @Args() args
  ) {
    try {
      const {
        searchString,
        limit,
        idDefault,
        idCompany
      } = args
      const objOptions: any = {}
    if (limit) {
      objOptions.take = limit
    }
    const stockModels: any = await this.stockModelService.findAllByCondition({
      isActive: true,
      $or: [
        {
          code: { $regex: searchString, $options: 'siu' }
        },
        {
          name: { $regex: searchString, $options: 'siu' }
        },
        {
          unsignedFullName: { $regex: searchString, $options: 'siu' }
        },
      ]
    })
    if (idDefault && !stockModels.find(item => item._id === idDefault)) {
      const dataDefault = await this.stockModelService.findOneById({
        where: {
          _id: idDefault
        }
      })
      if (dataDefault) {
        stockModels.push(dataDefault)
      }
    }
    if (idCompany) {
      const stocks = await this.stockService.findAllByCondition({
        idStockModel: { $in: stockModels.map(i => i._id) }
      })
      // const stocks = []
      const hashByIdStockModelStock = {}
      stocks.forEach(stock => {
        hashByIdStockModelStock[stock.idStockModel] = stock
      })
      stockModels.forEach(stockModel => {
        stockModel.countByStore = hashByIdStockModelStock[stockModel._id].count || 0
      })
      console.log(hashByIdStockModelStock)
      return stockModels.filter(stockModel => stockModel.countByStore > 0)
    }
    return stockModels
    } catch (err) {
      throw new ApolloError(err)
    }
  }
}