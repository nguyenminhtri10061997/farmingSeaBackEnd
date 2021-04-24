import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StockModel as StockModelGraphql } from '../../graphql.schema';
import { StockModel, StockModelDocument } from 'src/schemas/stockModel.schema';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { ApolloError } from 'apollo-server-errors';
import { toUnsignedName } from 'src/commons/commonFunc'

@Injectable()
export class StockModelService {
  constructor(@InjectModel(StockModel.name) private stockModelModel: Model<StockModelDocument>) {}
  async findAll(): Promise<StockModelGraphql[]> {
    return this.stockModelModel.find({
      isActive: true
    }).exec();
  }
  async findOneById(id): Promise<any> {
    return this.stockModelModel.findOne({
      _id: id
    }).exec();
  }

  
  async findOneByCondition(objFind): Promise<StockModelGraphql> {
    return this.stockModelModel.findOne(objFind).exec();
  }
  
  async createOne(newData): Promise<StockModelGraphql> {
    await this.stockModelModel.create(newData);
    return newData
  }
  
  async updateOne(objFind, objSet): Promise<StockModelGraphql> {
    const dataUpdate = await this.stockModelModel.findOneAndUpdate(objFind, {
      $set: objSet
    })
    return dataUpdate
  }
  
  async deletes({ ids }, { currentUser }): Promise<boolean> {
    await this.stockModelModel.updateMany({
      _id: { $in: ids }
    }, {
      $set: {
        isActive: false,
        updatedAt: moment().valueOf(),
        updatedBy: {
          _id: currentUser._id,
          username: currentUser.username
        }
      }
    });
    return true
  }
  async findAllByCondition(objFind) {
    return await this.stockModelModel.find(objFind)
  }
  
  async bulkWrite(arrBulkWrite) {
    return await this.stockModelModel.bulkWrite(arrBulkWrite)
  }
}