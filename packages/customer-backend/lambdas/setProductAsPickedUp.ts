export const setProductAsPickedUpHandler = async ({ arg, client }) => {
  var result;
  const { QTYFound, productId, storeId, country, orderId } = arg[0];
  // const orderDoc = await findOne({_id: new ObjectId(orderId)}, {}, client.db("base").collection('orders'))
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
          { 'store._id': new ObjectId(storeId) },
          { 'product._id': new ObjectId(productId) },
        ],
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
