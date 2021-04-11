import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StockModel as StockModelGraphql } from '../../graphql.schema';
import { StockModel, StockModelDocument } from 'src/schemas/stockModel.schema';
import { Model } from 'mongoose';
import { uuid } from 'uuidv4';
import * as dayjs from 'dayjs'
import { ApolloError } from 'apollo-server-errors';
import { toUnsignedNameName } from 'src/commons/commonFunc'

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
      _id: uuid(),
      ...info,
      unsignName: toUnsignedNameName(info.name),
      isActive: true,
      createdAt: dayjs().valueOf(),
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
        unsignName: toUnsignedNameName(info.name),
        updatedAt: dayjs().valueOf(),
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
        updatedAt: dayjs().valueOf(),
        updatedBy: {
          _id: currentUser._id,
          username: currentUser.username
        }
      }
    });
    return true
  }
}