'use strict';

import { mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';

export const handler = async (event) => {
  const mainFunction = async ({ arg, client }) => {
    var result;

    const driverDocId = arg[0];
    // const driverInfo = await driverInfoSchema.validate(arg[1]);
    const { _id, driverId, balance, ...driverInfo } = await arg[1];
    const passportNumber = driverInfo?.passportNumber?.replace(/\s/g, '');

    const { userId } = arg[arg.length - 1];
    const driverDoc = await client
      .db('generalData')
      .collection('driverData')
      .findOne({ driverId: userId }, {});

    if (driverDoc.verified) {
      throw new Error('You can not change your data after verification');
    }
    await client
      .db('generalData')
      .collection('driverData')
      .updateOne(
        {
          driverId: userId,
        },
        {
          $set: {
            ...driverInfo,
            passportNumber,
          },
        },
        {}
      );

    return result;
  };
  return await mainWrapper({ event, mainFunction });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
