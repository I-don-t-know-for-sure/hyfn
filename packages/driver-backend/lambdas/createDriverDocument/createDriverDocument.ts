'use strict';

import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';

export const handler = async (event) => {
  const mainFunction = async ({ arg, session, client, event }: MainFunctionProps) => {
    var result;

    const { balance, ...driverInfo } = arg[0];
    const driverId = arg[1];
    // TODO remove this arg
    // const { accessToken, userId } = arg[2];

    const passportNumber = driverInfo?.passportNumber?.replace(/\s/g, '');

    const details = await client
      .db('generalData')
      .collection('driverData')
      .insertOne(
        {
          ...driverInfo,
          driverId: driverId,
          passportNumber,
          verified: false,
        },

        {}
      );

    // await client
    //   .db('generalData')
    //   .collection('driverVerification')
    //   .insertOne({ ...driverInfo, driverId: driverId });

    console.log(details, 'djdjddjdjd');
    result = 'success';

    return result;
  };
  return await mainWrapper({ event, mainFunction });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
