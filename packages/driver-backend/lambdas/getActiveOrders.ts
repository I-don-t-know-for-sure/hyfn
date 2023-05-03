('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { USER_STATUS_DELIVERED } from 'hyfn-types';
import { ObjectId } from 'mongodb';
interface GetActiveOrderProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const getActiveOrderHandler = async ({ arg, client }: MainFunctionProps) => {
  var result;
  const { driverId, orderId, country, lastDoc } = arg[0];
  // await argValidations(arg);
  result = await client
    .db('base')
    .collection('orders')
    .find(
      {
        ...(lastDoc ? { _id: { $gt: new ObjectId(lastDoc) } } : {}),
        'status.status': { $ne: USER_STATUS_DELIVERED },
        'status._id': driverId,
      },
      {
        // arrayFilters: [{ 'driver._id': id }]
      }
    )
    .limit(10)
    .toArray();

  //   const sameDriverId = result.status.find((status) => {
  //     return status._id === driverId;
  //   });
  //   if (sameDriverId) {
  return result;
  //   } else {
  // throw new Error('not same driver');
  //   }
};
// import { ObjectId } from 'mongodb';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getActiveOrderHandler });
};
