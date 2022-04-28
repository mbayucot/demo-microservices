import { SQLDataSource } from "datasource-sql";

import { Product } from "../generated/graphql";

export class ProductsApi extends SQLDataSource {
  async getProducts() {
    return this.knex.select("*").from("posts");
  }

  async getProduct(id: number) {
    return this.knex.select("*").from("posts").where({ id: id });
  }

  async createProduct(id: number, name: string) {
    return this.knex("posts").insert({ name: "Tim" });
  }

  async updateProduct(id: number, name: string) {
    return this.knex("posts").where({ id: id }).update({ name: name });
  }

  async deleteProduct(id: number) {
    return this.knex("posts").where({ id: id }).del();
  }
}
