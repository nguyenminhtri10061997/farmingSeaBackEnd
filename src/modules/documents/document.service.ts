import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, DocumentDocument } from 'src/schemas/document.schema';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { EnumStateDocument } from '../../schemas/interface'

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(Document.name) private documentModel: Model<DocumentDocument>
  ) {}

  async findAll({ type }): Promise<any[]> {
    const dataDoc = await this.documentModel.find({
      type,
      state: { $ne: EnumStateDocument.CANCELED }
    }).exec();
    return dataDoc
  }

  async findOneById(id): Promise<Document> {
    return this.documentModel.findOne({
      _id: id
    }).exec();
  }

  async findAllByCondition(objFind, createdAt = -1): Promise<any> {
    return this.documentModel.find(objFind, null, { sort: { createdAt } }).exec();
  }

  async createOne(newData): Promise<any> {
    await this.documentModel.create(newData);
    return newData
  }
  async updateOneByCondition(objFind, objUpdate, { currentUser }) {
    const dataUpdate = await this.documentModel.findOneAndUpdate(objFind, {
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
}