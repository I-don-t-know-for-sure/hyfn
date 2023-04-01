export const handlerHandler = async ({ arg, client, session, event }: MainFunctionProps) => {
  // const arg = event;
  var result;
  console.log('12');
  const {
    textInfo,
    collectionType,
    mustMatch,
    conditionArray,
    isActive,
    addedProductsArray,
    addedStoreFrontProducts,
  } = arg[0];
  const { country, city, id } = arg[1];
  // const { accessToken, userId } = arg[arg.length - 1];
  // await argValidations(arg);
  // await mainValidateFunction(client, accessToken, userId);
  // if (
  //   textInfo.title === '' ||
  //   textInfo.title === undefined ||
  //   typeof textInfo.title !== 'string' ||
  //   textInfo.description === '' ||
  //   textInfo.description === undefined ||
  //   typeof textInfo.description !== 'string'
  // ) {
  //   console.log('21');
  //   throw new Error('your payload is not right');
  // }
  if (collectionType === 'automated') {
    if (mustMatch !== '$and' || mustMatch !== '$or') {
      throw new Error('your payload is not right');
    }
    conditionArray.map((condition) => {
      const { objectKey, condition: operator, value } = condition;
      if (
        objectKey === '' ||
        objectKey === undefined ||
        typeof objectKey !== 'string' ||
        operator === '' ||
        operator === undefined ||
        typeof operator !== 'string' ||
        value !== '' ||
        value !== undefined ||
        value !== 0
      ) {
        console.log('42');
        throw new Error('your payload is not right');
      }
    });
  }
  const x = new ObjectId();
  const mongo = client.db('base');
  console.log('56');
  // if (collectionType === 'automated') {
  //   if (isActive) {
  //     var filters = conditionArray.map((condition) => {
  //       const { objectKey, condition: operator, value } = condition;
  //       return { [`${objectKey}`]: { [`${operator}`]: value } };
  //     });
  //     if (mustMatch === '$and') {
  //       const res = await mongo.collection(`products`).updateMany(
  //         { storeId: id, $and: [...filters] },
  //         {
  //           $push: {
  //             'collections': { label: textInfo.title, value: x.toString() },
  //           },
  //         },
  //         { session }
  //       );
  //     } else {
  //       const res = await mongo.collection(`products`).updateMany(
  //         { storeId: id, $or: [...filters] },
  //         {
  //           $push: {
  //             collections: { label: textInfo.title, value: x.toString() },
  //           },
  //         },
  //         { session }
  //       );
  //     }
  //   }
  //   const storeDoc = await updateOne({
  //     query: { _id: new ObjectId(id) },
  //     update: {
  //       $push: {
  //         collections: {
  //           textInfo,
  //           collectionType,
  //           isActive,
  //           conditionS: {
  //             mustMatch: mustMatch,
  //             conditionArray: conditionArray,
  //           },
  //           _id: x.toString(),
  //         },
  //       },
  //     },
  //     options: { session },
  //     collection: client.db('generalData').collection(`storeInfo`),
  //   });
  //   result = x.toString();
  //   if (addedProductsArray?.length > 0) {
  //     const updateQuery = addedProductsArray?.map((product) => {
  //       return {
  //         updateOne: {
  //           filter: {
  //             'collections.value': { $ne: result },
  //             '_id': new ObjectId(product.value),
  //           },
  //           update: {
  //             $push: {
  //               collections: {
  //                 label: textInfo.title,
  //                 value: result,
  //               },
  //             },
  //           },
  //         },
  //       };
  //     });
  //     console.log(updateQuery);
  //     await client.db("base").collection('products').bulkWrite(updateQuery, { session });
  //   }
  //   return;
  // }
  ///////////////////// manual ///////////////
  await client
    .db('generalData')
    .collection(`storeInfo`)
    .updateOne(
      { _id: new ObjectId(id) },
      {
        $push: {
          collections: {
            textInfo,
            collectionType,
            isActive,
            _id: x.toString(),
          },
        },
      },
      { session }
    );
  result = x.toString();
  if (addedProductsArray?.length > 0) {
    const updateQuery = addedProductsArray?.map((product) => {
      return {
        updateOne: {
          filter: {
            'collections.value': { $ne: result },
            '_id': new ObjectId(product.value),
          },
          update: {
            $push: {
              collections: {
                label: textInfo.title,
                value: result,
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
  //           iamges: 1,
  //           measurementSystem: 1,
  //         },
  //       },
  //       client.db("base").collection("products")
  //     );
  //     if (product.isActive) {
  //       storeFrontProducts.push(product);
  //     }
  //   }
  //   console.log(storeFrontProducts);
  //   await client
  //     .db("base")
  //     .collection("storeFronts")
  //     .updateOne(
  //       { _id: new ObjectId(id) },
  //       {
  //         $set: {
  //           [textInfo.title]: {
  //             collectionName: textInfo.title,
  //             collectionId: x.toString(),
  //             products: storeFrontProducts,
  //           },
  //         },
  //       }
  //     );
  //   return;
  // }
  console.log('2hfhfhfhfhffhhfhfhfhfhfh1');
  if (isActive) {
    await client
      .db('base')
      .collection('storeFronts')
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            [textInfo.title]: {
              collectionName: textInfo.title,
              collectionId: x.toString(),
              products: [],
            },
          },
        },
        {}
      );
  }
  return result;
};
interface HandlerProps extends Omit<MainFunctionProps, 'arg'> {}
('use strict');
import { MainFunctionProps, mainWrapperWithSession } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event, ctx, callback) => {
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  };

  const response = await mainWrapperWithSession({
    ctx,
    callback,
    event,
    mainFunction: handlerHandler,
    sessionPrefrences: transactionOptions,
  });
  return response; // Ensures that the client will close when you finish/error
};
