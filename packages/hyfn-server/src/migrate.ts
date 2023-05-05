import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";
// import { drizzle } from 'drizzle-orm/node-postgres';

import fs from "fs";
(async () => {
  const sqlScript = fs.readFileSync(
    "./migrations/0000_polite_mindworm.sql",
    "utf8"
  );

  const pool = new Pool({
    connectionString:
      "postgres://bariomymen:Hrh7lDnAFLw6@ep-gentle-term-329274-pooler.eu-central-1.aws.neon.tech/neondb",
  });
  // or

  // const db = drizzle(pool);

  // db.execute(sql`${sqlScript}`);
})();
