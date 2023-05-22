('use strict');
import { MainFunctionProps, mainWrapper, tStores, takeFisrtOrThrow, zStore } from 'hyfn-server';
import { sql } from 'kysely';
interface GetStoreDocumentProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
export const getStoreDocumentHandler = async ({ client, userId, db }: GetStoreDocumentProps) => {
  const storeDoc = await db
    .selectFrom('stores')
    .selectAll()
    .where('usersIds', '@>', sql`ARRAY[${sql.join([userId])}]::uuid[]`)
    .executeTakeFirstOrThrow();

  return { ...storeDoc /* userType: result.users[userId].userType */ };
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getStoreDocumentHandler });
};
