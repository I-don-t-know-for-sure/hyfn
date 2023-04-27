('use strict');
import { MainFunctionProps, mainWrapperWithSession } from 'hyfn-server';
import { ObjectId } from 'mongodb';
interface UpdateCollectionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const updateCollectionHandler = async ({
  arg,
  client,
  session,
  userId,
}: UpdateCollectionProps) => {
  // const arg = event;
  const {
    textInfo,
    collectionType,
    mustMatch,
    conditionArray,
    isActive,
    addedProductsArray,
    removedProductsArray,
    addedStoreFrontProducts,
    removedStoreFrontProducts,
  } = arg[0];
  // const { country, city, id } = arg[1];
  const collectionId = arg[2];
  let result = 'success';
  const mongo = client.db('base');
  // const storeDoc = await client
  //   .db('generalData')
  //   .collection('storeInfo')
  //   .findOne({ _id: new ObjectId(id) }, { session });
  const storeDoc = await client
    .db('generalData')
    .collection('storeInfo')
    .findOne({ usersIds: userId }, {});
  if (!storeDoc) throw new Error('store not found');
  const id = storeDoc._id.toString();
  const oldCol = storeDoc.collections.find((collection) => collection._id === collectionId);
  if (collectionType === 'manual') {
    await mongo.collection(`products`).updateMany(
      { 'storeId': id, 'collections.value': collectionId },
      {
        $set: {
          'collections.$': { label: textInfo.title, value: oldCol._id },
        },
      },
      { session }
    );
    await client
      .db('generalData')
      .collection('storeInfo')
      .updateOne(
        { '_id': new ObjectId(id), 'collections._id': collectionId },
        {
          $set: {
            'collections.$': {
              textInfo,
              collectionType,
              isActive,
              _id: collectionId,
            },
          },
        },
        { session }
      );
  }
  if (collectionType === 'automated') {
    await mongo.collection(`products`).updateMany(
      { 'storeId': id, 'collections.value': collectionId },
      {
        $pull: { 'collections.$': { value: { $eq: collectionId } } } as any,
      },
      {
        session,
      }
    );
    const filters = conditionArray.map((condition) => {
      const { objectKey, condition: operator, value } = condition;
      return { [`${objectKey}`]: { [`${operator}`]: value } };
    });
    if (mustMatch === '$and') {
      await mongo.collection(`products`).updateMany(
        { storeId: id, $and: [...filters] },
        {
          $push: {
            collections: {
              label: textInfo.title,
              value: collectionId,
            },
          } as any,
        },
        {
          session,
        }
      );
    } else {
      await mongo.collection(`products`).updateMany(
        { storeId: id, $or: [...filters] },
        {
          $push: {
            collections: {
              label: textInfo.title,
              value: collectionId,
            },
          } as any,
        },
        { session }
      );
    }
    await client
      .db('generalData')
      .collection('storeInfo')
      .updateOne(
        { '_id': new ObjectId(id), 'collections._id': collectionId },
        {
          $set: {
            'collections.$': {
              textInfo,
              collectionType,
              conditionS: {
                mustMatch: mustMatch,
                conditionArray: conditionArray,
              },
              isActive,
              _id: collectionId,
            },
          },
        },
        { session }
      );
  }
  if (!isActive) {
    await mongo.collection(`storeFronts`).updateOne(
      { _id: new ObjectId(id) },
      {
        $unset: { [`${oldCol.textInfo.title}`]: '' },
      },
      {
        session,
      }
    );
  }
  if (!oldCol.isActive && isActive) {
    await client
      .db('base')
      .collection('storeFronts')
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            [textInfo.title]: {
              collectionId,
              collectionName: textInfo.title,
              products: [],
            },
          },
        },
        { session }
      );
  }
  if (addedProductsArray?.length > 0) {
    const updateQuery = addedProductsArray?.map((product) => {
      return {
        updateOne: {
          filter: {
            'collections.value': { $ne: collectionId },
            '_id': new ObjectId(product.value),
          },
          update: {
            $push: {
              collections: {
                label: textInfo.title,
                value: collectionId,
              },
            },
          },
        },
      };
    });
    console.log(updateQuery);
    await client.db('base').collection('products').bulkWrite(updateQuery, { session });
  }
  console.log(removedProductsArray, 'remove');
  if (removedProductsArray?.length > 0) {
    const updateQuery = removedProductsArray?.map((product) => {
      return {
        updateOne: {
          filter: {
            'collections.value': { $eq: collectionId },
            '_id': new ObjectId(product.value),
          },
          update: {
            $pull: {
              collections: {
                value: { $eq: collectionId },
              },
            },
          },
        },
      };
    });
    console.log(updateQuery);
    await client.db('base').collection('products').bulkWrite(updateQuery, { session });
  }

  return result;
  // Ensures that the client will close when you finish/error
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
};
export const handler = async (event, ctx) => {
  return await mainWrapperWithSession({
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
