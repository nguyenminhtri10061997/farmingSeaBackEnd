import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { JWTtoken } from 'src/configs/jwt'
import * as mongoose from 'mongoose';
import { ApolloError } from 'apollo-server-errors';
import { UserSchema } from './schemas/user.schema';
import { CatsModule } from './modules/cats/cats.module';
import { UsersModule } from './modules/users/users.module';
import { LoginsModule } from './modules/logins/login.module';
import { MeModule } from './modules/mes/me.module';
import { CompanyModule } from './modules/companies/company.module';
import { VendorModule } from './modules/vendors/vendor.module';
import { CustomerModule } from './modules/customers/customer.module';
import { StockModelModule } from './modules/stockModels/stockModel.module';

const connection = mongoose.createConnection('mongodb://localhost:27017/farmingSea');
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/farmingSea'),
    UsersModule,
    CatsModule,
    LoginsModule,
    MeModule,
    CompanyModule,
    VendorModule,
    CustomerModule,
    StockModelModule,
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      // installSubscriptionHandlers: true,
      // schemaDirectives: {
      //   isAuthentication: AuthenticationDirective,
      // },
      context: async ({ req }) => {
        if (req.body.operationName !== 'login') {
          const token = req.headers['access-token'] || '';
          // console.log(JWTtoken.encode({idUser: '606ee11313113cff085c88df'}))
          const data: any = await JWTtoken.decode(token)
          const userModel = connection.model('users', UserSchema);
          const currentUser = await userModel.findOne({
            _id: data.idUser
          }).exec()
          if (!currentUser) {
            throw new ApolloError('UNAUTHENTICATED', 'UNAUTHENTICATED')
          }
          return { currentUser };
        }
      },
    })
  ],
})
export class AppModule {}