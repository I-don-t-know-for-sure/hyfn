'use strict';

import { mainWrapper } from 'hyfn-server/src';
import { MainFunctionProps } from 'hyfn-server/src';

export const handler = async (event) => {
  const mainFunction = async ({ arg, session, client, event }: MainFunctionProps) => {
    var result;

    const customerInfo = arg[1];
    const { userId: customerId } = arg[arg?.length - 1];

    await client
      .db('generalData')
      .collection('customerInfo')
      .updateOne(
        {
          customerId,
        },
        {
          $set: {
            name: customerInfo.name,
            // country: customerInfo.country,
          },
        },
        {}
      );

    result = 'success';

    return result;
  };
  return await mainWrapper({ event, mainFunction });

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
