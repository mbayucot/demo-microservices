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
const post_1 = require("../../datasources/post");
const user_1 = require("../../datasources/user");
const products = [
    {
        id: "apollo-federation",
        sku: "federation",
        package: "@apollo/federation",
        variation: "OSS",
    },
    { id: "apollo-studio", sku: "studio", package: "", variation: "platform" },
];
const ql = (0, fs_1.readFileSync)((0, path_1.resolve)(__dirname, "./products.graphql"), {
    encoding: "utf-8",
});
const typeDefs = (0, apollo_server_lambda_1.gql)(ql);
// @ts-ignore
const resolvers = {
    Query: {
        allProducts: (_, {}, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return dataSources.productsApi.getProducts();
        }),
        product: (_, { id }, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return dataSources.productsApi.getProduct(id);
        }),
    },
    Product: {
        variation: (reference) => {
            if (reference.variation)
                return { id: reference.variation };
            // @ts-ignore
            return { id: products.find((p) => p.id == reference.id).variation };
        },
        dimensions: () => {
            return { size: "1", weight: 1 };
        },
        createdBy: (reference, {}, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return dataSources.usersApi.getUser(reference.id);
            //return {
            //  email: "support123@apollographql.com",
            //  name: "hey",
            //  totalProductsCreated: 1337,
            //};
        }),
        __resolveReference: (reference) => {
            if (reference.id)
                return products.find((p) => p.id == reference.id);
            else if (reference.sku && reference.package)
                return products.find((p) => p.sku == reference.sku && p.package == reference.package);
            else
                return Object.assign({ id: "rover", package: "@apollo/rover" }, reference);
        },
    },
};
const server = new apollo_server_lambda_1.ApolloServer({
    schema: (0, subgraph_1.buildSubgraphSchema)({ typeDefs, resolvers }),
    dataSources: () => {
        return {
            productsApi: new post_1.ProductsApi(db_1.knexConfig),
            usersApi: new user_1.UsersApi(db_1.knexConfig),
        };
    },
});
exports.handler = server.createHandler();
