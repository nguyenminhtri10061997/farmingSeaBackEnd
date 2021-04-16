import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document as DocumentGraphql } from '../../graphql.schema';
import { Document, DocumentDocument } from 'src/schemas/document.schema';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import moment from 'moment';
import { ApolloError } from 'apollo-server-errors';
import { CommonService } from 'src/commons/commonService'
import { EnumStateDocument } from '../../schemas/interface'

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(Document.name) private documentModel: Model<DocumentDocument>,
    private readonly commonService: CommonService
  ) {}

  async findAll({ type }): Promise<any[]> {
    const dataDoc = await this.documentModel.find({
      type,
      state: { $ne: EnumStateDocument.CANCELED }
    }).exec();
    return dataDoc
  }

  async findOneById(id): Promise<any> {
    return this.documentModel.findOne({
      _id: id
    }).exec();
  }

  async findAllOneByCondition(objFind): Promise<any> {
    return this.documentModel.find(objFind).exec();
  }

  async createOne({ info }, { currentUser }): Promise<DocumentGraphql> {
    const { code } = await this.commonService.generateCodeAdapterCompany(
      info.idDesCompany,
      'NK',
      'indexImportDocument'
    )
    const newData = {
      _id: v4(),
      code,
      ...info,
      createdAt: moment().valueOf(),
      createdBy: {
        _id: currentUser._id,
        username: currentUser.username
      }
    }
    await this.documentModel.create(newData);
    return newData
  }
}