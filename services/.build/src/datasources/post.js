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
    getProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.knex.select("*").from("posts").where({ id: id });
        });
    }
    createProduct(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.knex("posts").insert({ name: "Tim" });
        });
    }
    updateProduct(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.knex("posts").where({ id: id }).update({ name: name });
        });
    }
    deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.knex("posts").where({ id: id }).del();
        });
    }
}
exports.ProductsApi = ProductsApi;
