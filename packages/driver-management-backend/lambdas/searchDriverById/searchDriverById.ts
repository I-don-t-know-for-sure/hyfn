'use strict';

import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';

export const handler = async (event) => {
  const mainFunction = async ({ arg, client }: MainFunctionProps) => {
    const { driverId } = arg[0];
    const result = await client
      .db('generalData')
      .collection('driverData')
      .findOne({ _id: new ObjectId(driverId) });
    if (result) {
      return result;
    }
    return 'driver not found';
  };

  const result = await mainWrapper({ event, mainFunction });
  return result;
};
