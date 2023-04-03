export const updateCollectionHandler = async ({ arg, client, session }: MainFunctionProps) => {
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
  const { country, city, id } = arg[1];
  const collectionId = arg[2];
  let result = 'success';
  const mongo = client.db('base');
  const storeDoc = await client
    .db('generalData')
    .collection('storeInfo')
    .findOne({ _id: new ObjectId(id) }, { session });
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
  // if (addedStoreFrontProducts.length > 0 && isActive) {
  //   let storeFrontProducts = [];
  //   const length =
  //     addedStoreFrontProducts.length > 20
  //       ? 20
  //       : addedStoreFrontProducts.length;
  //   for (let i = 0; i < length; i++) {
  //     const { value } = addedStoreFrontProducts[i];
  //     const product = await findOne(
  //       { _id: new ObjectId(value) },
  //       {
  //         session,
  //         projection: {
  //           textInfo: 1,
  //           pricing: 1,
  //           _id: 1,
  //           isActive: 1,
  //           "options.hasOptions": 1,
  //           images: 1,
  //           measurementSystem: 1,
  //         },
  //       },
  //       client.db("base").collection("products")
  //     );
  //     if (product.isActive) {
  //       storeFrontProducts.push(product);
  //     }
  //   }
  //   console.log(storeFrontProducts, "hereeeeeeeeeeeeeeee");
  //   await client
  //     .db("base")
  //     .collection("storeFronts")
  //     .updateOne(
  //       { _id: new ObjectId(id) },
  //       {
  //         $push: {
  //           [`${textInfo.title}.products`]: {
  //             $each: storeFrontProducts,
  //           },
  //         },
  //       },
  //       { session }
  //     );
  // }
  // if (removedStoreFrontProducts.length > 0 && isActive) {
  //   const key = Object.keys(storeFront).find(
  //     (key) => storeFront[key]?.collectionId === collectionId
  //   );
  //   if (!key) {
  //     result = [];
  //   } else {
  //     console.log(key, "keys ssssss");
  //     const { products } = storeFront[key];
  //     const storeFrontProducts = products?.filter((product) => {
  //       const isProductInRemoveList = removedStoreFrontProducts.find(
  //         ({ value }) => value === product._id.toString()
  //       );
  //       return !isProductInRemoveList;
  //     });
  //     console.log(storeFrontProducts, "dhdhdhdhdhdh");
  //     await client
  //       .db("base")
  //       .collection("storeFronts")
  //       .updateOne(
  //         { _id: new ObjectId(id) },
  //         {
  //           $set: {
  //             [`${textInfo.title}.products`]: storeFrontProducts,
  //           },
  //         },
  //         { session }
  //       );
  //   }
  // }
  return result;
  // Ensures that the client will close when you finish/error
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
};
interface UpdateCollectionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapperWithSession } from 'hyfn-server';
import { ObjectId } from 'mongodb';
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
