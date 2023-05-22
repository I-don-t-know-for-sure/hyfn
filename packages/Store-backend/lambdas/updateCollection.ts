('use strict');
import {
  MainFunctionProps,
  mainWrapper,
  tCollections_products,
  withTransaction,
} from 'hyfn-server';
import { sql } from 'kysely';
import { ObjectId } from 'mongodb';
interface UpdateCollectionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const updateCollectionHandler = async ({
  arg,
  client,
  db,
  userId,
}: UpdateCollectionProps) => {
  const {
    title,
    description,
    collectionType,
    mustMatch,
    conditionArray,
    isActive,
    addedProductsArray,
    removedProductsArray,
  } = arg[0];

  await db.transaction().execute(async (trx) => {
    const collectionId = arg[2];

    const storeDoc = await trx
      .selectFrom('stores')
      .selectAll()
      .where('usersIds', '@>', sql`ARRAY[${sql.join([userId])}]::uuid[]`)
      .executeTakeFirstOrThrow();

    if (!storeDoc) throw new Error('store not found');
    const id = storeDoc.id.toString();

    await trx
      .updateTable('collections')
      .set({
        title: title,
        description: description,
        isActive,
      })
      .where('id', '=', collectionId)
      .execute();
    if (addedProductsArray.length > 0) {
      await trx
        .insertInto('collectionsProducts')
        .values(addedProductsArray.map((product) => ({ productId: product.value, collectionId })))
        .execute();
    }

    if (removedProductsArray.length > 0) {
      await trx
        .deleteFrom('collectionsProducts')
        .where(
          'productId',
          'in',
          removedProductsArray.map((product) => product.value)
        )
        .where('collectionId', '=', collectionId)

        .execute();
    }
  });
};
export const handler = async (event, ctx) => {
  return await mainWrapper({
    event,
    ctx,
    mainFunction: updateCollectionHandler,
    sessionPrefrences: {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    },
  });
};
