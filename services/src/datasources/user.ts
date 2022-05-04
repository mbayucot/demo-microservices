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

  async createUser(id: number, name: string) {
    return this.knex("users").insert({ name: "Tim" });
  }

  async updateUser(id: number, name: string) {
    return this.knex("users").where({ id: id }).update({ name: name });
  }

  async deleteUser(id: number) {
    return this.knex("users").where({ id: id }).del();
  }
}
