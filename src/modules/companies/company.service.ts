import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Company as CompanyGraphql } from '../../graphql.schema';
import { Company, CompanyDocument } from 'src/schemas/company.schema';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import * as moment from 'moment';
import { ApolloError } from 'apollo-server-errors';
import { toUnsignedName } from 'src/commons/commonFunc';

@Injectable()
export class CompanyService {
  constructor(@InjectModel(Company.name) private companyModel: Model<CompanyDocument>) {}
  async findAll(): Promise<CompanyGraphql[]> {
    return this.companyModel.find({
      isActive: true
    }).exec();
  }
  async findOneById(id): Promise<CompanyGraphql> {
    return this.companyModel.findOne({
      _id: id
    }).exec();
  }
  
  async createOne({ info }, { currentUser }): Promise<CompanyGraphql> {
    const dataExist = await this.companyModel.findOne({
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
    await this.companyModel.create(newData);
    return newData
  }
  
  async updateOne(args, { currentUser }): Promise<CompanyGraphql> {
    const { id, info } = args
    if (info.code !== info.oldCode) {
      const dataExist = await this.companyModel.findOne({
        code: info.code,
        isActive: true
      }).exec()
      if (dataExist) {
        throw new ApolloError('code exist')
      }
    }
    const dataUpdate = await this.companyModel.findOneAndUpdate({
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
    await this.companyModel.updateMany({
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
}