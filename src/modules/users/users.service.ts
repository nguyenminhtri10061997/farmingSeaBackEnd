import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserGraphql } from '../../graphql.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async findAll(): Promise<UserGraphql[]> {
    return this.userModel.find().exec();
  }
  async findOneById(id): Promise<UserGraphql[]> {
    return this.userModel.find({
      _id: id
    }).exec();
  }
  async findOneByUsername(username): Promise<UserDocument> {
    return this.userModel.findOne({
      username
    }).exec();
  }
}