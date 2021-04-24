import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Stock, StockDocument } from 'src/schemas/stock.schema';
import { Model } from 'mongoose';

@Injectable()
export class StockService {
  constructor(@InjectModel(Stock.name) private stockModel: Model<StockDocument>) {}
  async findOneById(id): Promise<any> {
    return this.stockModel.findOne({
      _id: id
    }).exec();
  }
  async findAllByCondition(objFind): Promise<any> {
    return this.stockModel.find(objFind).exec();
  }

  async bulkWrite(arrBulkWrite) {
    return await this.stockModel.bulkWrite(arrBulkWrite)
  }
  
  async insertMany(arrInsert) {
    return await this.stockModel.insertMany(arrInsert)
  }
}