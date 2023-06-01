export const getOrderHistoryHandler = async ({ arg, client, db }: GetOrderHistoryProps) => {
  const { driverId, country, lastDoc } = arg[0];
  if (lastDoc) {
    return await client
      .db('base')
      .collection('orders')
      .find({
        id: { $gt: new ObjectId(lastDoc) },
        status: { $elemMatch: { id: driverId, status: USER_STATUS_DELIVERED } },
      })
      .limit(20)
      .toArray();
  }

  return await client
    .db('base')
    .collection('orders')
    .find({
      status: { $elemMatch: { id: driverId, status: USER_STATUS_DELIVERED } },
    })
    .limit(20)
    .toArray();
};
interface GetOrderHistoryProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { mainWrapper, MainFunctionProps } from 'hyfn-server';
import { ObjectId } from 'mongodb';
import { USER_STATUS_DELIVERED } from 'hyfn-types';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getOrderHistoryHandler });
};
