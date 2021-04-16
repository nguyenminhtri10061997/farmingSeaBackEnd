import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StockModel as StockModelGraphql } from '../../graphql.schema';
import { StockModel, StockModelDocument } from 'src/schemas/stockModel.schema';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import moment from 'moment';
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
  async findOneById(id): Promise<StockModelGraphql> {
    return this.stockModelModel.findOne({
      _id: id
    }).exec();
  }
  
  async createOne({ info }, { currentUser }): Promise<StockModelGraphql> {
    const dataExist = await this.stockModelModel.findOne({
      code: info.code,
      isActive: true
    }).exec()
    if (dataExist) {
      throw new ApolloError('code exist')
    }
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
    await this.stockModelModel.create(newData);
    return newData
  }
  
  async updateOne(args, { currentUser }): Promise<StockModelGraphql> {
    const { id, info } = args
    if (info.code !== info.oldCode) {
      const dataExist = await this.stockModelModel.findOne({
        code: info.code,
        isActive: true
      }).exec()
      if (dataExist) {
        throw new ApolloError('code exist')
      }
    }
    const dataUpdate = await this.stockModelModel.findOneAndUpdate({
      _id: id
    }, {
      $set: {
        ...info,
        unsignName: toUnsignedName(info.name),
        updatedAt: moment().valueOf(),
        updatedBy: {
          _id: currentUser._id,
          username: currentUser.username
        }
      }
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
}