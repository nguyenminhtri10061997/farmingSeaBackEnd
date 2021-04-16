import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vendor as VendorGraphql } from '../../graphql.schema';
import { Vendor, VendorDocument } from 'src/schemas/vendor.schema';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import moment from 'moment';
import { ApolloError } from 'apollo-server-errors';
import { toUnsignedName } from 'src/commons/commonFunc';

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
    await this.vendorModel.updateMany({
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
  
  async search({
    searchString,
    limit,
    idDefault
  }): Promise<VendorGraphql[]> {
    const objOptions: any = {}
    if (limit) {
      objOptions.take = limit
    }
    const res = await this.vendorModel.find({
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
    if (idDefault && !res.find(item => item._id === idDefault)) {
      const dataDefault = await this.vendorModel.findOne({
        where: {
          _id: idDefault
        }
      })
      if (dataDefault) {
        res.push(dataDefault)
      }
    }
    return res
  }
}