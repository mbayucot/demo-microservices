"use strict";
//const dbName = process.env.POSTGRES_DBNAME as string;
//const dbUser = process.env.POSTGRES_USER as string;
//const dbHost = process.env.POSTGRES_HOST as string;
//const dbPassword = process.env.POSTGRES_PASSWORD as string;
Object.defineProperty(exports, "__esModule", { value: true });
exports.knexConfig = void 0;
const dbName = "demo_development";
const dbUser = "sysdba";
const dbHost = "localhost";
const dbPassword = "Sss7hqYr";
exports.knexConfig = {
    client: "pg",
    connection: {
        host: dbHost,
        port: 5432,
        user: dbUser,
        password: dbPassword,
        database: dbName,
    },
};
