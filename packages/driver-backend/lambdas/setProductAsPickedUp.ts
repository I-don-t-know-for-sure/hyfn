export const setProductAsPickedUpHandler = async ({ arg, client }) => {
  var result;
  const { QTYFound, productId, productKey, storeId, country, driverId, orderId } = arg[0];
  const driverDoc = await client
    .db('generalData')
    .collection('driverData')
    .findOne(
      {
        _id: new ObjectId(driverId),
      },
      {}
    );
  const { orderIds } = driverDoc;
  const driverTakenOrder = orderIds.find((id) => id === orderId);
  if (!driverTakenOrder) {
    throw new Error('driver did not take the order');
  }
  const orderDoc = await client
    .db('base')
    .collection('orders')
    .findOne({ _id: new ObjectId(orderId) }, {});
  if (!orderDoc.serviceFeePaid) {
    throw new Error('service fee not paid yet');
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
        arrayFilters: [{ 'store._id': new ObjectId(storeId) }, { 'product.key': productKey }],
      }
    );
  result = 'success';
  return result;
};
interface SetProductAsPickedUpProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: setProductAsPickedUpHandler });
};
