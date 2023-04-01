interface GetActiveOrderProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
'use strict';

import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';

export const handler = async (event) => {
  const mainFunction = async ({ arg, client }: MainFunctionProps) => {
    var result;

    const { driverId, orderId, country } = arg[0];

    // await argValidations(arg);

    result = await client
      .db('base')
      .collection('orders')
      .findOne(
        {
          _id: new ObjectId(orderId),
        },
        {}
      );
    console.log('');
    console.log('');

    const sameDriverId = result.status.find((status) => {
      return status._id === driverId;
    });

    if (sameDriverId) {
      return result;
    } else {
      throw new Error('not same driver');
    }
  };
  return await mainWrapper({ event, mainFunction });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
