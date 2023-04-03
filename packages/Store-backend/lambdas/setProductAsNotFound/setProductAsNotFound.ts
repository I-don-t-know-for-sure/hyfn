export const setProductAsNotFoundHandler = async ({ arg, client, userId }: MainFunctionProps) => {
  var result;
  const { productKey, orderId } = arg[0];
  const { _id: storeId, country } = await client
    .db('generalData')
    .collection('storeInfo')
    .findOne({ userId }, { projection: { _id: 1, country: 1 } });
  const orderDoc = await client
    .db('base')
    .collection('orders')
    .findOne(
      {
        _id: new ObjectId(orderId) as any,
        status: {
          $elemMatch: { userType: USER_TYPE_STORE, _id: new ObjectId(storeId.toString()) },
        },
      },
      { projection: { _id: 1, orders: 1, serviceFeePaid: 1 } }
    );
  const storeOrder = orderDoc.orders.find((store) => store._id.toString() === storeId.toString());
  if (
    storeOrder.orderStatus !== STORE_STATUS_PENDING &&
    storeOrder.orderStatus !== STORE_STATUS_ACCEPTED
  ) {
    throw new Error('can not edit order products after payment');
  }
  await client
    .db('base')
    .collection('orders')
    .updateOne(
      {
        _id: new ObjectId(orderId),
      },
      {
        $set: {
          [`orders.$[store].addedProducts.$[product].pickup`]: {
            pickedUp: false,
            QTYFound: 0,
          },
        },
      },
      {
        arrayFilters: [
          { 'store._id': new ObjectId(storeId.toString()) },
          { 'product.key': productKey },
        ],
      }
    );
  result = 'success';
  return result;
};
interface SetProductAsNotFoundProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { mainWrapper, MainFunctionProps } from 'hyfn-server';
import { ObjectId } from 'mongodb';
import { USER_TYPE_STORE, STORE_STATUS_PENDING, STORE_STATUS_ACCEPTED } from 'hyfn-types';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: setProductAsNotFoundHandler });
};
