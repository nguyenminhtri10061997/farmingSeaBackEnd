import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { STransaction as STransactionGraphql } from '../../graphql.schema';
import { STransaction, STransactionDocument } from '../../schemas/sTransaction.schema';
import { Model } from 'mongoose';
import * as moment from 'moment';

@Injectable()
export class STransactionService {
  constructor(@InjectModel(STransaction.name) private sTransactionModel: Model<STransactionDocument>) {}
  async findAll(): Promise<STransactionGraphql[]> {
    return this.sTransactionModel.find({
      isActive: true
    }).exec();
  }
  async findOneById(id): Promise<STransactionGraphql> {
    return this.sTransactionModel.findOne({
      _id: id
    }).exec();
  }

  
  async findOneByCondition(objFind): Promise<STransactionGraphql> {
    return this.sTransactionModel.findOne(objFind).exec();
  }
  
  async createOne(newData) {
    await this.sTransactionModel.create(newData)
    return newData
  }
  
  async updateOne(objQuery, objUpdate, { currentUser }): Promise<STransactionGraphql> {
    const dataUpdate = await this.sTransactionModel.findOneAndUpdate(objQuery, {
      $set: {
        ...objUpdate,
        updatedAt: moment().valueOf(),
        updatedBy: {
          _id: currentUser._id,
          username: currentUser.username
        }
      }
    }, {
      new: true
    })
    return dataUpdate
  }
  
  async deletes({ ids }, { currentUser }): Promise<boolean> {
    await this.sTransactionModel.updateMany({
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
    return await this.sTransactionModel.find(objFind)
  }
}