interface GetOrderHistoryProps extends Omit<MainFunctionProps, 'arg'> {}
('use strict');
import { ObjectId } from 'mongodb';
import { ORDER_STATUS_DELIVERED, USER_TYPE_CUSTOMER } from 'hyfn-types';
import { mainWrapper } from 'hyfn-server';
import { MainFunctionProps } from 'hyfn-server';
interface GetOrderHistoryProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
export const getOrderHistory = async ({ arg, client }: GetOrderHistoryProps) => {
  var result;
  const { customerId, status, country, lastDoc } = arg[0];
  if (lastDoc) {
    result = await client
      .db('base')
      .collection('orders')
      .find({
        $or: [
          {
            id: { $gt: new ObjectId(lastDoc) },
            status: {
              $elemMatch: {
                id: customerId,
                userType: USER_TYPE_CUSTOMER,
                status: ORDER_STATUS_DELIVERED,
              },
            },
          },
          {
            id: { $gt: new ObjectId(lastDoc) },
            status: {
              $elemMatch: {
                id: customerId,
                userType: USER_TYPE_CUSTOMER,
                status: ORDER_STATUS_DELIVERED,
              },
            },
            canceled: true,
          },
        ],
      })
      .limit(20)
      .toArray();
    return result;
  }
  result = await client
    .db('base')
    .collection('orders')
    .find({
      $or: [
        {
          status: {
            $elemMatch: {
              id: customerId,
              userType: USER_TYPE_CUSTOMER,
              status: ORDER_STATUS_DELIVERED,
            },
          },
        },
        {
          status: {
            $elemMatch: {
              id: customerId,
              userType: USER_TYPE_CUSTOMER,
              status: ORDER_STATUS_DELIVERED,
            },
          },
          canceled: true,
        },
      ],
    })
    .limit(20)
    .toArray();
  return result;
  // Ensures that the client will close when you finish/error
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getOrderHistory });
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
