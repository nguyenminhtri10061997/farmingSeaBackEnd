import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from '../users/users.service';
import { JWTtoken } from 'src/configs/jwt'

@Resolver()
export class LoginsResolver {
  constructor(private readonly UsersService: UsersService) {}

  @Query()
  async login(
    @Args() args
  ): Promise<any> {
    const { info: { username, password }} = args
    const dataUser = await this.UsersService.findOneByUsername(username)
    if (!dataUser) {
      throw '!dataUser'
    }
    if (dataUser.password !== password) {
      throw '!password'
    }
    return {
      token: JWTtoken.encode({
        idUser: dataUser._id
      })
    };
  }
}