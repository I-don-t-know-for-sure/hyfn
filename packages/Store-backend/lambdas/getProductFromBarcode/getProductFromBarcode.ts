interface GetProductFromBarcodeProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
'use strict';

import { mainWrapper } from 'hyfn-server';

export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client }) => {
    var result;

    const { searchString } = arg[0];

    const products = await client
      .db('productsLibrary')
      .collection('products')
      .find({ barcode: searchString }, { projection: { ['textInfo.title']: 1, images: 1 } })
      .limit(20)
      .toArray();

    result = products;

    return result;
  };
  return await mainWrapper({ event, ctx, mainFunction });

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
