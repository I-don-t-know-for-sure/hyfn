import { MainFunctionProps } from 'hyfn-server';
import { sql } from 'kysely';

export const getStoreFromEmployeeId = async (db: MainFunctionProps['db'], usersIds: string[]) => {
  return await db
    .selectFrom('stores')
    .selectAll()
    .where('usersIds', '@>', sql`ARRAY[${sql.join([usersIds])}]::uuid[]`)
    .executeTakeFirstOrThrow();
};
