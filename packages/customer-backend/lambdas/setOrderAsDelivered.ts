export const setOrderAsDeliveredHandler = async ({ arg, client, userId }: MainFunctionProps) => {
  const { orderId, country } = arg[0];
  const { _id } = await getCustomerInfo({
    client,
    options: { projection: {}, session: undefined },
    userId,
  });
  const orderDoc = await client
    .db('base')
    .collection('orders')
    .findOne({ _id: new ObjectId(orderId) }, {});
  if (!orderDoc) {
    throw new Error('jbdj');
  }
  const customerId = _id.toString();
  orderDoc.orders.map((store) => {
    if (store.paid !== true) {
      throw new Error('not all stores are paid');
    }
  });
  // if (orderDoc.delivered) {
  //   throw new Error('Order already delivered');
  // }
  await client
    .db('base')
    .collection('orders')
    .updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          ['status.$[customer].status']: USER_STATUS_DELIVERED,
        },
      },
      {
        arrayFilters: [{ 'customer._id': customerId }],
      }
    );
};
interface SetOrderAsDeliveredProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { ObjectId } from 'mongodb';
import { USER_STATUS_DELIVERED } from 'hyfn-types';
import { mainWrapper } from 'hyfn-server/src';
import { MainFunctionProps } from 'hyfn-server/src';
import { getCustomerInfo } from './common/getCustomerInfo';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: setOrderAsDeliveredHandler });
};
