import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";

import { Pool, types } from "pg";
import { Database } from "../schemas";

types.setTypeParser(1700, (val) => parseFloat(val));
export const getDb = async () => {
  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.db_url,
        ssl: true,
      }),
    }),
    plugins: [new CamelCasePlugin()],
  });

  return db;
};
