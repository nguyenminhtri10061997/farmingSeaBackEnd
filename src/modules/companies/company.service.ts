import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Company as CompanyGraphql } from '../../graphql.schema';
import { Company, CompanyDocument } from 'src/schemas/company.schema';
import { Model } from 'mongoose';
import { uuid } from 'uuidv4';
import * as dayjs from 'dayjs'
import { ApolloError } from 'apollo-server-errors';
import { toUnsignedNameName } from 'src/commons/commonFunc';

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
    await this.companyModel.updateMany({
      _id: { $in: ids.filter(i => i !== 'default') }
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