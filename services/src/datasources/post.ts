import { SQLDataSource } from "datasource-sql";

import { Product } from "../generated/graphql";
import { User } from "../generated/graphql";

export class ProductsApi extends SQLDataSource {
  async getProducts() {
    return this.knex.select("*").from("products");
  }

  async getProduct(id: number) {
    const query = await this.knex
      .select("*")
      .from("products")
      .where({ id: id });
    return query[0];
  }

  async createProduct(sku: string, userId: number) {
    await this.knex("products").insert({
      user_id: userId,
      sku: sku,
    });
    return { success: true };
  }

  async updateProduct(id: number, name: string) {
    return this.knex("posts").where({ id: id }).update({ name: name });
  }

  async deleteProduct(id: number) {
    return this.knex("posts").where({ id: id }).del();
  }
}
