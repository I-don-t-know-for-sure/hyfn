interface SetProductAsPickedUpProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
'use strict';

import { mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';

export const handler = async (event) => {
  const mainFunction = async ({ arg, client }) => {
    var result;

    const { QTYFound, productId, productKey, storeId, country, driverId } = arg[0];

    const driverDoc = await client
      .db('generalData')
      .collection('driverData')
      .findOne(
        {
          _id: new ObjectId(driverId),
        },
        {}
      );

    const { orderId } = driverDoc;

    const orderDoc = await client
      .db('base')
      .collection('orders')
      .findOne({ _id: new ObjectId(orderId) }, {});

    if (!orderDoc.serviceFeePaid) {
      throw new Error('service fee not paid yet');
    }

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
          arrayFilters: [{ 'store._id': new ObjectId(storeId) }, { 'product.key': productKey }],
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
