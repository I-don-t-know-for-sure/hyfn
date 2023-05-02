export const deleteCollectionHandler = async ({
  client,

  arg,
  userId,
}: MainFunctionProps) => {
  const session = client.startSession();
  const response = await withTransaction({
    session,
    fn: async () => {
      var result;

      const collectionId = arg[1];
      const mongo = client.db('base');
      console.log(JSON.stringify(arg), 'he');
      const storeDoc = await client
        .db('generalData')
        .collection('storeInfo')
        .findOne({ usersIds: userId }, {});
      if (!storeDoc) throw new Error('store not found');
      const id = storeDoc._id.toString();

      const oldCol = storeDoc.collections.find((collection) => collection._id === collectionId);

      await mongo.collection(`products`).updateMany(
        { storeId: id },
        {
          $pull: { collections: { value: { $eq: collectionId } } } as any,
        },
        { session }
      );
      console.log('he');
      await client
        .db('generalData')
        .collection(`storeInfo`)
        .updateOne(
          { _id: new ObjectId(id) },
          {
            $pull: { collections: { _id: collectionId } },
          },
          { session }
        );
      await mongo.collection(`storeFronts`).updateOne(
        { _id: new ObjectId(id) },
        {
          $unset: { [`${oldCol.textInfo.title}`]: '' },
        },
        { session }
      );
      result = 'success';
      return result;
    },
  });
  await session.endSession();
  return response;
  // Ensures that the client will close when you finish/error
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
interface DeleteCollectionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper, withTransaction } from 'hyfn-server';
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
