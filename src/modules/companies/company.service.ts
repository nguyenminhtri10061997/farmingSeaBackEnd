import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Company as CompanyGraphql } from '../../graphql.schema';
import { Company, CompanyDocument } from 'src/schemas/company.schema';
import { Model } from 'mongoose';
import { uuid } from 'uuidv4';
import * as dayjs from 'dayjs'

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
    const newData = {
      _id: uuid(),
      ...info,
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
  
  async udpateOne(args, { currentUser }): Promise<CompanyGraphql> {
    const { id, info } = args
    const dataUpdate = await this.companyModel.findByIdAndUpdate({
      _id: id
    }, {
      $set: {
        ...info,
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