import { ApolloServer, gql } from 'apollo-server-lambda';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const products = [
    { id: 'apollo-federation', sku: 'federation', package: '@apollo/federation', variation: "OSS" },
    { id: 'apollo-studio', sku: 'studio', package: '', variation: "platform" },
]
const ql = readFileSync(resolve(__dirname, './products.graphql'), { encoding: 'utf-8' });

const typeDefs = gql(ql);

const resolvers = {
    Query: {
        allProducts: (_: any, args: any, context: any) => {
            return products;
        },
        product: (_: any, args: any, context: any) => {
            return products.find(p => p.id == args.id);
        }
    },
    Product: {
        variation: (reference: any) => {
            if (reference.variation) return { id: reference.variation };
            // @ts-ignore
            return { id: products.find(p => p.id == reference.id).variation }
        },
        dimensions: () => {
            return { size: "1", weight: 1 }
        },
        createdBy: (reference: any) => {
            return { email: 'support@apollographql.com', totalProductsCreated: 1337 }
        },
        __resolveReference: (reference: any) => {
            if (reference.id) return products.find(p => p.id == reference.id);
            else if (reference.sku && reference.package) return products.find(p => p.sku == reference.sku && p.package == reference.package);
            else return { id: 'rover', package: '@apollo/rover', ...reference };
        }
    }
}

// @ts-ignore
const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers })
});
exports.handler = server.createHandler();
