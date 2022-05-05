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
exports.ProductsApi = void 0;
const datasource_sql_1 = require("datasource-sql");
class ProductsApi extends datasource_sql_1.SQLDataSource {
    getProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.knex.select("*").from("products");
        });
    }
    getUserProducts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.knex.select("*").from("products").where({ user_id: userId });
        });
    }
    getProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield this.knex
                .select("*")
                .from("products")
                .where({ id: id });
            return query[0];
        });
    }
    createProduct(sku, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.knex("products").insert({
                user_id: userId,
                sku: sku,
            });
            return { success: true };
        });
    }
    updateProduct(id, sku) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.knex("products").where({ id: id }).update({ sku: sku });
            return { success: true };
        });
    }
    deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.knex("products").where({ id: id }).del();
            return { success: true };
        });
    }
}
exports.ProductsApi = ProductsApi;
