import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { users } from 'hyfn-server';

export const handler = async (event: any) => {
  const pool = new Pool({
    connectionString:
      'postgres://bariomymen:Hrh7lDnAFLw6@ep-gentle-term-329274-pooler.eu-central-1.aws.neon.tech/neondb',
    ssl: true,
  });
  // or

  const db = drizzle(pool);
};
