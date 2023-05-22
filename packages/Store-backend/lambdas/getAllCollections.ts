export const getAllCollectionsHandler = async ({ arg, client, db, userId }: MainFunctionProps) => {
  // const { id, country, city } = arg[0];

  // await argValidations(arg);

  const storeDoc = await db
    .selectFrom('stores')
    .select('id')
    .where('usersIds', '@>', sql`ARRAY[${sql.join([userId])}]::uuid[]`)
    .executeTakeFirstOrThrow();
  const collections = await db
    .selectFrom('collections')
    .selectAll()
    .where('storeId', '=', storeDoc.id)
    .execute();
  return collections;
};
interface GetAllCollectionsProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { sql } from 'kysely';
import { ObjectId } from 'mongodb';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: getAllCollectionsHandler });
};
