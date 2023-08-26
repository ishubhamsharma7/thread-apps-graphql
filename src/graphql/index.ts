import { ApolloServer } from '@apollo/server';
import { User } from './user';

async function createApolloGraphqlServer(){
    //Create Graphql Server
    const gqlServer = new ApolloServer({
        typeDefs: `
            ${User.typeDefs}
            type Query {
                ${User.queries}
            }
            type Mutation {
                ${User.mutation}
            }
    ` ,//schema
        resolvers: {
            Query:{
             ...User.resolvers.queries
            },
            Mutation:{
              ...User.resolvers.mutation
            }
        }
    })

    //Start GQL server
    await gqlServer.start()

    return gqlServer
}

export default createApolloGraphqlServer