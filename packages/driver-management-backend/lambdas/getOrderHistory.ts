export const getOrderHistoryHandler = async ({ arg, client, userId }: MainFunctionProps) => {
  const { lastDoc, country } = arg[0];
  const userDocument = await client
    .db('generalData')
    .collection('driverDocument')
    .findOne(
      { userId },
      {
        projection: {
          id: 1,
        },
      }
    );
  const { id } = userDocument;
  if (lastDoc) {
    const result = await client
      .db('base')
      .collection('orders')
      .find({
        $and: [
          {
            id: { $gt: new ObjectId(lastDoc) },
          },
          { driverManager: id },
          {
            status: {
              $elemMatch: { status: DRIVER_STATUS_DELIVERED, userType: USER_TYPE_DRIVER },
            },
          },
        ],
      })
      .limit(20)
      .toArray();
    return result;
  }
  const result = await client
    .db('base')
    .collection('orders')
    .find({
      $and: [
        { driverManager: id },
        {
          status: {
            $elemMatch: { status: DRIVER_STATUS_DELIVERED, userType: USER_TYPE_DRIVER },
          },
        },
      ],
    })
    .limit(20)
    .toArray();
  return result;
};
interface GetOrderHistoryProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { DRIVER_STATUS_DELIVERED, USER_TYPE_DRIVER } from 'hyfn-types';
import { ObjectId } from 'mongodb';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getOrderHistoryHandler });
};
