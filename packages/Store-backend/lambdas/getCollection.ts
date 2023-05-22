export const getCollectionHandler = async ({ arg, client, db, userId }: MainFunctionProps) => {
  const collectionId = arg[1];
  // await argValidations(arg);

  const storeDoc = await db
    .selectFrom('stores')
    .selectAll()
    .where('usersIds', '@>', sql`ARRAY[${sql.join([userId])}]::uuid[]`)
    .executeTakeFirstOrThrow();
  // const collection = storeDoc.collections?.find((collection) => collection._id === collectionId);

  const collection = await db
    .selectFrom('collections')
    .selectAll()
    .where('id', '=', collectionId)
    .where('storeId', '=', storeDoc.id)
    .executeTakeFirstOrThrow();

  return collection;
  // Ensures that the client will close when you finish/error
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
interface GetCollectionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { sql } from 'kysely';
import { ObjectId } from 'mongodb';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: getCollectionHandler });
};
