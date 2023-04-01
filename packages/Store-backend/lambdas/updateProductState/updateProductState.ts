interface UpdateProductStateProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
'use strict';

import { MainFunctionProps, mainWrapperWithSession } from 'hyfn-server';
import { ObjectId } from 'mongodb';

export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client, session }: MainFunctionProps) => {
    const product = arg[0];
    const {
      textInfo,
      pricing,
      inventory,
      measurementSystem,
      shipping,
      options,
      isActive,
      imagesURLs,
      collections,
    } = product;
    console.log(arg);

    const { storeFrontId, id, country, city } = arg[1];
    const productId = arg[2];

    var returnValue = 'initial';

    await client
      .db('base')
      .collection('products')
      .updateOne(
        {
          _id: new ObjectId(productId),
        },
        {
          $set: {
            isActive,
          },
        },
        { session }
      );

    returnValue = 'success';

    return { message: returnValue };
  };
  return await mainWrapperWithSession({
    event,
    ctx,
    mainFunction,
    sessionPrefrences: {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    },
  });

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
