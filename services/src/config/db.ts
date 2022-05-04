//const dbName = process.env.POSTGRES_DBNAME as string;
//const dbUser = process.env.POSTGRES_USER as string;
//const dbHost = process.env.POSTGRES_HOST as string;
//const dbPassword = process.env.POSTGRES_PASSWORD as string;

const dbName = "demo_development";
const dbUser = "sysdba";
const dbHost = "localhost";
const dbPassword = "Sss7hqYr";

export const knexConfig = {
  client: "pg",
  connection: {
    host: dbHost,
    port: 5432,
    user: dbUser,
    password: dbPassword,
    database: dbName,
  },
};
