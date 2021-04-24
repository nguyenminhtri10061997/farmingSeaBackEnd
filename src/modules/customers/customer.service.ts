import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer as CustomerGraphql } from '../../graphql.schema';
import { Customer, CustomerDocument } from 'src/schemas/customer.schema';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import * as moment from 'moment';
import { ApolloError } from 'apollo-server-errors';
import { toUnsignedName } from 'src/commons/commonFunc';

@Injectable()
export class CustomerService {
  constructor(@InjectModel(Customer.name) private customerModel: Model<CustomerDocument>) {}
  async findAll(): Promise<CustomerGraphql[]> {
    return this.customerModel.find({
      isActive: true
    }).exec();
  }
  async findOneById(id): Promise<CustomerGraphql> {
    return this.customerModel.findOne({
      _id: id
    }).exec();
  }
  
  async createOne({ info }, { currentUser }): Promise<CustomerGraphql> {
    const dataExist = await this.customerModel.findOne({
      code: info.code,
      isActive: true
    }).exec()
    if (dataExist) {
      throw new ApolloError('code exist')
    }
    const newData = {
      _id: v4(),
      ...info,
      unsignFullName: toUnsignedName(info.fullName),
      isActive: true,
      createdAt: moment().valueOf(),
      createdBy: {
        _id: currentUser._id,
        username: currentUser.username
      }
    }
    await this.customerModel.create(newData);
    return newData
  }
  
  async updateOne(args, { currentUser }): Promise<CustomerGraphql> {
    const { id, info } = args
    if (info.code !== info.oldCode) {
      const dataExist = await this.customerModel.findOne({
        code: info.code,
        isActive: true
      }).exec()
      if (dataExist) {
        throw new ApolloError('code exist')
      }
    }
    const dataUpdate = await this.customerModel.findOneAndUpdate({
      _id: id
    }, {
      $set: {
        ...info,
        unsignFullName: toUnsignedName(info.fullName),
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
    await this.customerModel.updateMany({
      _id: { $in: ids.filter(i => i !== 'default') }
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
  
  async searchCustomers({
    searchString,
    limit,
    idDefault
  }): Promise<CustomerGraphql[]> {
    const objOptions: any = {}
    if (limit) {
      objOptions.take = limit
    }
    const res = await this.customerModel.find({
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
      const dataDefault = await this.customerModel.findOne({
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