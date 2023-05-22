export const getCollectionsForProductHandler = async ({
  arg,
  client,
  db,
  userId,
}: MainFunctionProps) => {
  const storeDoc = await db
    .selectFrom('stores')
    .select('id')
    .where('usersIds', '@>', sql`ARRAY[${sql.join([userId])}]::uuid[]`)
    .executeTakeFirstOrThrow();

  const collection = await db
    .selectFrom('collections')
    .select(['id as value', 'title as label'])
    .where('storeId', '=', storeDoc.id)
    .execute();
  return collection;
};
interface GetCollectionsForProductProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { sql } from 'kysely';

export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: getCollectionsForProductHandler });
};
