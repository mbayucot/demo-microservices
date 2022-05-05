import { ApolloServer, gql } from "apollo-server-lambda";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { readFileSync } from "fs";
import { resolve } from "path";

import { knexConfig } from "../../config/db";
import { UsersApi } from "../../datasources/user";

const users = [
  {
    email: "support@apollographql.com",
    name: "Apollo Studio Support",
    totalProductsCreated: 4,
  },
];

const typeDefs = gql(
  readFileSync(resolve(__dirname, "./users.graphql"), { encoding: "utf-8" })
);

// @ts-ignore
const resolvers = {
  User: {
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
    };
  },
});
exports.handler = server.createHandler();
