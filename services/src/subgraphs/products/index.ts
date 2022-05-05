import { ApolloServer, gql } from "apollo-server-lambda";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { readFileSync } from "fs";
import { resolve } from "path";

import { knexConfig } from "../../config/db";
import { ProductsApi } from "../../datasources/post";
import { UsersApi } from "../../datasources/user";

const products = [
  {
    id: "apollo-federation",
    sku: "federation",
    package: "@apollo/federation",
    variation: "OSS",
  },
  { id: "apollo-studio", sku: "studio", package: "", variation: "platform" },
];
const ql = readFileSync(resolve(__dirname, "./products.graphql"), {
  encoding: "utf-8",
});

const typeDefs = gql(ql);

// @ts-ignore
const resolvers = {
  Query: {
    allProducts: async (_, {}, { dataSources }) => {
      return dataSources.productsApi.getProducts();
    },
    product: async (_, { id }, { dataSources }) => {
      return dataSources.productsApi.getProduct(id);
    },
  },
  Mutation: {
    createProduct: async (_, { sku, userId }, { dataSources }) => {
      return dataSources.productsApi.createProduct(sku, userId);
    },
    updateProduct: async (_, { id, sku }, { dataSources }) => {
      return dataSources.productsApi.updateProduct(id, sku);
    },
    deleteProduct: async (_, { id }, { dataSources }) => {
      return dataSources.productsApi.deleteProduct(id);
    },
  },
  Product: {
    createdBy: async (reference: any, {}, { dataSources }) => {
      return dataSources.usersApi.getUser(reference.user_id);
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
  dataSources: () => {
    return {
      productsApi: new ProductsApi(knexConfig),
      usersApi: new UsersApi(knexConfig),
    };
  },
});
exports.handler = server.createHandler();
