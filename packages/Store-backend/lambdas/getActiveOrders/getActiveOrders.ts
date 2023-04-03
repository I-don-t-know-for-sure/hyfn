export const getActiveOrdersHandler = async ({ arg, client }) => {
  const { status, city, country, id, lastDoc } = arg[0];
  const db = client.db('base');
  if (lastDoc) {
    const orders = await db
      .collection(`orders`)
      .find({
        _id: { $gt: new ObjectId(lastDoc) },
        canceled: { $exists: false },
        $or: [
          {
            $and: [
              {
                status: {
                  $elemMatch: {
                    _id: new ObjectId(id),
                    userType: USER_TYPE_STORE,
                    status: { $ne: ORDER_STATUS_DELIVERED },
                  },
                },
              },
              {
                status: {
                  $elemMatch: {
                    userType: USER_TYPE_DRIVER,
                    _id: { $ne: '' },
                  },
                },
              },
            ],
          },
          { orderType: ORDER_TYPE_PICKUP },
        ],
      })
      .limit(20)
      .toArray();
    return orders;
  }
  const orders = await db
    .collection(`orders`)
    .find({
      canceled: { $exists: false },
      $or: [
        {
          $and: [
            {
              status: {
                $elemMatch: {
                  _id: new ObjectId(id),
                  userType: USER_TYPE_STORE,
                  status: { $ne: ORDER_STATUS_DELIVERED },
                },
              },
            },
            // {
            //   status: {
            //     $elemMatch: {
            //       userType: USER_TYPE_DRIVER,
            //       _id: { $ne: '' },
            //     },
            //   },
            // },
          ],
        },
        {
          $and: [
            {
              status: {
                $elemMatch: {
                  _id: new ObjectId(id),
                  userType: USER_TYPE_STORE,
                  status: { $ne: ORDER_STATUS_DELIVERED },
                },
              },
            },
            { orderType: ORDER_TYPE_PICKUP },
          ],
        },
      ],
    })
    .limit(20)
    .toArray();
  console.log(JSON.stringify(orders));
  return orders;
};
interface GetActiveOrdersProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { ObjectId } from 'mongodb';
import {
  ORDER_STATUS_DELIVERED,
  ORDER_TYPE_PICKUP,
  USER_TYPE_DRIVER,
  USER_TYPE_STORE,
} from '../resources';
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: getActiveOrdersHandler });
};
