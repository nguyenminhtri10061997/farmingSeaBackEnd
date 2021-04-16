import { Args, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { Document as DocumentGraphql } from '../../graphql.schema';
import { DocumentService } from './document.service';
import { ApolloError } from 'apollo-server-errors';

@Resolver()
export class DocumentResolver {
  constructor(private readonly documentService: DocumentService) {}

  @Query()
  async documents(
    @Args() args
  ): Promise<any[]> {
    try {
      const { type, startDate, endDate, idDesCompany } = args
      const dataDoc = this.documentService.findAllOneByCondition({
        type,
        $and: [
          {
            createdAt: { $gte: startDate },

          },
          {
            createdAt: { $lte: endDate }
          }
        ],
        idDesCompany
      });
      return dataDoc
    } catch (err) {
      throw new ApolloError(err)
    }
  }

  @Query()
  async document(
    @Args() args
  ): Promise<any> {
    const { id } = args
    return this.documentService.findOneById(id);
  }

  @Mutation()
  async createDocument(
    @Context() context,
    @Args() args
  ): Promise<any> {
    try {
      return this.documentService.createOne(args, context);
    } catch (err) {
      throw new ApolloError(err)
    }
  }
}