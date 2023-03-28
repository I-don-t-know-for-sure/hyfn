'use strict';

import { ObjectId } from 'mongodb';
import { mainWrapper } from 'hyfn-server/src';
import { MainFunctionProps } from 'hyfn-server/src';

export const handler = async (event) => {
  const mainFunction = async ({ arg, client }: MainFunctionProps) => {
    var result;

    //   const arg = event;
    const { addresses, customerId } = arg[0];

    // const schema = array().of(
    //   object({
    //     label: string().required(),
    //     coords: array().length(2).of(number()).required(),
    //     locationDescription: string(),
    //     key: string(),
    //   })
    //     .strict()
    //     .noUnknown()
    // );

    const validatedAddresses = addresses;

    await client
      .db('generalData')
      .collection('customerInfo')
      .updateOne(
        { _id: new ObjectId(customerId) },
        {
          $set: {
            addresses: validatedAddresses,
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
