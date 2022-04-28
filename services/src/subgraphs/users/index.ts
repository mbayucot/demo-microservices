import { ApolloServer, gql } from 'apollo-server-lambda';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const users = [
    { email: 'support@apollographql.com', name: "Apollo Studio Support", totalProductsCreated: 4 }
]

const typeDefs = gql(readFileSync(resolve(__dirname, './users.graphql'), { encoding: 'utf-8' }));

const resolvers = {
    User: {
        __resolveReference: (reference: any) => {
            return users.find(u => u.email == reference.email);
        }
    }
}

const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers })
});
exports.handler = server.createHandler();
