import { mainWrapper, MainFunctionProps } from 'hyfn-server';
import { ObjectId } from 'mongodb';
import { STORE_STATUS_ACCEPTED, STORE_STATUS_PENDING, USER_TYPE_STORE } from 'hyfn-types';

export const handler = async (event) => {
  const mainFunction = async ({ arg, client, userId }: MainFunctionProps) => {
    var result;

    const { QTYFound, productKey, orderId } = arg[0];

    const { _id, country } = await client
      .db('generalData')
      .collection('storeInfo')
      .findOne({ userId }, { projection: { _id: 1, country: 1 } });

    const orderDoc = await client
      .db('base')
      .collection('orders')
      .findOne(
        {
          _id: new ObjectId(orderId) as any,
          status: { $elemMatch: { userType: USER_TYPE_STORE, _id: new ObjectId(_id.toString()) } },
        },
        { projection: {} }
      );
    console.log('🚀 ~ file: setProductAsPickedUp.ts:37 ~ mainFunction ~ orderDoc:', orderDoc);

    const storeOrder = orderDoc.orders.find((store) => store._id.toString() === _id.toString());

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
              pickedUp: true,
              QTYFound,
            },
          },
        },
        {
          arrayFilters: [
            { 'store._id': new ObjectId(_id.toString()) },
            { 'product.key': productKey },
          ],
        }
      );
    result = 'success';

    return result;
  };
  return await mainWrapper({ event, mainFunction });
};
