export const createCollection = async ({ arg, client, userId, db }: MainFunctionProps) => {
  const result = await db.transaction().execute(async (trx) => {
    const { title, description, collectionType, isActive, addedProductsArray } = arg[0];

    const storeDoc = await db
      .selectFrom('stores')
      .selectAll()
      .where('usersIds', '@>', sql`ARRAY[${sql.join([userId])}]::uuid[]`)
      .executeTakeFirstOrThrow();

    if (!storeDoc) throw new Error(returnsObj['store not found']);
    const id = storeDoc.id;

    const collectionId = await trx
      .insertInto('collections')
      .values({
        title: title,

        collectionType,
        isActive,
        description: description,

        storeId: id,
      })
      .returning(['id'])
      .executeTakeFirst();

    if (addedProductsArray?.length > 0) {
      const updateQuery = addedProductsArray?.map((product) => {
        return {
          collectionId: collectionId.id,
          productId: product.value,
        };
      });

      await trx.insertInto('collectionsProducts').values(updateQuery).execute();
    }

    return collectionId.id;
  });

  return result;
};
interface HandlerProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { sql } from 'kysely';
import { returnsObj } from 'hyfn-types';
export const handler = async (event, ctx, callback) => {
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  };
  const response = await mainWrapper({
    ctx,
    callback,
    event,
    mainFunction: createCollection,
    sessionPrefrences: transactionOptions,
  });
  return response; // Ensures that the client will close when you finish/error
};
