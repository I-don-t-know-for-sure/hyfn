interface RemoveDriverFromManagementDriversProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
'use strict';

import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';

export const handler = async (event) => {
  const mainFunction = async ({ arg, client, userId, session }: MainFunctionProps) => {
    const { driverId } = arg[0];
    const userDocument = await client
      .db('generalData')
      .collection('driverManageMent')
      .findOne({ userId });
    const { _id, verified } = userDocument;
    const managementId = _id.toString();

    const driverDoc = await client
      .db('generalData')
      .collection('driverData')
      .findOne({ _id: new ObjectId(driverId) }, { session });

    const storeTrustsDriver = driverDoc?.driverManagement[0] === _id.toString();

    if (!storeTrustsDriver) {
      throw new Error('this driver is not in your list');
    }

    if (driverDoc.onDuty) {
      await client
        .db('generalData')
        .collection('driverData')
        .updateOne(
          { _id: new ObjectId(driverId) },
          {
            $set: {
              removeDriverAfterOrder: true,
            },
          },
          { session }
        );
      return 'driver will be removed after he delivers their orders';
    }
    // if (driverDoc.onDuty) {
    //   await client
    //     .db('generalData')
    //     .collection('driverData')
    //     .updateOne(
    //       { _id: new ObjectId(driverId) },
    //       {
    //         $set: {
    //           removeDriverAfterOrder: true,
    //         },
    //       }
    //     );

    //   return 'driver is delivering an order your trust will be taken after they finish the order';
    //   // throw new Error('Driver is delivering an order')
    // }

    // decrease the trustBalnce for store

    // remove driver from store drivers
    await client
      .db('generalData')
      .collection('driverData')
      .updateOne(
        { _id: new ObjectId(driverId) },
        {
          $set: {
            driverManagement: [],
          },
        },
        { session }
      );
    if (!verified) {
      await client
        .db('generalData')
        .collection('driverManagement')
        .updateOne(
          { userId },
          {
            $inc: {
              usedBalance: -Math.abs(parseInt(driverDoc.balance)),
            },
          },

          { session }
        );
    }
    return 'driver was removed from trusted list';
  };

  const result = await mainWrapper({
    event,
    mainFunction,
  });
  return result;
};
