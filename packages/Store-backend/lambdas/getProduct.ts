export const getProductHandler = async ({ arg, client, userId, db }: MainFunctionProps) => {
  // await subscriptionCheck({ storedoc: userDocument, client, storeId: userDocument.id });

  const id = arg[0];
  const productId = arg[1];

  const product = await db
    .selectFrom('products')
    .selectAll()
    .where('id', '=', productId)
    .executeTakeFirstOrThrow();
  const productCollection = await db
    .selectFrom('collectionsProducts')
    .selectAll()
    .where('productId', '=', productId)
    .execute();
  const collections = productCollection.map((relation) => relation.collectionId);
  const collectionsArray = await db
    .selectFrom('collections')
    .select(['id as value', 'title as label'])
    .where(sql` id = any (array[${sql.join(collections)}]::uuid[])`)
    .execute();
  return { ...product, collections: collectionsArray };
};
interface GetProductProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper, tCollection, tCollections } from 'hyfn-server';
import { sql } from 'kysely';
import { ObjectId } from 'mongodb';

export const handler = async (event, ctx, callback) => {
  return await mainWrapper({ event, ctx, mainFunction: getProductHandler });
};
