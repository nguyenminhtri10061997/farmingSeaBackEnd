import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vendor as VendorGraphql } from '../../graphql.schema';
import { Vendor, VendorDocument } from 'src/schemas/vendor.schema';
import { Model } from 'mongoose';
import { uuid } from 'uuidv4';
import * as dayjs from 'dayjs'
import { ApolloError } from 'apollo-server-errors';
import { toUnsignedNameName } from 'src/commons/commonFunc';

@Injectable()
export class VendorService {
  constructor(@InjectModel(Vendor.name) private vendorModel: Model<VendorDocument>) {}
  async findAll(): Promise<VendorGraphql[]> {
    return this.vendorModel.find({
      isActive: true
    }).exec();
  }
  async findOneById(id): Promise<VendorGraphql> {
    return this.vendorModel.findOne({
      _id: id
    }).exec();
  }
  
  async createOne({ info }, { currentUser }): Promise<VendorGraphql> {
    const dataExist = await this.vendorModel.findOne({
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
    await this.vendorModel.create(newData);
    return newData
  }
  
  async updateOne(args, { currentUser }): Promise<VendorGraphql> {
    const { id, info } = args
    if (info.code !== info.oldCode) {
      const dataExist = await this.vendorModel.findOne({
        code: info.code,
        isActive: true
      }).exec()
      if (dataExist) {
        throw new ApolloError('code exist')
      }
    }
    const dataUpdate = await this.vendorModel.findOneAndUpdate({
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
    await this.vendorModel.updateMany({
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