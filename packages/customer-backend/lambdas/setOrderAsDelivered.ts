export const setOrderAsDeliveredHandler = async ({ arg, client, userId }: MainFunctionProps) => {
  const { orderId, country } = arg[0];
  const { id } = await getCustomerInfo({
    client,
    options: { projection: {}, session: undefined },
    userId,
  });
  // const orderDoc = await client
  //   .db('base')
  //   .collection('orders')
  //   .findOne({ id: new ObjectId(orderId) }, {});
  // if (!orderDoc) {
  //   throw new Error(returnsObj['jbdj']);
  // }
  // const customerId = id;
  // orderDoc.orders.map((store) => {
  //   if (store.paid !== true) {
  //     throw new Error(returnsObj['not all stores are paid']);
  //   }
  // });
  // // if (orderDoc.delivered) {
  // //   throw new Error(returnsObj["Order already delivered"]);
  // // }
  // await client
  //   .db('base')
  //   .collection('orders')
  //   .updateOne(
  //     { id: new ObjectId(orderId) },
  //     {
  //       $set: {
  //         ['status.$[customer].status']: USER_STATUS_DELIVERED,
  //       },
  //     },
  //     {
  //       arrayFilters: [{ 'customer.id': customerId }],
  //     }
  //   );
};
interface SetOrderAsDeliveredProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { returnsObj } from 'hyfn-types';
import { ObjectId } from 'mongodb';

import { mainWrapper } from 'hyfn-server/src';
import { MainFunctionProps } from 'hyfn-server/src';
import { getCustomerInfo } from './common/getCustomerInfo';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: setOrderAsDeliveredHandler });
};
