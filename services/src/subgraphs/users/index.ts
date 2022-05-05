import { ApolloServer, gql } from "apollo-server-lambda";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { readFileSync } from "fs";
import { resolve } from "path";

import { knexConfig } from "../../config/db";
import { UsersApi } from "../../datasources/user";
import { ProductsApi } from "../../datasources/post";

const typeDefs = gql(
  readFileSync(resolve(__dirname, "./users.graphql"), { encoding: "utf-8" })
);

// @ts-ignore
const resolvers = {
  Query: {
    allUsers: async (_, {}, { dataSources }) => {
      return dataSources.usersApi.getUsers();
    },
    user: async (_, { id }, { dataSources }) => {
      return dataSources.usersApi.getUser(id);
    },
  },
  User: {
    products: async (reference: any, {}, { dataSources }) => {
      return dataSources.productsApi.getUserProducts(reference.id);
    },
    __resolveReference: async (reference: any, { dataSources }) => {
      return dataSources.usersApi.getUser(reference.id);
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
  dataSources: () => {
    return {
      usersApi: new UsersApi(knexConfig),
      productsApi: new ProductsApi(knexConfig),
    };
  },
});
exports.handler = server.createHandler();
