"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_lambda_1 = require("apollo-server-lambda");
const subgraph_1 = require("@apollo/subgraph");
const fs_1 = require("fs");
const path_1 = require("path");
const products = [
    { id: 'apollo-federation', sku: 'federation', package: '@apollo/federation', variation: "OSS" },
    { id: 'apollo-studio', sku: 'studio', package: '', variation: "platform" },
];
const ql = (0, fs_1.readFileSync)((0, path_1.resolve)(__dirname, './products.graphql'), { encoding: 'utf-8' });
const typeDefs = (0, apollo_server_lambda_1.gql)(ql);
const resolvers = {
    Query: {
        allProducts: (_, args, context) => {
            return products;
        },
        product: (_, args, context) => {
            return products.find(p => p.id == args.id);
        }
    },
    Product: {
        variation: (reference) => {
            if (reference.variation)
                return { id: reference.variation };
            // @ts-ignore
            return { id: products.find(p => p.id == reference.id).variation };
        },
        dimensions: () => {
            return { size: "1", weight: 1 };
        },
        createdBy: (reference) => {
            return { email: 'support@apollographql.com', totalProductsCreated: 1337 };
        },
        __resolveReference: (reference) => {
            if (reference.id)
                return products.find(p => p.id == reference.id);
            else if (reference.sku && reference.package)
                return products.find(p => p.sku == reference.sku && p.package == reference.package);
            else
                return Object.assign({ id: 'rover', package: '@apollo/rover' }, reference);
        }
    }
};
const server = new apollo_server_lambda_1.ApolloServer({
    schema: (0, subgraph_1.buildSubgraphSchema)({ typeDefs, resolvers })
});
exports.handler = server.createHandler();
