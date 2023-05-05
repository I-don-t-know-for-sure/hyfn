import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

let pool = null;

export const getPostgresClient = async () => {
  const pool = new Pool({
    connectionString:
      "postgres://bariomymen:Hrh7lDnAFLw6@ep-gentle-term-329274-pooler.eu-central-1.aws.neon.tech/neondb",
    ssl: true,
  });
  // or

  return drizzle(pool);
};
