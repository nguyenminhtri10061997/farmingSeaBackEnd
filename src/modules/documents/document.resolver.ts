import { Args, Mutation, Query, Resolver, Context, ResolveField, Parent } from '@nestjs/graphql';
import { DocumentService } from './document.service';
import { ApolloError } from 'apollo-server-errors';
import { EnumStateDocument, EnumTypeDocument } from '../../schemas/interface'
import { STransactionService } from '../sTransactions/sTransaction.service';
import { CompanyService } from '../companies/company.service';
import { VendorService } from '../vendors/vendor.service';
import { StockService } from '../stocks/stock.service';
import { StockModelService } from '../stockModels/stockModel.service';
import * as moment from 'moment';
import { v4 } from 'uuid';
import { CommonService } from 'src/commons/commonService'
import { CustomerService } from '../customers/customer.service';

@Resolver('Document')
export class DocumentResolver {
  constructor(
    private readonly documentService: DocumentService,
    private readonly sTransactionService: STransactionService,
    private readonly companyService: CompanyService,
    private readonly vendorService: VendorService,
    private readonly stockService: StockService,
    private readonly stockModelService: StockModelService,
    private readonly commonService: CommonService,
    private readonly customerService: CustomerService,
  ) {}

  @Query()
  async documents(
    @Args() args
  ): Promise<any[]> {
    try {
      const { type, startDate, endDate, idSourceCompany, state } = args
      const objFind: any = {
        type,
        state: { $ne: EnumStateDocument.CANCELED },
        $and: [
          {
            createdAt: { $gte: startDate },
          },
          {
            createdAt: { $lte: endDate }
          }
        ]
      }
      if (type === EnumTypeDocument.IMPORT) {
        objFind.idDesCompany = idSourceCompany
      } else {
        objFind.idSrcCompany = idSourceCompany
      }
      if (state) {
        objFind.state = state
      }
      const dataDoc = await this.documentService.findAllByCondition(objFind, 1)
      return dataDoc
    } catch (err) {
      throw new ApolloError(err)
    }
  }

  @Query()
  async document(
    @Args() args
  ): Promise<any> {
    const { id } = args
    return this.documentService.findOneById(id);
  }

  @Mutation()
  async createDocument(
    @Context() context,
    @Args() args
  ): Promise<any> {
    try {
      const { info } = args
      const { currentUser } = context
      const { code } = await this.commonService.generateCodeAdapterCompany(
        info.idDesCompany,
        'NK',
        'indexImportDocument'
      )
      if (!code) {
        throw new ApolloError('!code')
      }
      const newData = {
        _id: v4(),
        code,
        ...info,
        state: EnumStateDocument.RECEIVED,
        createdAt: moment().valueOf(),
        createdBy: {
          _id: currentUser._id,
          username: currentUser.username
        }
      }
      return this.documentService.createOne(newData);
    } catch (err) {
      throw new ApolloError(err)
    }
  }

  @Mutation()
  async createDocumentSale(
    @Context() context,
    @Args() args
  ): Promise<any> {
    try {
      const { info } = args
      const { currentUser } = context
      const { code } = await this.commonService.generateCodeAdapterCompany(
        info.idSrcCompany,
        'XB',
        'indexSaleDocument'
      )
      if (!code) {
        throw new ApolloError('!code')
      }
      const newData = {
        _id: v4(),
        code,
        ...info,
        state: EnumStateDocument.RECEIVED,
        createdAt: moment().valueOf(),
        createdBy: {
          _id: currentUser._id,
          username: currentUser.username
        }
      }
      return this.documentService.createOne(newData);
    } catch (err) {
      throw new ApolloError(err)
    }
  }

  @ResolveField()
  async srcVendor(@Parent() document) {
    const { idSrcVendor } = document
    return await this.vendorService.findOneById(idSrcVendor)
  }

  @ResolveField()
  async sTransactions(@Parent() document) {
    const { _id } = document
    return await this.sTransactionService.findAllByCondition({
      idDocument: _id,
      isActive: true
    })
  }

  @ResolveField()
  async desCompany(@Parent() document) {
    const { idDesCompany } = document
    return await this.companyService.findOneById(idDesCompany)
  }

  @ResolveField()
  async desCustomer(@Parent() document) {
    const { idDesCustomer } = document
    return await this.customerService.findOneById(idDesCustomer)
  }

  @Mutation()
  async canceledDocument(
    @Context() context,
    @Args() args
  ): Promise<any> {
    try {
      const { id } = args
      const document = await this.documentService.findOneById(id)
      if (document.state !== EnumStateDocument.RECEIVED) {
        throw new ApolloError('document.state !== EnumStateDocument.RECEIVED')
      }
      await this.documentService.updateOneByCondition({ _id: id }, { state: EnumStateDocument.CANCELED}, context)
      return true
    } catch (err) {
      throw new ApolloError(err)
    }
  }

  @Mutation()
  async verifyCompleteDocument(
    @Context() context,
    @Args() args
  ): Promise<any> {
    try {
      const { id } = args
      const { currentUser } = context
      const document = await this.documentService.findOneById(id)
      if (document?.state !== EnumStateDocument.RECEIVED) {
        throw new ApolloError('document.state !== EnumStateDocument.RECEIVED')
      }
      const stransactions = await this.sTransactionService.findAllByCondition({
        idDocument: document._id,
        isActive: true
      })
      const stocks = await this.stockService.findAllByCondition({
        idStockModel: { $in: stransactions.map(i => i.idStockModel) }
      })
      const stockModels = await this.stockModelService.findAllByCondition({
        _id: { $in: stransactions.map(i => i.idStockModel) }
      })

      const hashByIdStockModel = {}
      stockModels.forEach(i => {
        hashByIdStockModel[i._id] = i
      })

      const hashByIdStockModelStock = {}
      stocks.forEach(i => {
        hashByIdStockModelStock[i.idStockModel] = i
      })

      const dataHashByStockModelStran = {}
      let hashByIdStockModelCostPrice = {}
      stransactions.forEach(stran => {
        const stockModel = hashByIdStockModel[stran.idStockModel]
        let totalPriceByUnitStran = 0
        let totalQuanStran = 0
        stran.quantity.forEach((quan, idx) => {
          totalQuanStran += quan * stockModel.detail.realFactor[idx]
          totalPriceByUnitStran += (quan || 0) * (stran.buyPrice[idx] || 0)
        })
        const stock = hashByIdStockModelStock[stran.idStockModel] || {}
        const totalPriceByUnitStock = (stock.count || 0) * (stockModel.detail.costPrice || 0)
        hashByIdStockModelCostPrice[stran.idStockModel] = Math.round((totalPriceByUnitStran + totalPriceByUnitStock) / (totalQuanStran + (stock.count || 0)) * 100) / 100
        dataHashByStockModelStran[stran.idStockModel] = stran
      })
      const arrBulkWriteStockModel = []
      const arrBulkWriteStock = []
      const arrCreateStock = []
      Object.keys(hashByIdStockModelCostPrice).forEach(idStockModel => {
        arrBulkWriteStockModel.push({
					updateOne: {
						filter: { _id: idStockModel },
						update: {
							$set: {
                'detail.costPrice': hashByIdStockModelCostPrice[idStockModel]
							}
						}
					}
				})
        if (!hashByIdStockModelStock[idStockModel]) {
          const stran = dataHashByStockModelStran[idStockModel]
          arrCreateStock.push({
            _id: v4(),
            idStockModel,
            quantity: stran.quantity,
            count: stran.count,
            createdAt: moment().valueOf(),
            createdBy: {
              _id: currentUser._id,
              username: currentUser.username
            }
          })
        } else {
          const stock = hashByIdStockModelStock[idStockModel]
          const stran = dataHashByStockModelStran[idStockModel]
          const stockModel = hashByIdStockModel[idStockModel]
          stran.quantity.forEach((quan, idx) => {
            if (quan) {
              stock.quantity[idx] += quan
            }
          })
          const count = stock.quantity?.reduce((t, i, idx) => {
            return t + (i * stockModel.detail.realFactor[idx])
          }, 0) || 0
          arrBulkWriteStock.push({
            updateOne: {
              filter: { _id: stock._id },
              update: {
                $set: {
                  quantity: stock.quantity,
                  count,
                }
              }
            }
          })
        }
      })

      if (arrBulkWriteStockModel.length) {
        await this.stockModelService.bulkWrite(arrBulkWriteStockModel)
      }
      if (arrBulkWriteStock.length) {
        await this.stockService.bulkWrite(arrBulkWriteStock)
      }
      if (arrCreateStock.length) {
        await this.stockService.insertMany(arrCreateStock)
      }
      await this.documentService.updateOneByCondition({ _id: id }, {
        state: EnumStateDocument.COMPLETED,
        verifiedAt: moment().valueOf(),
        verifiedBy: {
          _id: currentUser._id,
          username: currentUser.username
        }
      }, context)
      return true
    } catch (err) {
      throw new ApolloError(err)
    }
  }

  @Mutation()
  async verifyCompleteDocumentSale(
    @Context() context,
    @Args() args
  ): Promise<any> {
    try {
      const { id } = args
      const { currentUser } = context
      const document = await this.documentService.findOneById(id)
      if (document?.state !== EnumStateDocument.RECEIVED) {
        throw new ApolloError('document.state !== EnumStateDocument.RECEIVED')
      }
      const stransactions = await this.sTransactionService.findAllByCondition({
        idDocument: document._id,
        isActive: true
      })

      const stocks = await this.stockService.findAllByCondition({
        idStockModel: { $in: stransactions.map(i => i.idStockModel) }
      })
      const hashByIdStockModelStock = {}
      stocks.forEach(i => {
        hashByIdStockModelStock[i.idStockModel] = i
      })

      const stockModels = await this.stockModelService.findAllByCondition({
        _id: { $in: stransactions.map(i => i.idStockModel) }
      })
      const hashByIdStockModel = {}
      stockModels.forEach(i => {
        hashByIdStockModel[i._id] = i
      })

      let flag = false
      const arrBulkWriteStock = []
      const arrBulkWriteStran = []
      stransactions.forEach(stran => {
        const stock = hashByIdStockModelStock[stran.idStockModel]
        const stockModel = hashByIdStockModel[stran.idStockModel]

        if (stock.count < stran.count) {
          flag = true
        }
        const countRemainStock = stock.count - stran.count
        let countRemainCaculate = countRemainStock
        const quantityRemainStock = stockModel?.detail?.realFactor?.map(rf => {
          const res = Math.floor(countRemainCaculate / rf)
          countRemainCaculate = countRemainCaculate % rf
          return res
        })
        arrBulkWriteStran.push({
          updateOne: {
            filter: { _id: stran._id },
            update: {
              $set: {
                costPrice: stockModel?.detail?.costPrice || 0
              }
            }
          }
        })
        arrBulkWriteStock.push({
          updateOne: {
            filter: { _id: stock._id },
            update: {
              $set: {
                quantity: quantityRemainStock,
                count: countRemainStock,
              }
            }
          }
        })
      })
      if (flag) {
        throw new ApolloError('count stock')
      }
      if (arrBulkWriteStock.length) {
        await this.stockService.bulkWrite(arrBulkWriteStock)
      }
      await this.documentService.updateOneByCondition({ _id: id }, {
        state: EnumStateDocument.COMPLETED,
        verifiedAt: moment().valueOf(),
        verifiedBy: {
          _id: currentUser._id,
          username: currentUser.username
        }
      }, context)
      return true
    } catch (err) {
      throw new ApolloError(err)
    }
  }

  @Mutation()
  async canceledCompletedDocumentSale(
    @Context() context,
    @Args() args
  ): Promise<any> {
    try {
      const { id } = args
      const { currentUser } = context
      const document = await this.documentService.findOneById(id)
      if (document?.state !== EnumStateDocument.COMPLETED) {
        throw new ApolloError('document.state !== EnumStateDocument.COMPLETED')
      }
      const stransactions = await this.sTransactionService.findAllByCondition({
        idDocument: document._id,
        isActive: true
      })

      const stocks = await this.stockService.findAllByCondition({
        idStockModel: { $in: stransactions.map(i => i.idStockModel) }
      })
      const hashByIdStockModelStock = {}
      stocks.forEach(i => {
        hashByIdStockModelStock[i.idStockModel] = i
      })

      const stockModels = await this.stockModelService.findAllByCondition({
        _id: { $in: stransactions.map(i => i.idStockModel) }
      })
      const hashByIdStockModel = {}
      stockModels.forEach(i => {
        hashByIdStockModel[i._id] = i
      })

      let flag = false
      const arrBulkWriteStock = []
      stransactions.forEach(stran => {
        const stock = hashByIdStockModelStock[stran.idStockModel]
        const stockModel = hashByIdStockModel[stran.idStockModel]

        if (stock.count < stran.count) {
          flag = true
        }
        const countRemainStock = stock.count + stran.count
        let countRemainCaculate = countRemainStock
        const quantityRemainStock = stockModel?.detail?.realFactor?.map(rf => {
          const res = Math.floor(countRemainCaculate / rf)
          countRemainCaculate = countRemainCaculate % rf
          return res
        })
        arrBulkWriteStock.push({
          updateOne: {
            filter: { _id: stock._id },
            update: {
              $set: {
                quantity: quantityRemainStock,
                count: countRemainStock,
              }
            }
          }
        })
      })
      if (flag) {
        throw new ApolloError('count stock')
      }
      if (arrBulkWriteStock.length) {
        await this.stockService.bulkWrite(arrBulkWriteStock)
      }
      await this.documentService.updateOneByCondition({ _id: id }, {
        state: EnumStateDocument.RECEIVED,
        verifiedAt: moment().valueOf(),
        verifiedBy: {
          _id: currentUser._id,
          username: currentUser.username
        }
      }, context)
      return true
    } catch (err) {
      throw new ApolloError(err)
    }
  }
}