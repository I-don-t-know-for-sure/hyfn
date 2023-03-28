import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { DRIVER_STATUS_IN_PROGRESS, USER_TYPE_DRIVER } from 'hyfn-types';
import { ObjectId } from 'mongodb';

export const handler = async (event) => {
  const mainFunction = async ({ arg, client, userId }: MainFunctionProps) => {
    const { lastDoc, country } = arg[0];
    const userDocument = await client
      .db('generalData')
      .collection('driverManagement')
      .findOne({ userId }, { projection: { _id: 1 } });
    const { _id } = userDocument;
    if (lastDoc) {
      const result = await client
        .db('base')
        .collection('orders')
        .find({
          $and: [
            {
              _id: { $gt: new ObjectId(lastDoc) },
            },
            { driverManager: _id.toString() },
            {
              status: {
                $elemMatch: { status: DRIVER_STATUS_IN_PROGRESS, userType: USER_TYPE_DRIVER },
              },
            },
          ],
        })
        .limit(10)
        .toArray();
      return result;
    }
    const result = await client
      .db('base')
      .collection('orders')
      .find({
        $and: [
          { driverManager: _id.toString() },
          {
            status: {
              $elemMatch: { status: DRIVER_STATUS_IN_PROGRESS, userType: USER_TYPE_DRIVER },
            },
          },
        ],
      })
      .limit(10)
      .toArray();
    return result;
  };
  return await mainWrapper({ event, mainFunction });
};
