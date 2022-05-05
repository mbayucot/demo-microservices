"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
// @ts-ignore
const resolvers = {
    User: {
        __resolveReference: (reference, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return dataSources.usersApi.getUser(reference.id);
        }),
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
