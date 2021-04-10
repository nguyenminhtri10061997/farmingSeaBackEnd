import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserGraphql } from '../../graphql.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class MeService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getMe({ currentUser }): Promise<UserGraphql> {
    const dataUser = await this.userModel.findOne({
      _id: currentUser._id
    }).exec()
    return dataUser;
  }
}