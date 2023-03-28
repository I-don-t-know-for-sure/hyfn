const ObjectId = require('mongodb').ObjectId;

import { mainWrapperWithSession } from 'hyfn-server';
import { deleteImages } from '../common/utils/deleteImages';

export const handler = async (event, ctx) => {
  // await argValidations(arg);

  const mainFunction = async ({ arg, client, event }) => {
    const mongo = client;
    var result = 'initial';
    const { id, country, city } = arg[0];
    const productId = arg[1];

    const db = mongo.db('base');
    const product = await db.collection(`products`).findOne({ _id: new ObjectId(productId) }, {});

    if (product.images.length > 0) {
      await deleteImages(product.images);
    }
    await db.collection(`products`).deleteOne({ storeId: id, _id: new ObjectId(productId) });
    // const storeFront = await findOne(
    //   { _id: new ObjectId(id) },
    //   { session },
    //   db.collection(`storeFronts`)
    // );
    // for (let i = 0; i < product.collections?.length; i++) {
    //   const collection = product.collections[i];

    //   console.log("happened");

    //   if (storeFront[`${collection.label}`].products?.length > 1) {
    //     console.log(storeFront);

    //     await db.collection(`storeFronts`).updateOne(
    //       { _id: new ObjectId(id) },
    //       {
    //         $pull: {
    //           [`${collection.label}.products`]: {
    //             _id: new ObjectId(productId),
    //           },
    //         },
    //       },
    //       {
    //         session,
    //       }
    //     );
    //     continue;
    //   }

    //   await db.collection(`storeFronts`).updateOne(
    //     { _id: new ObjectId(id) },
    //     {
    //       $unset: { [`${collection.label}`]: "" },
    //     },
    //     { session }
    //   );
    // }

    // await session.abortTransaction();
    return result;
  };

  return await mainWrapperWithSession({
    event,
    ctx,
    mainFunction,
  });
};
