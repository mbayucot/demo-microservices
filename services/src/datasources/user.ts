import { SQLDataSource } from "datasource-sql";

import { Product } from "../generated/graphql";

export class UsersApi extends SQLDataSource {
  async getUsers() {
    return this.knex.select("*").from("users");
  }

  async getUser(id: number) {
    const query = await this.knex.select("*").from("users").where({ id: id });
    return query[0];
  }
}
