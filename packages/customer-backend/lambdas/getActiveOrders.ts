interface GetActiveOrdersProps extends Omit<MainFunctionProps, 'arg'> {}
('use strict');
import { ObjectId } from 'mongodb';
import { ORDER_STATUS_DELIVERED, USER_TYPE_CUSTOMER } from 'hyfn-types';
import { MainFunctionProps, MainWrapperProps, mainWrapper } from 'hyfn-server';
interface GetActiveOrdersProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
export const getActiveOrders = async ({ arg, client }: GetActiveOrdersProps) => {
  var result;
  console.log(arg);
  const { customerId, status, country, lastDoc } = arg[0];
  console.log('shshssh');
  if (lastDoc) {
    result = await client
      .db('base')
      .collection('orders')
      .find({
        $and: [
          { _id: { $gt: new ObjectId(lastDoc) } },
          {
            status: {
              $elemMatch: {
                _id: customerId,
                status: { $ne: ORDER_STATUS_DELIVERED },
                userType: USER_TYPE_CUSTOMER,
              },
            },
          },
          // { 'status._id': customerId },
          // { 'status.status': { $ne: ORDER_STATUS_DELIVERED } },
          // { 'status.userType': 'customer' },
          { canceled: { $exists: false } },
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
      $and: [
        {
          status: {
            $elemMatch: {
              _id: customerId,
              status: { $ne: ORDER_STATUS_DELIVERED },
              userType: USER_TYPE_CUSTOMER,
            },
          },
        },
        { canceled: { $exists: false } },
        // status: {
        //   $elemMatch: {
        //     _id: customerId,
        //     status: "customer",
        //     userType: "customer",
        //   },
        // },
      ],
    })
    .limit(20)
    .toArray();
  return result;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getActiveOrders });
  // Ensures that the client will close when you finish/error
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
