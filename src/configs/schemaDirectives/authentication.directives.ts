import { SchemaDirectiveVisitor } from 'apollo-server-express';
import { defaultFieldResolver, GraphQLField } from 'graphql';
import { JWTtoken } from 'src/configs/jwt'


export class AuthenticationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function(...args) {
      const header = args[2].req.headers
      await JWTtoken.decode(header.authentication)
			return resolve.apply(this, args)
    };
  }
}