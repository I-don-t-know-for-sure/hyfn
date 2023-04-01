interface SetProductAsPickedUpProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
'use strict';

import { ObjectId } from 'mongodb';
import { mainWrapper } from 'hyfn-server/src';

export const handler = async (event) => {
  const mainFunction = async ({ arg, client }) => {
    var result;

    const { QTYFound, productId, storeId, country, orderId } = arg[0];

    // const orderDoc = await findOne({_id: new ObjectId(orderId)}, {}, client.db("base").collection('orders'))

    await client
      .db('base')
      .collection('orders')
      .updateOne(
        {
          _id: new ObjectId(orderId),
        },
        {
          $set: {
            [`orders.$[store].addedProducts.$[product].pickup`]: {
              pickedUp: true,
              QTYFound,
            },
          },
        },
        {
          arrayFilters: [
            { 'store._id': new ObjectId(storeId) },
            { 'product._id': new ObjectId(productId) },
          ],
        }
      );
    result = 'success';

    return result;
  };
  return await mainWrapper({ event, mainFunction });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
