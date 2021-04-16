import { Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { InjectModel } from '@nestjs/mongoose'
import { CompanyDocument, Company } from 'src/schemas/company.schema'
import { Model } from 'mongoose'

@Injectable()
export class CommonService {
  constructor(@InjectModel(Company.name) private companyModel: Model<CompanyDocument>) {}

  async generateCodeAdapterCompany(
    entityId: string,
    codeRegex: string,
    indexKey: any,
    length: number = 9,
  ): Promise<any> {
    let currentIndex
    if (entityId && codeRegex && indexKey) {
      try {
        let code
        const entity = await this.companyModel.findOne({
          _id: entityId
        })
        if (!entity) {
          return undefined
        }
        if (!entity[indexKey]) {
          code = `${codeRegex}-${'0'.repeat(length - 1)}1`
          entity[indexKey] = 0
          currentIndex = 0
        } else {
          let subStr = ('0'.repeat(length - 1) + (entity[indexKey] + 1)).substr(-length)
          code = `${codeRegex}-${subStr}`
          currentIndex = entity[indexKey] + 1
        }
        await this.companyModel.updateOne(
          { _id: entityId },
          {
            $set: {
              [indexKey]: entity[indexKey] + 1
            }
          }
        )
        return { code, currentIndex }
      } catch (error) {
        return new ApolloError(error, '403')
      }
    }
    return new ApolloError('generate code')
  }
}