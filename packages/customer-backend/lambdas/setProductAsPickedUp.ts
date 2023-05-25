export const setProductAsPickedUpHandler = async ({ arg, client }: MainFunctionProps) => {
  var result;
  const { QTYFound, productId, storeId, country, orderId } = arg[0];
  // const orderDoc = await findOne({id: new ObjectId(orderId)}, {}, client.db("base").collection('orders'))
  await client
    .db('base')
    .collection('orders')
    .updateOne(
      {
        id: new ObjectId(orderId),
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
          { 'store.id': new ObjectId(storeId) },
          { 'product.id': new ObjectId(productId) },
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
