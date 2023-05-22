export const deleteCollectionHandler = async ({
  client,

  arg,
  userId,
  db,
}: MainFunctionProps) => {
  var result;

  const collectionId = arg[1];

  await db.transaction().execute(async (trx) => {
    const storeDoc = await trx
      .selectFrom('stores')
      .selectAll()
      .where('usersIds', '@>', sql`ARRAY[${sql.join([userId])}]::uuid[]`)
      .executeTakeFirstOrThrow();
    if (!storeDoc) throw new Error('store not found');

    await trx.deleteFrom('collections').where('id', '=', collectionId).executeTakeFirst();
    await trx
      .deleteFrom('collectionsProducts')
      .where('collectionId', '=', collectionId)
      .executeTakeFirst();
  });

  return 'success';
  // Ensures that the client will close when you finish/error
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
interface DeleteCollectionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { sql } from 'kysely';
import { ObjectId } from 'mongodb';
export const handler = async (event, ctx) => {
  // await argValidations(arg);
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  };
  return await mainWrapper({
    event,
    ctx,
    mainFunction: deleteCollectionHandler,
  });
};
