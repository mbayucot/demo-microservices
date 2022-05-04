"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_lambda_1 = require("apollo-server-lambda");
const subgraph_1 = require("@apollo/subgraph");
const fs_1 = require("fs");
const path_1 = require("path");
const db_1 = require("../../config/db");
const user_1 = require("../../datasources/user");
const users = [
    {
        email: "support@apollographql.com",
        name: "Apollo Studio Support",
        totalProductsCreated: 4,
    },
];
const typeDefs = (0, apollo_server_lambda_1.gql)((0, fs_1.readFileSync)((0, path_1.resolve)(__dirname, "./users.graphql"), { encoding: "utf-8" }));
const resolvers = {
    User: {
        __resolveReference: (reference) => {
            //return dataSources.usersApi.getUser();
            return users.find((u) => u.email == reference.email);
        },
    },
};
const server = new apollo_server_lambda_1.ApolloServer({
    schema: (0, subgraph_1.buildSubgraphSchema)({ typeDefs, resolvers }),
    dataSources: () => {
        return {
            usersApi: new user_1.UsersApi(db_1.knexConfig),
        };
    },
});
exports.handler = server.createHandler();
