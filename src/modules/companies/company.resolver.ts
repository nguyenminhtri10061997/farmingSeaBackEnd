import { Args, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { User as UserGraphql } from '../../graphql.schema';
import { CompanyService } from './company.service';
import { ApolloError } from 'apollo-server-errors';

@Resolver()
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  @Query()
  async conpanies(
  ): Promise<UserGraphql[]> {
    return this.companyService.findAll();
  }

  @Query()
  async company(
    @Args() args
  ): Promise<UserGraphql> {
    const { id } = args
    return this.companyService.findOneById(id);
  }

  @Mutation()
  async createCompany(
    @Context() context,
    @Args() args
  ): Promise<UserGraphql> {
    return this.companyService.createOne(args, context);
  }

  @Mutation()
  async updateCompany(
    @Context() context,
    @Args() args
  ): Promise<UserGraphql> {
    return this.companyService.udpateOne(args, context);
  }

  @Mutation()
  async deleteCompanies(
    @Context() context,
    @Args() args
  ): Promise<boolean> {
    return this.companyService.deletes(args, context);
  }
}